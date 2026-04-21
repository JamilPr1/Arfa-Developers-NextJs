import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export type Proposal = {
  id: number
  leadId?: number
  businessName?: string
  slug: string
  title: string
  html: string
  createdAt: string
  updatedAt: string
}

const FILE = 'proposals.json'

function normalizeRow(row: any): Proposal {
  return {
    id: row?.id,
    leadId: row?.leadId ?? row?.lead_id,
    businessName: row?.businessName ?? row?.business_name,
    slug: row?.slug,
    title: row?.title ?? row?.name ?? 'Proposal',
    html: row?.html ?? row?.content ?? '',
    createdAt: row?.createdAt ?? row?.created_at ?? new Date().toISOString(),
    updatedAt: row?.updatedAt ?? row?.updated_at ?? row?.createdAt ?? row?.created_at ?? new Date().toISOString(),
  }
}

export async function GET() {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data, error } = await supabase.from('proposals').select('*').order('created_at', { ascending: false })
          if (!error && Array.isArray(data) && data.length > 0) return NextResponse.json(data.map(normalizeRow))
        }
      } catch {
        // fall back below
      }
    }
    const items = await readDataFile<Proposal>(FILE)
    return NextResponse.json(items)
  } catch (e) {
    console.error('❌ Error fetching proposals:', e)
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as Partial<Proposal>
    const title = String(body?.title || '').trim()
    const slug = String(body?.slug || '').trim()
    const html = String(body?.html || '')
    const leadId = body?.leadId ? Number(body.leadId) : undefined
    const businessName = body?.businessName ? String(body.businessName) : undefined

    if (!title || !slug || !html) return NextResponse.json({ error: 'Missing title, slug, or html' }, { status: 400 })

    const now = new Date().toISOString()

    // Prefer Supabase when available
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data, error } = await supabase
          .from('proposals')
          .insert({
            leadId,
            businessName,
            slug,
            title,
            html,
            created_at: now,
            updated_at: now,
          })
          .select('*')
          .single()
        if (!error && data) return NextResponse.json(normalizeRow(data))
      }
    }

    const existing = await readDataFile<any>(FILE)
    const maxId = existing.length > 0 ? Math.max(...existing.map((l: any) => l.id || 0)) : 0
    const next: Proposal = {
      id: maxId + 1,
      leadId,
      businessName,
      slug,
      title,
      html,
      createdAt: now,
      updatedAt: now,
    }
    await writeDataFile(FILE, [next, ...existing])
    return NextResponse.json(next)
  } catch (e: any) {
    console.error('❌ Error creating proposal:', e)
    return NextResponse.json({ error: e?.message || 'Failed to create proposal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = (await req.json().catch(() => ({}))) as any
    const proposalId = Number(id || 0)
    if (!proposalId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { error } = await supabase.from('proposals').delete().eq('id', proposalId)
        if (!error) return NextResponse.json({ success: true })
      }
    }

    const existing = await readDataFile<any>(FILE)
    await writeDataFile(FILE, existing.filter((p: any) => Number(p?.id) !== proposalId))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('❌ Error deleting proposal:', e)
    return NextResponse.json({ error: e?.message || 'Failed to delete proposal' }, { status: 500 })
  }
}

