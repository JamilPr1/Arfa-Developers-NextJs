import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export type BusinessLead = {
  id: number
  businessName: string
  address?: string
  phone?: string
  website?: string
  email?: string
  city?: string
  state?: string
  countryCode?: string
  source?: string
  createdAt?: string
  notes?: string
  contacted?: boolean
}

const FILE = 'business-leads.json'

function normalizeRow(row: any): BusinessLead {
  return {
    id: row?.id,
    businessName: row?.businessName ?? row?.name ?? row?.title ?? '',
    address: row?.address,
    phone: row?.phone ?? row?.phoneNumber,
    website: row?.website ?? row?.url,
    email: row?.email,
    city: row?.city,
    state: row?.state ?? row?.state_county,
    countryCode: row?.countryCode ?? row?.country_code,
    source: row?.source ?? 'google-maps',
    createdAt: row?.createdAt ?? row?.created_at,
    notes: row?.notes,
    contacted: row?.contacted ?? false,
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
          const { data, error } = await supabase
            .from('business_leads')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && Array.isArray(data)) {
            const response = NextResponse.json(data.map(normalizeRow))
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch {
        // fall back below
      }
    }

    const leads = await readDataFile<BusinessLead>(FILE)
    const response = NextResponse.json(leads)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error) {
    console.error('❌ Error fetching business leads:', error)
    return NextResponse.json({ error: 'Failed to fetch business leads' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = (await request.json()) as { id: number; updates: Partial<BusinessLead> }
    if (!id || !updates) return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data, error } = await supabase
            .from('business_leads')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
          if (!error && data) return NextResponse.json(normalizeRow(data))
        }
      } catch {
        // fall back below
      }
    }

    const leads = await readDataFile<BusinessLead>(FILE)
    const idx = leads.findIndex((l: any) => l?.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    leads[idx] = { ...leads[idx], ...updates }
    await writeDataFile(FILE, leads)
    return NextResponse.json(leads[idx])
  } catch (error: any) {
    console.error('❌ Error updating business lead:', error)
    return NextResponse.json({ error: error.message || 'Failed to update business lead' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id: number }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { error } = await supabase.from('business_leads').delete().eq('id', id)
          if (!error) return NextResponse.json({ success: true })
        }
      } catch {
        // fall back below
      }
    }

    const leads = await readDataFile<BusinessLead>(FILE)
    const filtered = leads.filter((l: any) => l?.id !== id)
    await writeDataFile(FILE, filtered)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error deleting business lead:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete business lead' }, { status: 500 })
  }
}

