import type { LeadGenV2Lead } from '../scorer'

function base64Id(s: string) {
  return Buffer.from(s).toString('base64').slice(0, 32)
}

const UA = 'Mozilla/5.0 (LeadGenBot/1.0)'

function mapChildrenToLeads(children: any[]): Omit<LeadGenV2Lead, 'score'>[] {
  return (children || [])
    .map((p) => p?.data)
    .filter(Boolean)
    .map((d) => ({
      id: `reddit:${d?.id || base64Id(d?.permalink || d?.title || '')}`,
      title: String(d?.title || ''),
      text: `${d?.title || ''} ${d?.selftext || ''}`.trim(),
      url: `https://reddit.com${d?.permalink || ''}`,
      source: 'Reddit' as const,
      createdAt: new Date((d?.created_utc || 0) * 1000).toISOString(),
    }))
}

export async function getRedditLeads(query: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  // Best quality: target specific subreddits instead of generic search.
  const subredditFeeds = [
    'https://www.reddit.com/r/forhire/new.json?limit=25',
    'https://www.reddit.com/r/freelance/new.json?limit=25',
    'https://www.reddit.com/r/webdev/new.json?limit=25',
    'https://www.reddit.com/r/startups/new.json?limit=25',
  ]

  const results = await Promise.allSettled(
    subredditFeeds.map((url) =>
      fetch(url, { cache: 'no-store', headers: { 'User-Agent': UA } })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => mapChildrenToLeads(j?.data?.children || [])),
    ),
  )

  const fromSubs = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r: any) => r.value || [])

  // Fallback: reddit search.json (still useful for broad net)
  const searchRes = await fetch(
    `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=new&limit=25&type=link`,
    {
      cache: 'no-store',
      headers: { 'User-Agent': UA },
    },
  )
  const searchJson: any = await searchRes.json().catch(() => ({}))
  const fromSearch = mapChildrenToLeads(searchJson?.data?.children || [])

  const map = new Map<string, Omit<LeadGenV2Lead, 'score'>>()
  for (const l of [...fromSubs, ...fromSearch]) map.set(l.id, l)
  return Array.from(map.values())
}

