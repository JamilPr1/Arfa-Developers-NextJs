import type { LeadGenV2Lead } from '../scorer'

function base64Id(s: string) {
  return Buffer.from(s).toString('base64').slice(0, 32)
}

export async function getRedditLeads(query: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=new&limit=25&type=link`, {
    cache: 'no-store',
    headers: { 'User-Agent': 'ArfaLeadGenV2/1.0' },
  })
  if (!res.ok) return []
  const json: any = await res.json().catch(() => ({}))
  const children: any[] = json?.data?.children || []

  return children
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

