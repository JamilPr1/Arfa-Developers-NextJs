import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null

function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Client for client-side operations (uses anon key)
  const client = createClient(supabaseUrl, supabaseAnonKey)

  // Admin client for server-side operations (uses service role key)
  const adminClient = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

  return { client, adminClient }
}

// Helper to get the appropriate client
export function getSupabaseClient(): SupabaseClient | null {
  // Initialize if not already done
  if (!supabaseClient) {
    const initialized = initializeSupabase()
    if (initialized) {
      supabaseClient = initialized.client
      supabaseAdminClient = initialized.adminClient
    } else {
      return null
    }
  }

  // Use admin client for server-side operations
  if (typeof window === 'undefined' && supabaseAdminClient) {
    return supabaseAdminClient
  }
  return supabaseClient
}

// Export client for direct use (will be null if not configured)
// Only initialize on client-side to avoid build-time issues
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null
