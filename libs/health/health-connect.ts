// Health Connect provider: reads what my phone pushed to /api/health/ingest
// (Samsung Health → Health Connect → Life Dashboard Companion → Supabase).
import type { HealthProvider, HealthSummary, SeriesPoint, SleepStage, SleepSummary } from './types'
import { db, dbConfigured } from './db'

const HOUR = 3600_000
const DAY = 24 * HOUR

export function startOfLocalDay(now: number, offsetMin: number) {
  const off = offsetMin * 60_000
  return Math.floor((now + off) / DAY) * DAY - off
}

const localDate = (t: number, offsetMin: number) =>
  new Date(t + offsetMin * 60_000).toISOString().slice(0, 10)

// Health Connect stage names → ours
const STAGE: Record<string, SleepStage> = {
  awake: 'awake',
  awake_in_bed: 'awake',
  out_of_bed: 'out-of-bed',
  light: 'light',
  deep: 'deep',
  rem: 'rem',
  sleeping: 'asleep',
  unknown: 'asleep'
}

const round1 = (n: number | null) => (n == null ? null : Math.round(n * 10) / 10)
const ms = (iso: string) => new Date(iso).getTime()

interface Row {
  type: string
  start_at: string
  end_at: string | null
  value: number | null
  data: any
}

export function hourly(rows: Row[], from: number, to: number, mode: 'sum' | 'avg', size = HOUR): SeriesPoint[] {
  const buckets = new Map<number, { sum: number; n: number }>()
  for (let t = from; t < to; t += size) buckets.set(t, { sum: 0, n: 0 })
  for (const r of rows) {
    if (r.value == null) continue
    const t = ms(r.start_at)
    if (t < from || t >= to) continue
    const k = from + Math.floor((t - from) / size) * size
    const b = buckets.get(k)!
    b.sum += r.value
    b.n++
  }
  return Array.from(buckets.entries())
    .filter(([, b]) => mode === 'sum' || b.n > 0)
    .map(([t, b]) => ({ t, v: Math.round(mode === 'sum' ? b.sum : b.sum / b.n) }))
}

export function summariseSleep(r: Row | undefined): SleepSummary | null {
  if (!r || !r.end_at) return null
  const start = ms(r.start_at)
  const end = ms(r.end_at)
  const stagesIn: { stage: string; seconds: number }[] = r.data?.stages || []
  if (!stagesIn.length) {
    return { start, end, asleepMs: end - start, inBedMs: end - start, stages: { asleep: end - start }, source: 'session' }
  }
  const stages: Partial<Record<SleepStage, number>> = {}
  for (const s of stagesIn) {
    const k = STAGE[s.stage] || 'asleep'
    stages[k] = (stages[k] || 0) + s.seconds * 1000
  }
  const inBedMs = Object.values(stages).reduce((a, b) => a + (b || 0), 0)
  const notAsleep = (stages.awake || 0) + (stages['out-of-bed'] || 0)
  return { start, end, asleepMs: inBedMs - notAsleep, inBedMs, stages, source: 'segments' }
}

export const healthConnectProvider: HealthProvider = {
  name: 'Galaxy Watch',
  isConfigured: dbConfigured,
  async getSummary(now = Date.now()): Promise<HealthSummary> {
    const offset = Number(process.env.HEALTH_TZ_OFFSET_MINUTES ?? 120) // SAST
    const dayStart = startOfLocalDay(now, offset)
    const since = new Date(now - 36 * HOUR).toISOString()
    const sb = db()
    const warnings: string[] = []

    const [{ data: rows, error }, { data: totals }, { data: restingRows }] = await Promise.all([
      sb
        .from('health_records')
        .select('type,start_at,end_at,value,data')
        .in('type', ['steps', 'heart_rate', 'oxygen_saturation', 'sleep'])
        .gte('start_at', new Date(now - 48 * HOUR).toISOString()) // sleep can start the evening before
        .order('start_at', { ascending: true })
        .limit(20000),
      sb.from('health_daily_totals').select('steps').eq('date', localDate(now, offset)).maybeSingle(),
      sb
        .from('health_records')
        .select('value,start_at')
        .eq('type', 'resting_heart_rate')
        .order('start_at', { ascending: false })
        .limit(1)
    ])
    if (error) throw new Error(error.message)

    const all = (rows || []) as Row[]
    const of = (t: string) => all.filter(r => r.type === t)

    // Steps
    const stepRows = of('steps')
    // Samsung Health also writes one 24h summary record; it would pile into the first
    // hour and double count, so the hourly chart only uses records shorter than 2h.
    const granular = stepRows.filter(r => !r.end_at || ms(r.end_at) - ms(r.start_at) < 2 * HOUR)
    const stepHourly = hourly(granular, dayStart, Math.min(now, dayStart + DAY), 'sum')
    const stepSum = stepHourly.reduce((a, p) => a + p.v, 0)
    const today = totals?.steps ?? stepSum // daily total from Health Connect is de-duplicated across apps

    // Heart rate (last 24h)
    const hr = of('heart_rate').filter(r => ms(r.start_at) >= now - DAY && r.value != null)
    const hrHourly = hourly(hr, Math.floor((now - DAY) / (15 * 60_000)) * 15 * 60_000, now, 'avg', 15 * 60_000)
    const hrVals = hr.map(r => r.value as number)
    const latestHr = hr.length ? hr[hr.length - 1].value : null

    // Oxygen
    const ox = of('oxygen_saturation').filter(r => ms(r.start_at) >= now - DAY && r.value != null)

    // Sleep: most recent session that ended in the last 36h
    const sleep = of('sleep')
      .filter(r => r.end_at && r.end_at >= since)
      .sort((a, b) => ms(b.end_at!) - ms(a.end_at!))[0]

    if (!all.length) warnings.push('no recent data')

    return {
      configured: true,
      provider: 'Galaxy Watch',
      generatedAt: now,
      timezoneOffsetMinutes: offset,
      steps: { today, goal: 10000, hourly: stepHourly },
      heartRate: {
        latest: latestHr != null ? Math.round(latestHr) : null,
        average: hrVals.length ? round1(hrVals.reduce((a, b) => a + b, 0) / hrVals.length) : null,
        min: hrVals.length ? Math.min(...hrVals) : null,
        max: hrVals.length ? Math.max(...hrVals) : null,
        resting: round1(restingRows?.[0]?.value ?? null),
        hourly: hrHourly
      },
      sleep: summariseSleep(sleep),
      oxygen: { average: ox.length ? round1(ox.reduce((a, r) => a + (r.value as number), 0) / ox.length) : null },
      warnings
    }
  }
}
