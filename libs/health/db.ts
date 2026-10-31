// Server-only Supabase client using the secret (service role) key.
// The health tables have RLS on with no policies, so only this key can touch them.
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const dbConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY)

export function db(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }
  return client
}
