// Picks the health data provider.
//
// Default: "health-connect" — Galaxy Watch → Samsung Health → Health Connect →
// Life Dashboard Companion app → /api/health/ingest → Supabase.
// Set HEALTH_PROVIDER=none in Vercel to hide live data.
// To add another source later, write a HealthProvider that returns the same
// HealthSummary shape (./types.ts) and register it below.

import type { HealthProvider, HealthResponse } from './types'
import { healthConnectProvider } from './health-connect'

const providers: Record<string, HealthProvider> = {
  'health-connect': healthConnectProvider
}

export async function getHealth(): Promise<HealthResponse> {
  const key = process.env.HEALTH_PROVIDER || 'health-connect'
  if (key === 'none') {
    return { configured: false, reason: 'Live health data is switched off for now.' }
  }
  const provider = providers[key]
  if (!provider) {
    return { configured: false, reason: `Unknown health provider "${key}".` }
  }
  if (!provider.isConfigured()) {
    return { configured: false, reason: `${provider.name} isn't connected yet.` }
  }
  return provider.getSummary()
}
