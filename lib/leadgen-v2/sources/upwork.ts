import type { LeadGenV2Lead } from '../scorer'
import { parseRss } from './rss'

export async function getUpworkLeads(query: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  const url = `https://www.upwork.com/ab/feed/jobs/rss?q=${encodeURIComponent(query)}`
  const feed = await parseRss(url)
  const items = feed?.items || []
  return items.map((item: any) => ({
    id: `upwork:${item?.guid || item?.link || item?.title || ''}`.slice(0, 128),
    title: String(item?.title || ''),
    text: String(item?.contentSnippet || item?.content || item?.title || ''),
    url: String(item?.link || ''),
    source: 'Upwork' as const,
    createdAt: item?.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  }))
}

