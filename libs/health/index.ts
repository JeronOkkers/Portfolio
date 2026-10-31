// Picks the health data provider.
//
// MIGRATION PLAN (Google Fit → Google Health API):
// Google is retiring the Google Fit APIs by the end of 2026. When that happens:
//   1. Add libs/health/google-health.ts exporting a HealthProvider that returns
//      the same HealthSummary shape (see ./types.ts).
//   2. Register it below and set HEALTH_PROVIDER=google-health in Vercel.
//   3. Nothing in pages/health.tsx needs to change.
// Until then, HEALTH_PROVIDER=none hides the live data cleanly.

import type { HealthProvider, HealthResponse } from './types'
import { googleFitProvider } from './google-fit'

const providers: Record<string, HealthProvider> = {
  'google-fit': googleFitProvider
}

export async function getHealth(): Promise<HealthResponse> {
  const key = process.env.HEALTH_PROVIDER || 'google-fit'
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
