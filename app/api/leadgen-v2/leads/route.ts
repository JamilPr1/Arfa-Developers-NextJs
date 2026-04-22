import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { scoreLead, type LeadGenV2Lead } from '@/lib/leadgen-v2/scorer'
import { getRedditLeads } from '@/lib/leadgen-v2/sources/reddit'
import { getUpworkLeads } from '@/lib/leadgen-v2/sources/upwork'
import { getHNLeads } from '@/lib/leadgen-v2/sources/hn'
import { getIndieLeads } from '@/lib/leadgen-v2/sources/indie'
import { getGitHubIssueLeads } from '@/lib/leadgen-v2/sources/github'
import { getStackOverflowLeads } from '@/lib/leadgen-v2/sources/stackoverflow'

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

  const upworkQueries = ['website fix', 'bug fix', 'urgent developer']

  const [r, u1, u2, u3, h, i, gh, so] = await Promise.allSettled([
    getRedditLeads(query),
    getUpworkLeads(upworkQueries[0]),
    getUpworkLeads(upworkQueries[1]),
    getUpworkLeads(upworkQueries[2]),
    getHNLeads('hire developer'),
    getIndieLeads(),
    getGitHubIssueLeads('bug help web in:title'),
    getStackOverflowLeads('error'),
  ])

  const all = [
    ...(r.status === 'fulfilled' ? r.value : []),
    ...(h.status === 'fulfilled' ? h.value : []),
    ...(i.status === 'fulfilled' ? i.value : []),
    ...(u1.status === 'fulfilled' ? u1.value : []),
    ...(u2.status === 'fulfilled' ? u2.value : []),
    ...(u3.status === 'fulfilled' ? u3.value : []),
    ...(gh.status === 'fulfilled' ? gh.value : []),
    ...(so.status === 'fulfilled' ? so.value : []),
  ]

  // Debug logs (visible in Vercel function logs)
  console.log('[leadgen-v2] fetched counts', {
    reddit: r.status === 'fulfilled' ? r.value.length : 'ERR',
    upwork1: u1.status === 'fulfilled' ? u1.value.length : 'ERR',
    upwork2: u2.status === 'fulfilled' ? u2.value.length : 'ERR',
    upwork3: u3.status === 'fulfilled' ? u3.value.length : 'ERR',
    hn: h.status === 'fulfilled' ? h.value.length : 'ERR',
    indie: i.status === 'fulfilled' ? i.value.length : 'ERR',
    github: gh.status === 'fulfilled' ? gh.value.length : 'ERR',
    stackoverflow: so.status === 'fulfilled' ? so.value.length : 'ERR',
  })

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
      upwork: (u1.status === 'fulfilled' ? u1.value.length : 0) + (u2.status === 'fulfilled' ? u2.value.length : 0) + (u3.status === 'fulfilled' ? u3.value.length : 0),
      hn: h.status === 'fulfilled' ? h.value.length : 0,
      indie: i.status === 'fulfilled' ? i.value.length : 0,
      github: gh.status === 'fulfilled' ? gh.value.length : 0,
      stackoverflow: so.status === 'fulfilled' ? so.value.length : 0,
    },
  })
}

