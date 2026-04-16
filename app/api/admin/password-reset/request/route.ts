import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

async function sendResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.SENDGRID_API_KEY
  const from = process.env.EMAIL_FROM

  if (!apiKey || !from) {
    throw new Error('Email service not configured. Set SENDGRID_API_KEY and EMAIL_FROM in Vercel env vars.')
  }

  const subject = 'Admin password reset'
  const text =
    `A password reset was requested for your admin dashboard.\n\n` +
    `Reset link (valid for 30 minutes):\n${resetUrl}\n\n` +
    `If you did not request this, you can ignore this email.`

  const html =
    `<p>A password reset was requested for your admin dashboard.</p>` +
    `<p><strong>Reset link (valid for 30 minutes):</strong><br/>` +
    `<a href="${resetUrl}">${resetUrl}</a></p>` +
    `<p>If you did not request this, you can ignore this email.</p>`

  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  })

  if (!resp.ok) {
    const details = await resp.text().catch(() => '')
    throw new Error(`SendGrid error: ${resp.status} ${resp.statusText} ${details}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const emailFromUser = String(body?.email || '').trim()

    const supabase = await getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const to =
      (process.env.ADMIN_RESET_EMAIL || process.env.EMAIL_TO || emailFromUser || '').trim()

    if (!to) {
      return NextResponse.json(
        { error: 'Missing admin email. Set ADMIN_RESET_EMAIL or EMAIL_TO in env vars.' },
        { status: 400 }
      )
    }

    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      'https://www.arfadevelopers.com'

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = sha256(token)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes

    const { error } = await supabase.from('admin_password_resets').insert({
      token_hash: tokenHash,
      expires_at: expiresAt,
      used_at: null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      throw new Error(error.message)
    }

    const resetUrl = `${appUrl.replace(/\/$/, '')}/admin/reset?token=${token}`
    await sendResetEmail(to, resetUrl)

    // Always return generic success
    return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' })
  } catch (error: any) {
    console.error('❌ Password reset request error:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Failed to request reset' }, { status: 500 })
  }
}

