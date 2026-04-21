import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Vercel cron will call this endpoint. We simply refresh the combined feed.
  const url = new URL(req.url)
  url.pathname = '/api/leadgen-v2/leads'
  url.searchParams.set('refresh', '1')
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const json = await res.json().catch(() => ({}))
  return NextResponse.json({ ok: res.ok, ...json }, { status: res.ok ? 200 : 500 })
}

