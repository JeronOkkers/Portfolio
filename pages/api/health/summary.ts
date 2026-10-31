// Public, cached summary of the site owner's health stats.
import type { NextApiRequest, NextApiResponse } from 'next'
import { getHealth } from '../../../libs/health'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getHealth()
    // Cache at Vercel's edge for 2 min; after that, one visitor may briefly see the
    // previous copy while it refreshes (max 5 min old). The phone syncs every 15+ min anyway.
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=180')
    if (data.configured) {
      if (data.warnings.length) console.warn('Health warnings:', data.warnings)
      // Don't leak provider error details publicly
      data.warnings = data.warnings.map(w => w.split(':')[0])
    }
    res.status(200).json(data)
  } catch (e: any) {
    console.error('Health summary failed:', e?.message)
    res.setHeader('Cache-Control', 'public, s-maxage=60')
    res.status(200).json({ configured: false, reason: 'Health data is temporarily unavailable.' })
  }
}
