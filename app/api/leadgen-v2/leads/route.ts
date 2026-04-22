import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { hiringConfidence, isHiringPost, isNoisePost, type LeadGenV2Lead } from '@/lib/leadgen-v2/scorer'
import { getRedditLeads } from '@/lib/leadgen-v2/sources/reddit'
import { getIndieLeads } from '@/lib/leadgen-v2/sources/indie'
import { getYcJobsLeads } from '@/lib/leadgen-v2/sources/yc-jobs'

export const runtime = 'nodejs'

const FILENAME = 'leadgen-v2.json'

function dedupe(existing: LeadGenV2Lead[], incoming: LeadGenV2Lead[]) {
  const map = new Map<string, LeadGenV2Lead>()
  for (const e of existing) map.set(e.id, e)
  for (const i of incoming) if (i?.id && !map.has(i.id)) map.set(i.id, i)
  return Array.from(map.values())
}

export async function GET(req: NextRequest) {
  const refresh = req.nextUrl.searchParams.get('refresh') === '1'
  const clear = req.nextUrl.searchParams.get('clear') === '1'
  const query = req.nextUrl.searchParams.get('q') || 'developer help'

  const existing = await readDataFile<LeadGenV2Lead>(FILENAME)
  const stored = Array.isArray(existing) ? existing : []

  if (clear) {
    await writeDataFile(FILENAME, [])
    return NextResponse.json({ leads: [], stored: 0, cleared: true })
  }

  if (!refresh) {
    const sorted = [...stored].sort((a, b) => (b.confidence || 0) - (a.confidence || 0)).slice(0, 50)
    return NextResponse.json({ leads: sorted, stored: stored.length })
  }

  // V3: ONLY HIRING POSTS (hard source lock)
  const [r, i, yc] = await Promise.allSettled([
    getRedditLeads(query),
    getIndieLeads(),
    getYcJobsLeads(),
  ])

  const all = [
    ...(r.status === 'fulfilled' ? r.value : []),
    ...(i.status === 'fulfilled' ? i.value : []),
    ...(yc.status === 'fulfilled' ? yc.value : []),
  ]

  // Pipeline: source ok -> noise kill -> hiring detector -> output
  const filtered: LeadGenV2Lead[] = all
    .filter((l) => l?.title && l?.url && l?.source)
    .filter((l) => !isNoisePost(l.text))
    .filter((l) => isHiringPost(l.text))
    .map((l) => ({
      ...l,
      intent: 'HIRING' as const,
      confidence: hiringConfidence(l.text),
    }))

  // Debug logs (visible in Vercel function logs)
  console.log('[leadgen-v2:v3] fetched counts', {
    reddit: r.status === 'fulfilled' ? r.value.length : 'ERR',
    indie: i.status === 'fulfilled' ? i.value.length : 'ERR',
    yc_jobs: yc.status === 'fulfilled' ? yc.value.length : 'ERR',
    filtered: filtered.length,
  })

  // IMPORTANT: on refresh we replace stored leads with the latest filtered set.
  // This prevents “same old leads” from accumulating forever.
  const sortedStored = [...filtered].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))

  await writeDataFile(FILENAME, sortedStored.slice(0, 500))

  const top = sortedStored.slice(0, 50)
  return NextResponse.json({
    leads: top,
    stored: Math.min(sortedStored.length, 500),
    fetched: {
      reddit: r.status === 'fulfilled' ? r.value.length : 0,
      indie: i.status === 'fulfilled' ? i.value.length : 0,
      yc_jobs: yc.status === 'fulfilled' ? yc.value.length : 0,
    },
    filtered: filtered.length,
  })
}

