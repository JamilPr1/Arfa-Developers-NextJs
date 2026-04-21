import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { scoreLead, type LeadGenV2Lead } from '@/lib/leadgen-v2/scorer'
import { getRedditLeads } from '@/lib/leadgen-v2/sources/reddit'
import { getUpworkLeads } from '@/lib/leadgen-v2/sources/upwork'
import { getHNLeads } from '@/lib/leadgen-v2/sources/hn'
import { getIndieLeads } from '@/lib/leadgen-v2/sources/indie'

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
  const query = req.nextUrl.searchParams.get('q') || 'developer help'

  const existing = await readDataFile<LeadGenV2Lead>(FILENAME)
  const stored = Array.isArray(existing) ? existing : []

  if (!refresh) {
    const sorted = [...stored].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 50)
    return NextResponse.json({ leads: sorted, stored: stored.length })
  }

  const [r, u, h, i] = await Promise.allSettled([
    getRedditLeads(query),
    getUpworkLeads('web developer'),
    getHNLeads('developer help'),
    getIndieLeads(),
  ])

  const all = [
    ...(r.status === 'fulfilled' ? r.value : []),
    ...(u.status === 'fulfilled' ? u.value : []),
    ...(h.status === 'fulfilled' ? h.value : []),
    ...(i.status === 'fulfilled' ? i.value : []),
  ]

  const scored: LeadGenV2Lead[] = all.map((l) => ({
    ...l,
    score: scoreLead(l.text),
  }))

  const combined = dedupe(stored, scored)
  const sortedStored = combined.sort((a, b) => (b.score || 0) - (a.score || 0))

  await writeDataFile(FILENAME, sortedStored.slice(0, 500))

  const top = sortedStored.slice(0, 50)
  return NextResponse.json({
    leads: top,
    stored: Math.min(sortedStored.length, 500),
    fetched: {
      reddit: r.status === 'fulfilled' ? r.value.length : 0,
      upwork: u.status === 'fulfilled' ? u.value.length : 0,
      hn: h.status === 'fulfilled' ? h.value.length : 0,
      indie: i.status === 'fulfilled' ? i.value.length : 0,
    },
  })
}

