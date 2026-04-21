import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireAdminSecret } from '../_utils'
import type { AiLead } from '../leads/route'
import type { AiAutomationConfig } from '../config/route'

export const runtime = 'nodejs'

const LEADS_FILENAME = 'ai-leads.json'
const CONFIG_FILENAME = 'ai-automation-config.json'

type ScanResult = {
  scanned: number
  inserted: number
  total: number
  sources: Record<string, { scanned: number; inserted: number }>
}

function normalizeText(s: string) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywordMatchScore(text: string, keywords: string[]) {
  const hay = normalizeText(text).toLowerCase()
  const matched = new Set<string>()
  for (const kw of keywords) {
    const k = normalizeText(kw).toLowerCase()
    if (!k) continue
    if (hay.includes(k)) matched.add(kw)
  }
  // Simple heuristic: base 40 + 15 per keyword hit, capped at 95.
  const score = Math.min(95, 40 + matched.size * 15)
  return { score, matchedKeywords: Array.from(matched) }
}

async function readConfig(): Promise<AiAutomationConfig> {
  const arr = await readDataFile<AiAutomationConfig>(CONFIG_FILENAME)
  return (
    arr?.[0] || {
      id: 1,
      enabled: true,
      minLeadScore: 70,
      keywords: [],
      sources: { reddit: true, x: true, indieHackers: true },
      calendlyLink: '',
      updatedAt: new Date().toISOString(),
    }
  )
}

async function readLeads(): Promise<AiLead[]> {
  const data = await readDataFile<AiLead>(LEADS_FILENAME)
  return Array.isArray(data) ? data : []
}

function makeId(prefix: string, stable: string) {
  return `${prefix}:${stable}`
}

async function fetchRedditLeads(keywords: string[], limit: number): Promise<AiLead[]> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  const username = process.env.REDDIT_USERNAME
  const password = process.env.REDDIT_PASSWORD

  if (!clientId || !clientSecret || !username || !password) return []
  if (keywords.length === 0) return []

  const authRes = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'ArfaDevelopersLeadBot/1.0',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username,
      password,
    }),
  })

  const authJson: any = await authRes.json().catch(() => ({}))
  const token = authJson?.access_token
  if (!token) return []

  const q = keywords.slice(0, 5).map((k) => `"${k}"`).join(' OR ')
  const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(q)}&sort=new&limit=${Math.min(
    25,
    Math.max(1, limit),
  )}&type=link`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ArfaDevelopersLeadBot/1.0',
    },
    cache: 'no-store',
  })

  const json: any = await res.json().catch(() => ({}))
  const children: any[] = json?.data?.children || []

  const out: AiLead[] = []
  for (const c of children) {
    const d = c?.data
    if (!d?.id) continue
    const title = normalizeText(d?.title || '')
    const text = normalizeText(d?.selftext || '')
    const sourceUrl = `https://www.reddit.com${d?.permalink || ''}`
    out.push({
      id: makeId('reddit', String(d.id)),
      createdAt: new Date((d?.created_utc || 0) * 1000).toISOString(),
      source: 'reddit',
      sourceUrl,
      title,
      text,
      author: d?.author || '',
      score: 0,
      matchedKeywords: [],
      status: 'new',
    })
  }
  return out
}

async function fetchXLeads(keywords: string[], limit: number): Promise<AiLead[]> {
  const bearer = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN
  if (!bearer) return []
  if (keywords.length === 0) return []

  const query = keywords.slice(0, 5).map((k) => `"${k}"`).join(' OR ')
  const max = Math.min(50, Math.max(10, limit))

  const url =
    `https://api.x.com/2/tweets/search/recent?query=${encodeURIComponent(query)}` +
    `&max_results=${max}` +
    `&tweet.fields=created_at,author_id,public_metrics` +
    `&expansions=author_id` +
    `&user.fields=username,name`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` },
    cache: 'no-store',
  })

  const json: any = await res.json().catch(() => ({}))
  const tweets: any[] = json?.data || []
  const users: any[] = json?.includes?.users || []
  const userById = new Map<string, any>()
  for (const u of users) userById.set(String(u?.id), u)

  const out: AiLead[] = []
  for (const t of tweets) {
    if (!t?.id) continue
    const u = userById.get(String(t?.author_id))
    const username = u?.username ? `@${u.username}` : ''
    out.push({
      id: makeId('x', String(t.id)),
      createdAt: t?.created_at || new Date().toISOString(),
      source: 'x',
      sourceUrl: `https://x.com/${u?.username || 'i'}/status/${t.id}`,
      title: username,
      text: normalizeText(t?.text || ''),
      author: username,
      score: 0,
      matchedKeywords: [],
      status: 'new',
    })
  }
  return out
}

