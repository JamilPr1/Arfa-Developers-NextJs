import type { LeadGenV2Lead } from '../scorer'

export async function getHNLeads(query: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  const data: any = await res.json().catch(() => ({}))
  const hits: any[] = data?.hits || []

  return hits
    .filter(Boolean)
    .map((item) => ({
      id: `hn:${item?.objectID || item?.created_at_i || item?.title || ''}`,
      title: String(item?.title || ''),
      text: String(item?.title || ''),
      url: String(item?.url || item?.story_url || `https://news.ycombinator.com/item?id=${item?.objectID}`),
      source: 'HN' as const,
      createdAt: item?.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
    }))
}

