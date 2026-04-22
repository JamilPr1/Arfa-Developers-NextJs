import type { LeadGenV2Lead } from '../scorer'
import { parseRss } from './rss'

export async function getIndieLeads(): Promise<Omit<LeadGenV2Lead, 'intent' | 'confidence'>[]> {
  const feed = await parseRss('https://www.indiehackers.com/posts.rss')
  const items = feed?.items || []
  return items.map((item: any) => ({
    id: `indie:${item?.id || item?.guid || item?.link || item?.title || ''}`.slice(0, 128),
    title: String(item?.title || ''),
    text: String(item?.contentSnippet || item?.content || item?.title || ''),
    url: String(item?.link || ''),
    source: 'IndieHackers' as const,
    createdAt: item?.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  }))
}

