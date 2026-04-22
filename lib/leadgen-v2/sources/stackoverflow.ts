import type { LeadGenV2Lead } from '../scorer'

export async function getStackOverflowLeads(intitle: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  const url =
    `https://api.stackexchange.com/2.3/search?order=desc&sort=activity&intitle=${encodeURIComponent(
      intitle,
    )}&site=stackoverflow&pagesize=25`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  const json: any = await res.json().catch(() => ({}))
  const items: any[] = json?.items || []

  return items.map((it) => ({
    id: `so:${it?.question_id || it?.link || it?.title || ''}`.slice(0, 128),
    title: String(it?.title || ''),
    text: String(it?.title || ''),
    url: String(it?.link || ''),
    source: 'StackOverflow' as const,
    createdAt: it?.creation_date ? new Date(it.creation_date * 1000).toISOString() : new Date().toISOString(),
  }))
}

