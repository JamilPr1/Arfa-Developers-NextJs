import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabaseClient } from '@/lib/supabase'

// Simple password-based authentication
// In production, use proper authentication (JWT, sessions, etc.)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Prefer Supabase-stored password hash if configured
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        process.env.NEXT_PHASE !== 'phase-production-build' &&
        process.env.NEXT_PHASE !== 'phase-development-build'
      ) {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data, error } = await supabase
            .from('admin_auth')
            .select('password_hash')
            .eq('id', 1)
            .maybeSingle()

          if (!error && data?.password_hash) {
            const ok = await bcrypt.compare(String(password || ''), String(data.password_hash))
            if (ok) {
              return NextResponse.json({ success: true, message: 'Login successful' })
            }
          }
        }
      }
    } catch {
      // Fallback to env password below
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, message: 'Login successful' })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error during login' },
      { status: 500 }
    )
  }
}
