// Owner-only: exchanges the code and shows the refresh token ONCE so it can be
// pasted into Vercel as GOOGLE_FIT_REFRESH_TOKEN. Nothing is stored here.
import type { NextApiRequest, NextApiResponse } from 'next'
import { safeEqual } from '../../../libs/health/safe-equal'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Referrer-Policy', 'no-referrer')

  const { code, state } = req.query
  const cookieState = req.cookies['health_oauth_state'] || ''
  if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    !cookieState ||
    !safeEqual(state, cookieState)
  ) {
    return res.status(400).end('Invalid or expired request. Start again from /api/health/connect.')
  }
  res.setHeader(
    'Set-Cookie',
    'health_oauth_state=; Path=/api/health; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
  )

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
      grant_type: 'authorization_code'
    })
  })
  const json = await r.json()
  if (!r.ok || !json.refresh_token) {
    console.error('Google token exchange failed', r.status, json?.error)
    return res
      .status(502)
      .end('Google did not return a refresh token. Remove the app at myaccount.google.com/permissions and try again.')
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(`<!doctype html><meta name="robots" content="noindex">
<body style="font-family:system-ui;max-width:640px;margin:40px auto;padding:0 16px">
<h2>Google Fit connected</h2>
<p>Copy this value into Vercel → <b>Settings → Environment Variables</b> as
<code>GOOGLE_FIT_REFRESH_TOKEN</code>, then redeploy. It is not stored anywhere else.</p>
<textarea readonly rows="4" style="width:100%">${escape(json.refresh_token)}</textarea>
</body>`)
}
