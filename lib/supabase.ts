// Lazy import Supabase to avoid build-time issues
// Using 'any' type to avoid importing types that trigger Vercel provisioning
type SupabaseClient = any

let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null
let supabaseLib: any = null

function isBuildTime(): boolean {
  // Check multiple build indicators
  return !!(
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build' ||
    process.env.NEXT_PHASE === 'phase-production-export' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    (typeof window === 'undefined' && 
     !process.env.VERCEL && 
     process.env.NODE_ENV === 'production' &&
     !process.env.VERCEL_ENV)
  )
}

async function loadSupabaseLib() {
  if (supabaseLib) return supabaseLib
  
  // Only load Supabase module at runtime, not during build
  // Be extra defensive - check if we're in any build context
  if (isBuildTime() || 
      process.env.CI === 'true' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // During build phase or if not configured, don't load Supabase
    return null
  }
  
  try {
    // Use dynamic import with error handling
    const supabaseModule = await import('@supabase/supabase-js').catch(() => null)
    if (supabaseModule) {
      supabaseLib = supabaseModule
      return supabaseLib
    }
    return null
  } catch (error) {
    // Silently fail - never throw during build
    return null
  }
}

async function initializeSupabase() {
  // Skip during build time
  if (isBuildTime()) {
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
    // Only log if not during build
    if (!isBuildTime()) {
      console.warn('⚠️ Failed to initialize Supabase client:', error)
    }
    return null
  }
}

// Helper to get the appropriate client (async for lazy loading)
export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  // Skip during build time
  if (isBuildTime()) {
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
  if (isBuildTime()) {
    return null
  }
  return supabaseClient
}
