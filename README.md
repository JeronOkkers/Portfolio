# jeronokkers.vercel.app

Personal site of Jeron Okkers — developer & CS student in Cape Town.

Next.js (pages router) · Chakra UI · Three.js · Chart.js · deployed on Vercel.

## Editing content
- **Projects** → `data/projects.js` (Works grid and `/works/[slug]` pages are generated from it)
- **About / bio / skills** → `pages/index.js`

## Local dev
```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

## Health page
The Health page shows the site owner's own stats; visitors never sign in.
The server holds a Google refresh token and caches results for 10 minutes.

One-time setup:
1. Google Cloud Console → OAuth client: add `https://jeronokkers.vercel.app/api/health/callback` as an authorised redirect URI.
2. In Vercel set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `HEALTH_ADMIN_KEY` (long random string).
3. Visit `/api/health/connect?key=<HEALTH_ADMIN_KEY>`, approve, copy the refresh token shown into `GOOGLE_FIT_REFRESH_TOKEN`, redeploy.

Google is retiring the Google Fit API by the end of 2026. The provider is pluggable —
see `libs/health/index.ts` for the migration plan to the Google Health API. Set
`HEALTH_PROVIDER=none` to hide live data in the meantime.
