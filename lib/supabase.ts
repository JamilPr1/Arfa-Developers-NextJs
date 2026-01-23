// Lazy import Supabase to avoid build-time issues
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null
let supabaseLib: any = null

async function loadSupabaseLib() {
  if (supabaseLib) return supabaseLib
  
  // Only load Supabase module at runtime, not during build
  if (typeof window === 'undefined' && process.env.NEXT_PHASE) {
    // During build phase, don't load Supabase
    return null
  }
  
  try {
    supabaseLib = await import('@supabase/supabase-js')
    return supabaseLib
  } catch (error) {
    console.warn('⚠️ Failed to load Supabase module:', error)
    return null
  }
}

async function initializeSupabase() {
  // Skip during build time
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.NEXT_PHASE === 'phase-development-build') {
    return null
  }
  
  const supabaseModule = await loadSupabaseLib()
  if (!supabaseModule) return null
  
  const { createClient } = supabaseModule
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  try {
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
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error)
    return null
  }
}

// Helper to get the appropriate client (async for lazy loading)
export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  // Skip during build time
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.NEXT_PHASE === 'phase-development-build') {
    return null
  }
  
  // Initialize if not already done
  if (!supabaseClient) {
    const initialized = await initializeSupabase()
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

// Synchronous version for compatibility (returns null if not initialized)
export function getSupabaseClientSync(): SupabaseClient | null {
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.NEXT_PHASE === 'phase-development-build') {
    return null
  }
  return supabaseClient
}
