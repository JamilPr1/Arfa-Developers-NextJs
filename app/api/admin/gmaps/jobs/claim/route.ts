import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireRunnerSecret } from '../../_utils'
import type { GmapsJob } from '../route'

export const runtime = 'nodejs'

const JOBS_FILE = 'gmaps-jobs.json'

async function readJobs(): Promise<GmapsJob[]> {
  const data = await readDataFile<GmapsJob>(JOBS_FILE)
  return Array.isArray(data) ? data : []
}

export async function POST(req: NextRequest) {
  try {
    requireRunnerSecret(req)
    const jobs = await readJobs()
    const idx = jobs.findIndex((j) => j.status === 'queued')
    if (idx === -1) return NextResponse.json({ job: null })

    const job = jobs[idx]
    const updated: GmapsJob = { ...job, status: 'running', startedAt: new Date().toISOString() }
    jobs[idx] = updated
    await writeDataFile(JOBS_FILE, jobs)
    return NextResponse.json({ job: updated })
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: e?.message || 'Failed' }, { status })
  }
}

