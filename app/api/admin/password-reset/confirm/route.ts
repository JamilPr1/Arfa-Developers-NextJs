import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = (await request.json()) as {
      token?: string
      newPassword?: string
    }

    const t = String(token || '').trim()
    const pw = String(newPassword || '')

    if (!t || pw.length < 8) {
      return NextResponse.json(
        { error: 'Invalid request. Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const tokenHash = sha256(t)
    const nowIso = new Date().toISOString()

    const { data: resetRow, error: resetErr } = await supabase
      .from('admin_password_resets')
      .select('*')
      .eq('token_hash', tokenHash)
      .maybeSingle()

    if (resetErr) throw new Error(resetErr.message)
    if (!resetRow) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    if (resetRow.used_at) return NextResponse.json({ error: 'Token already used' }, { status: 400 })
    if (resetRow.expires_at && String(resetRow.expires_at) < nowIso) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(pw, 10)

    // Upsert admin password hash at id=1
    const { error: authErr } = await supabase.from('admin_auth').upsert({
      id: 1,
      password_hash: passwordHash,
      updated_at: nowIso,
    })
    if (authErr) throw new Error(authErr.message)

    // Mark token as used
    const { error: usedErr } = await supabase
      .from('admin_password_resets')
      .update({ used_at: nowIso })
      .eq('token_hash', tokenHash)
    if (usedErr) throw new Error(usedErr.message)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Password reset confirm error:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Failed to reset password' }, { status: 500 })
  }
}

