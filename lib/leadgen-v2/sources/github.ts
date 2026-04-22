import type { LeadGenV2Lead } from '../scorer'

export async function getGitHubIssueLeads(query: string): Promise<Omit<LeadGenV2Lead, 'score'>[]> {
  // Unauthenticated requests are rate-limited, but still useful for low-volume cron/manual refresh.
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=25`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { 'User-Agent': 'ArfaLeadGenV2/1.0', Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) return []
  const json: any = await res.json().catch(() => ({}))
  const items: any[] = json?.items || []

  return items.map((it) => ({
    id: `github:${it?.id || it?.html_url || it?.title || ''}`.slice(0, 128),
    title: String(it?.title || ''),
    text: `${it?.title || ''}\n\n${it?.body || ''}`.trim(),
    url: String(it?.html_url || ''),
    source: 'GitHub' as const,
    createdAt: it?.created_at ? new Date(it.created_at).toISOString() : new Date().toISOString(),
  }))
}

