import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireRunnerSecret } from '../_utils'

export const runtime = 'nodejs'

export type GmapsJobStatus = 'queued' | 'running' | 'completed' | 'failed'

export type GmapsJob = {
  id: string
  query: string
  total: number
  createdAt: string
  startedAt?: string
  finishedAt?: string
  status: GmapsJobStatus
  error?: string
  resultCount?: number
}

const JOBS_FILE = 'gmaps-jobs.json'

async function readJobs(): Promise<GmapsJob[]> {
  const data = await readDataFile<GmapsJob>(JOBS_FILE)
  return Array.isArray(data) ? data : []
}

export async function GET(req: NextRequest) {
  const want = req.nextUrl.searchParams.get('status')
  const jobs = await readJobs()
  const filtered = want ? jobs.filter((j) => j.status === want) : jobs
  filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return NextResponse.json({ jobs: filtered })
}

export async function POST(req: NextRequest) {
  try {
    requireRunnerSecret(req) // same secret for admin UI & runner
    const body = (await req.json().catch(() => ({}))) as { query?: string; total?: number }
    const query = String(body?.query || '').trim()
    const total = Math.min(200, Math.max(1, Number(body?.total || 20)))
    if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

    const jobs = await readJobs()
    const id = `job_${Date.now()}_${Math.random().toString(16).slice(2)}`
    const job: GmapsJob = {
      id,
      query,
      total,
      createdAt: new Date().toISOString(),
      status: 'queued',
    }
    jobs.unshift(job)
    await writeDataFile(JOBS_FILE, jobs.slice(0, 5000))
    return NextResponse.json({ ok: true, job })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e?.message || 'Failed' }, { status })
  }
}

