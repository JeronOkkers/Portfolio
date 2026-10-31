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
Shows my own Galaxy Watch stats; visitors never sign in.

Galaxy Watch → Samsung Health → Health Connect → **Life Dashboard Companion** (Android) →
`POST /api/health/ingest` (HMAC-signed) → Supabase (`health_records`, `health_daily_totals`) →
`/api/health/summary` (cached 10 min) → `/health`.

Setup:
1. Samsung Health → Settings → Health Connect: allow Samsung Health to write steps, heart rate, sleep, SpO₂, exercise.
2. Install Life Dashboard Companion (F-Droid / Play Store), grant it Health Connect read access.
3. In the app: Health → Webhook → add `https://jeronokkers.vercel.app/api/health/ingest`,
   tap **Generate** under HMAC signing secret, copy it.
4. In Vercel set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `HEALTH_WEBHOOK_SECRET` (the copied secret), redeploy.
5. In the app: **Test ping**, then **Save Changes**, then sync.
