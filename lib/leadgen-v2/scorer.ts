export type LeadGenV2Source = 'Reddit' | 'Upwork' | 'HN' | 'IndieHackers'

export type LeadGenV2Lead = {
  id: string
  title: string
  text: string
  url: string
  source: LeadGenV2Source
  createdAt: string
  score: number
}

export function scoreLead(text: string) {
  const t = String(text || '').toLowerCase()
  let score = 0

  const highIntent = ['need developer', 'looking for developer', 'hire developer', 'urgent help', 'asap']
  const painSignals = ['developer disappeared', 'developer ghosted', 'project stuck', 'website broken', 'not working', 'bug']
  const moneySignals = ['budget', 'paid', 'cost', 'price', 'hourly']

  for (const k of highIntent) if (t.includes(k)) score += 25
  for (const k of painSignals) if (t.includes(k)) score += 20
  for (const k of moneySignals) if (t.includes(k)) score += 15

  if (t.length > 200) score += 10
  return Math.min(score, 100)
}

