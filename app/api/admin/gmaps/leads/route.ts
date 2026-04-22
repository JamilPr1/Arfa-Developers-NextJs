import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'

export const runtime = 'nodejs'

type GmapsLead = {
  jobId: string
  createdAt: string
  name?: string
  address?: string
  website?: string
  phone_number?: string
  reviews_count?: number | null
  reviews_average?: number | null
  place_type?: string
  opens_at?: string
  introduction?: string
  source: 'Google Maps (PC Runner)'
  query: string
}

const LEADS_FILE = 'gmaps-leads.json'

export async function GET(req: NextRequest) {
  const limit = Math.min(500, Math.max(1, Number(req.nextUrl.searchParams.get('limit') || 100)))
  const q = (req.nextUrl.searchParams.get('q') || '').toLowerCase().trim()
  const queryFilter = (req.nextUrl.searchParams.get('query') || '').toLowerCase().trim()

  const data = await readDataFile<GmapsLead>(LEADS_FILE)
  const leads = Array.isArray(data) ? data : []

  let filtered = leads
  if (queryFilter) {
    filtered = filtered.filter((l) => (l.query || '').toLowerCase().includes(queryFilter))
  }
  if (q) {
    filtered = filtered.filter((l) => {
      const hay = `${l.name || ''} ${l.address || ''} ${l.website || ''} ${l.phone_number || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }

  filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return NextResponse.json({ leads: filtered.slice(0, limit), total: filtered.length })
}

