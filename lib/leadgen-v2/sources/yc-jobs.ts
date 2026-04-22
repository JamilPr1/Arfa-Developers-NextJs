import type { LeadGenV2Lead } from '../scorer'

function extract(text: string, re: RegExp) {
  return text.match(re)?.[1]?.trim() || ''
}

export async function getYcJobsLeads(): Promise<Omit<LeadGenV2Lead, 'intent' | 'confidence'>[]> {
  // Free, hiring-intent only. This is the Hacker News "jobs" page (YC startup jobs).
  // We intentionally avoid HN discussions.
  const res = await fetch('https://news.ycombinator.com/jobs', { cache: 'no-store' })
  if (!res.ok) return []
  const html = await res.text()

  // Very lightweight parse: grab job titles + links
  const rows = html.split('class="athing"').slice(1, 60)
  const out: Omit<LeadGenV2Lead, 'intent' | 'confidence'>[] = []
  for (const r of rows) {
    const href = extract(r, /href="([^"]+)"/)
    const title = extract(r, /class="titleline">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)
    if (!href || !title) continue
    const url = href.startsWith('http') ? href : `https://news.ycombinator.com/${href.replace(/^\//, '')}`
    out.push({
      id: `ycjobs:${url}`.slice(0, 128),
      title,
      text: title,
      url,
      source: 'YC Jobs' as const,
      createdAt: new Date().toISOString(),
    })
  }
  return out
}

