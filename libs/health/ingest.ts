// Turns a Life Dashboard Companion webhook payload into rows.
// Payload reference: github.com/owen282000/life-dashboard-companion-app/blob/master/docs/webhook.md
import crypto from 'crypto'

export interface HealthRow {
  uuid: string
  type: string
  start_at: string
  end_at: string | null
  value: number | null
  data: Record<string, unknown> | null
  source: string | null
}

export interface DailyRow {
  date: string
  steps: number | null
  distance_meters: number | null
  active_calories: number | null
  total_calories: number | null
}

/** X-Signature: sha256=<hex HMAC-SHA256(secret, raw body)> */
export function verifySignature(raw: Buffer, header: string | undefined, secret: string) {
  if (!header || !header.startsWith('sha256=')) return false
  const expected = crypto.createHmac('sha256', secret.trim()).update(raw).digest('hex')
  const given = header.slice('sha256='.length).trim().toLowerCase()
  const a = Buffer.from(expected)
  const b = Buffer.from(given)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

const num = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : null)

// The app can send a series as buckets instead of raw records.
function bucketRow(type: string, r: any, value: number | null): HealthRow {
  return {
    uuid: `${type}:bucket:${r.bucket_start}`,
    type,
    start_at: r.bucket_start,
    end_at: r.bucket_end ?? null,
    value,
    data: { bucket: true, min: r.min ?? null, max: r.max ?? null, samples: r.sample_count ?? null },
    source: Array.isArray(r.sources) ? r.sources.join(',') : null
  }
}

export function toRows(p: any): { rows: HealthRow[]; daily: DailyRow[]; deleted: string[] } {
  const rows: HealthRow[] = []

  for (const r of p.steps || []) {
    if (r.bucket_start) rows.push(bucketRow('steps', r, num(r.total)))
    else if (r.uuid)
      rows.push({ uuid: r.uuid, type: 'steps', start_at: r.start_time, end_at: r.end_time ?? null, value: num(r.count), data: null, source: r.source ?? null })
  }

  for (const [key, field] of [
    ['heart_rate', 'bpm'],
    ['resting_heart_rate', 'bpm'],
    ['oxygen_saturation', 'percentage']
  ] as const) {
    for (const r of p[key] || []) {
      if (r.bucket_start) rows.push(bucketRow(key, r, num(r.avg)))
      else if (r.uuid)
        rows.push({ uuid: r.uuid, type: key, start_at: r.time, end_at: null, value: num(r[field]), data: null, source: r.source ?? null })
    }
  }

  for (const r of p.sleep || []) {
    if (!r.uuid || !r.session_end_time) continue
    const dur = num(r.duration_seconds) ?? 0
    const end = new Date(r.session_end_time).getTime()
    rows.push({
      uuid: r.uuid,
      type: 'sleep',
      start_at: new Date(end - dur * 1000).toISOString(),
      end_at: r.session_end_time,
      value: dur,
      data: { stages: (r.stages || []).map((s: any) => ({ stage: s.stage, seconds: num(s.duration_seconds) ?? 0 })) },
      source: r.source ?? null
    })
  }

  for (const r of p.exercise || []) {
    if (!r.uuid) continue
    rows.push({
      uuid: r.uuid,
      type: 'exercise',
      start_at: r.start_time,
      end_at: r.end_time ?? null,
      value: num(r.duration_seconds),
      data: { name: r.name ?? null, title: r.title ?? null },
      source: r.source ?? null
    })
  }

  const daily: DailyRow[] = (p.daily_totals || [])
    .filter((d: any) => d.date)
    .map((d: any) => ({
      date: d.date,
      steps: num(d.steps),
      distance_meters: num(d.distance_meters),
      active_calories: num(d.active_calories),
      total_calories: num(d.total_calories)
    }))

  const deleted: string[] = (p.deleted_records || [])
    .map((d: any) => d?.uuid)
    .filter((u: unknown): u is string => typeof u === 'string' && u.length > 0)

  return { rows: rows.filter(r => r.start_at), daily, deleted }
}
