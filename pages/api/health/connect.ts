// Owner-only: starts the Google OAuth flow to get a refresh token.
// Visit /api/health/connect?key=<HEALTH_ADMIN_KEY>
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { safeEqual } from '../../../libs/health/safe-equal'

const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read'
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminKey = process.env.HEALTH_ADMIN_KEY
  const key = typeof req.query.key === 'string' ? req.query.key : ''
  if (!adminKey || !key || !safeEqual(key, adminKey)) {
    return res.status(404).end('Not found')
  }
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return res.status(500).end('GOOGLE_CLIENT_ID / GOOGLE_REDIRECT_URI not set')
  }

  const state = crypto.randomBytes(24).toString('hex')
  res.setHeader(
    'Set-Cookie',
    `health_oauth_state=${state}; Path=/api/health; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  )

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent', // always return a refresh token
    state
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
