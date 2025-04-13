// pages/api/google-fit/auth.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

// Directly define your credentials here (for testing only)
const GOOGLE_CLIENT_ID = '74328715068-dpslrfgocpu9l8iki7nt7eqbtpg5j4qe.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_REDIRECT_URI = 'https://jeronokkers.vercel.app/api/google-fit/callback'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )

  const scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.oxygen_saturation.read'
  ]

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })

  res.redirect(authorizationUrl)
}