async function fetchIndieHackersLeads(limit: number): Promise<AiLead[]> {
  // Indie Hackers RSS (safe, no auth)
  const res = await fetch('https://www.indiehackers.com/feed.xml', { cache: 'no-store' })
  if (!res.ok) return []
  const xml = await res.text()

  // Very small XML parse (no dependencies). Extract first N <item>.
  const items = xml.split('<item>').slice(1, Math.max(1, limit) + 1)
  const out: AiLead[] = []
  for (const raw of items) {
    const title = normalizeText((raw.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || raw.match(/<title>(.*?)<\/title>/)?.[1] || '').trim())
    const link = (raw.match(/<link>(.*?)<\/link>/)?.[1] || '').trim()
    const desc =
      raw.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      raw.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      ''
    const pubDate = (raw.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '').trim()

    if (!link && !title) continue
    out.push({
      id: makeId('indiehackers', Buffer.from(link || title).toString('base64').slice(0, 32)),
      createdAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      source: 'indiehackers',
      sourceUrl: link || 'https://www.indiehackers.com',
      title: title || 'Indie Hackers',
      text: normalizeText(desc.replace(/<[^>]+>/g, ' ')),
      author: '',
      score: 0,
      matchedKeywords: [],
      status: 'new',
    })
  }
  return out
}

function dedupeAndInsert(existing: AiLead[], incoming: AiLead[]) {
  const byId = new Map<string, AiLead>()
  for (const e of existing) byId.set(e.id, e)

  let inserted = 0
  for (const lead of incoming) {
    if (!lead?.id) continue
    if (byId.has(lead.id)) continue
    byId.set(lead.id, lead)
    inserted++
  }

  const all = Array.from(byId.values())
  all.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return { all, inserted }
}

export async function POST(req: NextRequest) {
  try {
    requireAdminSecret(req)
    const cfg = await readConfig()
    if (!cfg.enabled) return NextResponse.json({ ok: true, result: { scanned: 0, inserted: 0, total: 0, sources: {} } })

    const body = (await req.json().catch(() => ({}))) as { limit?: number }
    const limit = Math.min(50, Math.max(5, Number(body?.limit || 25)))

    const keywords = Array.isArray(cfg.keywords) ? cfg.keywords.filter(Boolean) : []
    const existing = await readLeads()

    const result: ScanResult = { scanned: 0, inserted: 0, total: existing.length, sources: {} }

    const incoming: AiLead[] = []

    if (cfg.sources.reddit) {
      const leads = await fetchRedditLeads(keywords, limit)
      result.sources.reddit = { scanned: leads.length, inserted: 0 }
      incoming.push(...leads)
    }
    if (cfg.sources.x) {
      const leads = await fetchXLeads(keywords, limit)
      result.sources.x = { scanned: leads.length, inserted: 0 }
      incoming.push(...leads)
    }
    if (cfg.sources.indieHackers) {
      const leads = await fetchIndieHackersLeads(limit)
      result.sources.indieHackers = { scanned: leads.length, inserted: 0 }
      incoming.push(...leads)
    }

    // Score + filter
    const scored: AiLead[] = incoming.map((l) => {
      const combined = `${l.title}\n\n${l.text}`
      const { score, matchedKeywords } = keywordMatchScore(combined, keywords)
      return { ...l, score, matchedKeywords }
    })

    const kept = scored.filter((l) => l.score >= (cfg.minLeadScore || 0))

    const { all, inserted } = dedupeAndInsert(existing, kept)
    result.scanned = incoming.length
    result.inserted = inserted
    result.total = all.length

    // Backfill per-source inserted counts (approx by presence in "kept")
    for (const key of Object.keys(result.sources)) {
      const src = key as any
      const before = new Set(existing.filter((l) => l.source === src).map((l) => l.id))
      const after = all.filter((l) => l.source === src).map((l) => l.id)
      result.sources[key].inserted = after.filter((id) => !before.has(id)).length
    }

    await writeDataFile(LEADS_FILENAME, all)
    return NextResponse.json({ ok: true, result })
  } catch (e: any) {
    const msg = e?.message || 'Scan failed'
    const status = msg === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

