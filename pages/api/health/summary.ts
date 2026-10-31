// Public, cached summary of the site owner's health stats.
import type { NextApiRequest, NextApiResponse } from 'next'
import { getHealth } from '../../../libs/health'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getHealth()
    // Cache at Vercel's edge for 10 min; serve stale for up to 30 min while refreshing.
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800')
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
