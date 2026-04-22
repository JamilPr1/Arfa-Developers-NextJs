import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireRunnerSecret } from '../../_utils'
import type { GmapsJob } from '../route'

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

const JOBS_FILE = 'gmaps-jobs.json'
const LEADS_FILE = 'gmaps-leads.json'

async function readJobs(): Promise<GmapsJob[]> {
  const data = await readDataFile<GmapsJob>(JOBS_FILE)
  return Array.isArray(data) ? data : []
}

export async function POST(req: NextRequest) {
  try {
    requireRunnerSecret(req)
    const body = (await req.json().catch(() => ({}))) as {
      jobId?: string
      status?: 'completed' | 'failed'
      error?: string
      leads?: any[]
    }

    const jobId = String(body?.jobId || '')
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

    const jobs = await readJobs()
    const idx = jobs.findIndex((j) => j.id === jobId)
    if (idx === -1) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const job = jobs[idx]
    const status = body?.status === 'failed' ? 'failed' : 'completed'

    const leadsRaw = Array.isArray(body?.leads) ? body!.leads : []
    const createdAt = new Date().toISOString()
    const leads: GmapsLead[] = leadsRaw.slice(0, 2000).map((l: any) => ({
      jobId,
      createdAt,
      name: String(l?.name || l?.Name || ''),
      address: String(l?.address || l?.Address || ''),
      website: String(l?.website || l?.Website || ''),
      phone_number: String(l?.phone_number || l?.phone || l?.Phone || ''),
      reviews_count: l?.reviews_count ?? null,
      reviews_average: l?.reviews_average ?? null,
      place_type: String(l?.place_type || ''),
      opens_at: String(l?.opens_at || ''),
      introduction: String(l?.introduction || ''),
      source: 'Google Maps (PC Runner)',
      query: job.query,
    }))

    // Save leads (append)
    const existingLeads = await readDataFile<GmapsLead>(LEADS_FILE)
    const allLeads = (Array.isArray(existingLeads) ? existingLeads : []).concat(leads)
    await writeDataFile(LEADS_FILE, allLeads.slice(-20000))

    jobs[idx] = {
      ...job,
      status,
      finishedAt: new Date().toISOString(),
      error: status === 'failed' ? String(body?.error || 'Runner failed') : undefined,
      resultCount: leads.length,
    }
    await writeDataFile(JOBS_FILE, jobs)

    return NextResponse.json({ ok: true, job: jobs[idx], saved: leads.length })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e?.message || 'Failed' }, { status })
  }
}

