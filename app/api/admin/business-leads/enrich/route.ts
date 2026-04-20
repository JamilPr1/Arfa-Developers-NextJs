import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type BusinessLeadRow = {
  id: number
  businessName?: string
  address?: string
  phone?: string
  website?: string
  email?: string
  notes?: string
}

const FILE = 'business-leads.json'

async function enrichFromWebsite(lead: BusinessLeadRow): Promise<Pick<BusinessLeadRow, 'email' | 'phone'>> {
  if (!lead.website) return {}
  if (lead.email && lead.phone) return {}

  const raw = lead.website.trim()
  const base = raw.startsWith('http') ? raw : `https://${raw}`
  const baseNoTrail = base.replace(/\/+$/, '')
  const candidates = [
    baseNoTrail,
    `${baseNoTrail}/contact`,
    `${baseNoTrail}/contact-us`,
    `${baseNoTrail}/about`,
    `${baseNoTrail}/about-us`,
    `${baseNoTrail}/privacy`,
  ]

  const extract = (html: string) => {
    const mailto = html.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)?.[1]
    const email = mailto || html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
    const tel = html.match(/tel:([^"'>\s]+)/i)?.[1]
    const phone = tel ? tel.replace(/[^\d+]/g, '') : html.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[1]?.trim()
    return { email, phone }
  }

  for (const url of candidates) {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'ArfaDevelopersCRM/1.0 (business-leads)' },
      cache: 'no-store',
    }).catch(() => null as any)
    if (!resp || !resp.ok) continue
    const html = await resp.text().catch(() => '')
    if (!html) continue
    const { email, phone } = extract(html)
    if (email || phone) return { email, phone }
  }

  return {}
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as any
    const limit = Math.min(200, Math.max(1, Number(body?.limit || 50)))
    const onlyMissingEmail = body?.onlyMissingEmail !== false

    const useSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'

    if (useSupabase) {
      const supabase = await getSupabaseClient()
      if (!supabase) return NextResponse.json({ error: 'Supabase not available' }, { status: 500 })

      let query = supabase.from('business_leads').select('*').order('created_at', { ascending: false }).limit(limit)
      if (onlyMissingEmail) query = query.is('email', null)

      const { data, error } = await query
      if (error || !Array.isArray(data)) return NextResponse.json({ error: error?.message || 'Failed to load leads' }, { status: 500 })

      let scanned = 0
      let updated = 0
      for (const row of data as any[]) {
        scanned++
        const lead: BusinessLeadRow = {
          id: row.id,
          website: row.website ?? row.url,
          email: row.email,
          phone: row.phone ?? row.phoneNumber,
        }

        if (!lead.website) continue
        if (onlyMissingEmail && lead.email) continue

        const patch = await enrichFromWebsite(lead)
        const updates: any = {}
        if (!lead.email && patch.email) updates.email = patch.email
        if (!lead.phone && patch.phone) updates.phone = patch.phone
        if (Object.keys(updates).length === 0) continue

        const { error: upErr } = await supabase.from('business_leads').update(updates).eq('id', lead.id)
        if (!upErr) updated++
      }

      return NextResponse.json({ success: true, storage: 'supabase', scanned, updated })
    }

    const leads = await readDataFile<any>(FILE)
    const slice = leads.slice(0, limit)
    let scanned = 0
    let updated = 0
    for (const l of slice) {
      scanned++
      if (!l?.website) continue
      if (onlyMissingEmail && l?.email) continue
      const patch = await enrichFromWebsite(l)
      let changed = false
      if (!l.email && patch.email) {
        l.email = patch.email
        changed = true
      }
      if (!l.phone && patch.phone) {
        l.phone = patch.phone
        changed = true
      }
      if (changed) updated++
    }

    await writeDataFile(FILE, leads)
    return NextResponse.json({ success: true, storage: 'file', scanned, updated })
  } catch (e: any) {
    console.error('Business leads enrich error:', e)
    return NextResponse.json({ error: e?.message || 'Enrichment failed' }, { status: 500 })
  }
}

