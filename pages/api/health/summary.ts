// Public, cached summary of the site owner's health stats.
import type { NextApiRequest, NextApiResponse } from 'next'
import { getHealth } from '../../../libs/health'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fresh = req.query.fresh === '1' // the page's refresh button skips the shared cache
  try {
    const data = await getHealth()
    // Browsers never keep their own copy (so reloads and the refresh button always ask
    // again). Vercel's edge shares one copy for 60s, refreshed in the background for
    // up to another 60s. The refresh button (?fresh=1) skips that shared copy.
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader(
      'Vercel-CDN-Cache-Control',
      fresh ? 'no-store' : 'max-age=60, stale-while-revalidate=60'
    )
    if (data.configured) {
      if (data.warnings.length) console.warn('Health warnings:', data.warnings)
      // Don't leak provider error details publicly
      data.warnings = data.warnings.map(w => w.split(':')[0])
    }
    res.status(200).json(data)
  } catch (e: any) {
    console.error('Health summary failed:', e?.message)
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=30')
    res.status(200).json({ configured: false, reason: 'Health data is temporarily unavailable.' })
  }
}
