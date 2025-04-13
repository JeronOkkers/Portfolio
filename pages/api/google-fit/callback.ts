// pages/api/google-fit/callback.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

const GOOGLE_CLIENT_ID = '74328715068-dpslrfgocpu9l8iki7nt7eqbtpg5j4qe.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_REDIRECT_URI = 'https://jeronokkers.vercel.app/api/google-fit/callback'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'No code provided.' })
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    // For demo purposes, we pass the access_token in the URL.
    // In production, store tokens securely (e.g., in a session or database).
    res.redirect(`/health?access_token=${tokens.access_token}`)
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    res.status(500).json({ error: 'Failed to retrieve tokens' })
  }
}
