// Receives Health Connect data from the Life Dashboard Companion app on my phone.
// Every request must carry a valid X-Signature (HMAC-SHA256 of the raw body).
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifySignature, toRows } from '../../../libs/health/ingest'
import { db, dbConfigured } from '../../../libs/health/db'

export const config = { api: { bodyParser: false } } // need the raw body for the signature

async function rawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c)
  return Buffer.concat(chunks)
}

const chunk = <T,>(arr: T[], n: number) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const secret = process.env.HEALTH_WEBHOOK_SECRET
  if (!secret || !dbConfigured()) return res.status(503).json({ error: 'not configured' })

  const raw = await rawBody(req)
  if (!verifySignature(raw, req.headers['x-signature'] as string | undefined, secret)) {
    return res.status(401).json({ error: 'bad signature' })
  }

  let payload: any
  try {
    payload = JSON.parse(raw.toString('utf8'))
  } catch {
    return res.status(400).json({ error: 'invalid json' })
  }
  if (payload.test) return res.status(200).json({ ok: true, test: true })

  const { rows, daily, deleted } = toRows(payload)
  const sb = db()

  try {
    for (const part of chunk(rows, 500)) {
      const { error } = await sb.from('health_records').upsert(part, { onConflict: 'uuid' })
      if (error) throw error
    }
    if (daily.length) {
      const { error } = await sb
        .from('health_daily_totals')
        .upsert(daily.map(d => ({ ...d, updated_at: new Date().toISOString() })), { onConflict: 'date' })
      if (error) throw error
    }
    for (const uuid of deleted) {
      // heart-rate samples are stored as "<record uuid>#<ms>", so delete both forms
      await sb.from('health_records').delete().eq('uuid', uuid)
      await sb.from('health_records').delete().like('uuid', `${uuid.replace(/[%_]/g, '\\$&')}#%`)
    }
  } catch (e: any) {
    console.error('Health ingest failed:', e?.message)
    return res.status(500).json({ error: 'store failed' }) // app retries 5xx
  }

  res.status(200).json({ ok: true, stored: rows.length, daily: daily.length, deleted: deleted.length })
}
