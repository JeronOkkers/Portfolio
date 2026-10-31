// Provider-neutral shape the Health page renders.
// Current provider: Health Connect (Samsung Health / Galaxy Watch) pushed to
// /api/health/ingest by the Life Dashboard Companion app and stored in Supabase.

export interface SeriesPoint {
  t: number // epoch ms (start of bucket)
  v: number
}

export type SleepStage = 'awake' | 'light' | 'deep' | 'rem' | 'asleep' | 'out-of-bed'

export interface SleepSummary {
  start: number // epoch ms
  end: number // epoch ms
  asleepMs: number // total time actually asleep (excludes awake / out of bed)
  inBedMs: number
  stages: Partial<Record<SleepStage, number>> // ms per stage
  source: 'segments' | 'session' // segments = staged data, session = only start/end known
}

export interface HealthSummary {
  configured: true
  provider: string
  generatedAt: number
  timezoneOffsetMinutes: number
  steps: { today: number; goal: number; hourly: SeriesPoint[] }
  heartRate: {
    latest: number | null
    average: number | null
    min: number | null
    max: number | null
    resting: number | null
    hourly: SeriesPoint[]
  }
  sleep: SleepSummary | null
  oxygen: { average: number | null }
  warnings: string[]
}

export interface HealthNotConfigured {
  configured: false
  reason: string
}

export type HealthResponse = HealthSummary | HealthNotConfigured

export interface HealthProvider {
  name: string
  isConfigured(): boolean
  getSummary(now?: number): Promise<HealthSummary>
}
