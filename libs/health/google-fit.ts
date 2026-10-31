// Google Fit REST provider — server-side only.
// Uses the site owner's refresh token (GOOGLE_FIT_REFRESH_TOKEN), so visitors
// never sign in and no token ever reaches the browser.
//
// NOTE: Google is retiring the Google Fit APIs by the end of 2026.
// See libs/health/index.ts for how to switch providers.

import type {
  HealthProvider,
  HealthSummary,
  SeriesPoint,
  SleepStage,
  SleepSummary
} from './types'

const FIT = 'https://www.googleapis.com/fitness/v1/users/me'
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

// Google Fit sleep segment codes → stage
const SLEEP_STAGE: Record<number, SleepStage> = {
  1: 'awake',
  2: 'asleep',
  3: 'out-of-bed',
  4: 'light',
  5: 'deep',
  6: 'rem'
}
const NOT_ASLEEP: SleepStage[] = ['awake', 'out-of-bed']

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_FIT_REFRESH_TOKEN || '',
      grant_type: 'refresh_token'
    })
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token refresh failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const json = await res.json()
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in || 3600) * 1000
  }
  return cachedToken.value
}

async function fit(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${FIT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Fit ${path} → ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

interface AggregateBy {
  dataTypeName?: string
  dataSourceId?: string
}

function aggregate(
  token: string,
  by: AggregateBy,
  start: number,
  end: number,
  bucketMs: number
) {
  return fit('/dataset:aggregate', token, {
    method: 'POST',
    body: JSON.stringify({
      aggregateBy: [by],
      bucketByTime: { durationMillis: bucketMs },
      startTimeMillis: start,
      endTimeMillis: end
    })
  })
}

const pointsOf = (bucket: any): any[] =>
  (bucket?.dataset || []).flatMap((d: any) => d.point || [])

const round1 = (n: number | null) => (n == null ? null : Math.round(n * 10) / 10)

export function startOfLocalDay(now: number, offsetMin: number) {
  const off = offsetMin * 60 * 1000
  return Math.floor((now + off) / DAY) * DAY - off
}

async function getSteps(token: string, dayStart: number, now: number) {
  const json = await aggregate(
    token,
    { dataTypeName: 'com.google.step_count.delta' },
    dayStart,
    now,
    HOUR
  )
  const hourly: SeriesPoint[] = (json.bucket || []).map((b: any) => ({
    t: Number(b.startTimeMillis),
    v: pointsOf(b).reduce((s, p) => s + (p.value?.[0]?.intVal || 0), 0)
  }))
  return { today: hourly.reduce((s, p) => s + p.v, 0), hourly }
}

async function getHeartRate(token: string, start: number, now: number) {
  // Aggregates to com.google.heart_rate.summary: value = [avg, max, min]
  const json = await aggregate(
    token,
    { dataTypeName: 'com.google.heart_rate.bpm' },
    start,
    now,
    HOUR
  )
  const hourly: SeriesPoint[] = []
  let weighted = 0
  let count = 0
  let min: number | null = null
  let max: number | null = null
  for (const b of json.bucket || []) {
    const p = pointsOf(b)[0]
    if (!p) continue
    const [avg, hi, lo] = p.value.map((v: any) => v.fpVal)
    hourly.push({ t: Number(b.startTimeMillis), v: Math.round(avg) })
    weighted += avg
    count++
    min = min == null ? lo : Math.min(min, lo)
    max = max == null ? hi : Math.max(max, hi)
  }
  return {
    hourly,
    average: count ? round1(weighted / count) : null,
    latest: hourly.length ? hourly[hourly.length - 1].v : null,
    min: round1(min),
    max: round1(max)
  }
}

async function getRestingHeartRate(token: string, start: number, now: number) {
  const json = await aggregate(
    token,
    {
      dataSourceId:
        'derived:com.google.heart_rate.bpm:com.google.android.gms:resting_heart_rate<-merge_heart_rate_bpm'
    },
    start,
    now,
    now - start
  )
  const p = pointsOf(json.bucket?.[0]).pop()
  return p ? round1(p.value?.[0]?.fpVal ?? null) : null
}

async function getOxygen(token: string, start: number, now: number) {
  const json = await aggregate(
    token,
    { dataTypeName: 'com.google.oxygen_saturation' },
    start,
    now,
    now - start
  )
  const p = pointsOf(json.bucket?.[0])[0]
  return p ? round1(p.value?.[0]?.fpVal ?? null) : null
}

/**
 * Last night's sleep.
 *
 * The old version only looked at raw points from one merged data source over
 * the last 24h, so it missed sleep that started before the window, and
 * returned nothing for apps that only write a sleep *session*.
 *
 * Now: find the most recent sleep session (activityType 72) that ended in the
 * last 36h, then read the sleep segments inside it for stages. If the app
 * recorded no segments, fall back to the session's start/end.
 */
export async function getSleep(token: string, now: number): Promise<SleepSummary | null> {
  const from = new Date(now - 36 * HOUR).toISOString()
  const to = new Date(now).toISOString()
  const json = await fit(
    `/sessions?startTime=${encodeURIComponent(from)}&endTime=${encodeURIComponent(to)}&activityType=72`,
    token
  )
  const sessions: any[] = (json.session || []).sort(
    (a, b) => Number(b.endTimeMillis) - Number(a.endTimeMillis)
  )

  // Several sessions can make up one night (e.g. woke up at 3am).
  // Group everything within 3h of the latest session's start into one night.
  let start: number
  let end: number
  if (sessions.length) {
    end = Number(sessions[0].endTimeMillis)
    start = Number(sessions[0].startTimeMillis)
    for (const s of sessions.slice(1)) {
      if (Number(s.endTimeMillis) >= start - 3 * HOUR) {
        start = Math.min(start, Number(s.startTimeMillis))
      }
    }
  } else {
    // No session: look for segments in the last 36h directly.
    start = now - 36 * HOUR
    end = now
  }

  const seg = await aggregate(
    token,
    { dataTypeName: 'com.google.sleep.segment' },
    start,
    end,
    end - start
  )
  const points = pointsOf(seg.bucket?.[0])
  return summariseSleep(points, sessions.length ? { start, end } : null)
}

export function summariseSleep(
  points: any[],
  session: { start: number; end: number } | null
): SleepSummary | null {
  const stages: Partial<Record<SleepStage, number>> = {}
  let first = Infinity
  let last = 0
  for (const p of points) {
    const s = Number(p.startTimeNanos) / 1e6
    const e = Number(p.endTimeNanos) / 1e6
    if (!(e > s)) continue
    const stage = SLEEP_STAGE[p.value?.[0]?.intVal] || 'asleep'
    stages[stage] = (stages[stage] || 0) + (e - s)
    first = Math.min(first, s)
    last = Math.max(last, e)
  }

  if (last > 0) {
    const inBedMs = Object.values(stages).reduce((a, b) => a + (b || 0), 0)
    const awakeMs = NOT_ASLEEP.reduce((a, k) => a + (stages[k] || 0), 0)
    return {
      start: session?.start ?? first,
      end: session?.end ?? last,
      asleepMs: inBedMs - awakeMs,
      inBedMs,
      stages,
      source: 'segments'
    }
  }

  if (session) {
    const ms = session.end - session.start
    return {
      start: session.start,
      end: session.end,
      asleepMs: ms,
      inBedMs: ms,
      stages: { asleep: ms },
      source: 'session'
    }
  }
  return null
}

const settle = async <T>(p: Promise<T>, label: string, warnings: string[]) => {
  try {
    return await p
  } catch (e: any) {
    warnings.push(`${label}: ${e?.message || 'unavailable'}`)
    return null
  }
}

export const googleFitProvider: HealthProvider = {
  name: 'Google Fit',
  isConfigured: () =>
    Boolean(
      process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_FIT_REFRESH_TOKEN
    ),
  async getSummary(now = Date.now()): Promise<HealthSummary> {
    const offset = Number(process.env.HEALTH_TZ_OFFSET_MINUTES ?? 120) // SAST
    const token = await getAccessToken()
    const dayStart = startOfLocalDay(now, offset)
    const last24 = now - DAY
    const warnings: string[] = []

    const [steps, hr, resting, sleep, oxygen] = await Promise.all([
      settle(getSteps(token, dayStart, now), 'steps', warnings),
      settle(getHeartRate(token, last24, now), 'heart rate', warnings),
      settle(getRestingHeartRate(token, now - 2 * DAY, now), 'resting heart rate', warnings),
      settle(getSleep(token, now), 'sleep', warnings),
      settle(getOxygen(token, last24, now), 'oxygen', warnings)
    ])

    return {
      configured: true,
      provider: 'Google Fit',
      generatedAt: now,
      timezoneOffsetMinutes: offset,
      steps: { today: steps?.today ?? 0, goal: 10000, hourly: steps?.hourly ?? [] },
      heartRate: {
        latest: hr?.latest ?? null,
        average: hr?.average ?? null,
        min: hr?.min ?? null,
        max: hr?.max ?? null,
        resting: resting ?? null,
        hourly: hr?.hourly ?? []
      },
      sleep: sleep ?? null,
      oxygen: { average: oxygen ?? null },
      warnings
    }
  }
}
