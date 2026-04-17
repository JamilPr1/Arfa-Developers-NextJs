import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type StoredLead = {
  id: number
  name: string
  email: string
  company: string
  projectType: string
  message: string
  source?: string
  region?: string
  createdAt: string
  slackSent: boolean
  read: boolean
}

export async function GET() {
  try {
    // Try Supabase first (only if env vars are set and not during build)
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('createdAt', { ascending: false })

          if (error) {
            console.error('❌ Supabase error fetching leads for admin:', error)
            return NextResponse.json(
              {
                error: 'Failed to fetch leads from Supabase. Ensure the `leads` table exists and RLS/policies allow server access.',
                details: error.message,
              },
              { status: 500 }
            )
          }

          if (leads) {
            const response = NextResponse.json(leads)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch {
        // fallback below
      }
    }

    const leads = await readDataFile<StoredLead>('leads.json')
    const response = NextResponse.json(leads)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error) {
    console.error('❌ Error fetching leads for admin:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = (await request.json()) as { id: number; updates: Partial<StoredLead> }
    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })
    }

    // Supabase path (optional)
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
            .from('leads')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (!error && data) {
            return NextResponse.json(data)
          }
        }
      } catch {
        // fallback below
      }
    }

    const leads = await readDataFile<StoredLead>('leads.json')
    const idx = leads.findIndex((l) => l?.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    leads[idx] = { ...leads[idx], ...updates }
    await writeDataFile('leads.json', leads)
    return NextResponse.json(leads[idx])
  } catch (error: any) {
    console.error('❌ Error updating lead:', error)
    return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id: number }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Supabase path (optional)
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { error } = await supabase.from('leads').delete().eq('id', id)
          if (!error) return NextResponse.json({ success: true })
        }
      } catch {
        // fallback below
      }
    }

    const leads = await readDataFile<StoredLead>('leads.json')
    const filtered = leads.filter((l) => l?.id !== id)
    await writeDataFile('leads.json', filtered)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error deleting lead:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 500 })
  }
}

