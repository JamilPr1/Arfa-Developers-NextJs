import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { insertDataToSupabase } from '@/lib/supabaseDataUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type ImportItem = {
  businessName?: string
  name?: string
  title?: string
  address?: string
  phone?: string
  phoneNumber?: string
  website?: string
  url?: string
  email?: string
  city?: string
  state?: string
  state_county?: string
  countryCode?: string
  country_code?: string
  source?: string
  createdAt?: string
  created_at?: string
  notes?: string
}

type StoredBusinessLead = {
  id?: number
  businessName: string
  address?: string
  phone?: string
  website?: string
  email?: string
  city?: string
  state?: string
  countryCode?: string
  source: string
  createdAt: string
  notes?: string
  contacted: boolean
}

const FILE = 'business-leads.json'

function normalize(item: ImportItem, fallbackSource: string): StoredBusinessLead {
  const createdAt = item.createdAt || item.created_at || new Date().toISOString()
  return {
    businessName: (item.businessName || item.name || item.title || '').trim(),
    address: item.address?.trim(),
    phone: (item.phone || item.phoneNumber || '').trim() || undefined,
    website: (item.website || item.url || '').trim() || undefined,
    email: item.email?.trim(),
    city: item.city?.trim(),
    state: (item.state || item.state_county || '')?.trim() || undefined,
    countryCode: (item.countryCode || item.country_code || '')?.trim()?.toLowerCase() || undefined,
    source: (item.source || fallbackSource || 'google-maps').trim(),
    createdAt,
    notes: item.notes,
    contacted: false,
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const items = Array.isArray(body?.items) ? (body.items as ImportItem[]) : []
    const source = typeof body?.source === 'string' ? body.source : 'google-maps'

    if (items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items provided' }, { status: 400 })
    }

    const normalized = items
      .map((it) => normalize(it, source))
      .filter((it) => it.businessName && it.businessName.length >= 2)

    if (normalized.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid items to import' }, { status: 400 })
    }

    // Persist: try Supabase table first if configured, else fallback store via dataUtils
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        let inserted = 0
        for (const lead of normalized) {
          const { id: _id, ...rest } = lead as any
          const row = {
            ...rest,
            created_at: lead.createdAt,
            country_code: lead.countryCode,
          }
          await insertDataToSupabase('business_leads', row)
          inserted++
        }
        return NextResponse.json({ success: true, inserted })
      } catch (e: any) {
        console.error('[Business Leads Import] Supabase insert failed, falling back:', e?.message || e)
      }
    }

    const existing = await readDataFile<any>(FILE)
    const maxId = existing.length > 0 ? Math.max(...existing.map((l: any) => l.id || 0)) : 0

    const dedupeKey = (l: any) =>
      `${(l.businessName || '').toLowerCase()}|${(l.phone || '').toLowerCase()}|${(l.website || '').toLowerCase()}|${(l.address || '').toLowerCase()}`

    const existingKeys = new Set(existing.map(dedupeKey))
    const toAdd: any[] = []
    let nextId = maxId + 1
    for (const lead of normalized) {
      const candidate = { ...lead, id: nextId }
      const key = dedupeKey(candidate)
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      toAdd.push(candidate)
      nextId++
    }

    const merged = [...toAdd, ...existing]
    await writeDataFile(FILE, merged)

    return NextResponse.json({ success: true, inserted: toAdd.length, deduped: normalized.length - toAdd.length })
  } catch (error: any) {
    console.error('❌ Error importing business leads:', error)
    return NextResponse.json({ error: error.message || 'Failed to import business leads' }, { status: 500 })
  }
}

