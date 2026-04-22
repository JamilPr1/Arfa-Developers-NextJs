export type LeadGenV2Source = 'Reddit' | 'IndieHackers' | 'YC Jobs' | 'Wellfound'

export type LeadGenV2Lead = {
  id: string
  title: string
  text: string
  url: string
  source: LeadGenV2Source
  createdAt: string
  intent: 'HIRING'
  confidence: number
}

export function isNoisePost(text: string) {
  const t = String(text || '').toLowerCase()
  const noise = ['error', 'bug', 'stack trace', 'exception', 'github issue', 'help me fix', 'not working', 'debug']
  return noise.some((k) => t.includes(k))
}

export function hiringConfidence(text: string) {
  const t = String(text || '').toLowerCase()

  const hireSignals = [
    'looking for developer',
    'looking to hire',
    'hire developer',
    'freelancer needed',
    'need a developer',
    'seeking developer',
    'budget',
    'quote',
    'proposal',
    'contract work',
    'remote developer',
    'agency',
    'paid',
    'rate',
    'hourly',
  ]

  const matches = hireSignals.filter((k) => t.includes(k)).length

  // Confidence heuristic: signals + budget mentions + “job request” style length
  let confidence = 50 + matches * 10
  if (t.includes('$') || t.includes('usd') || t.includes('budget')) confidence += 10
  if (t.length > 200) confidence += 5

  return Math.min(100, Math.max(0, confidence))
}

export function isHiringPost(text: string) {
  if (isNoisePost(text)) return false
  const t = String(text || '').toLowerCase()
  const strongHireSignals = [
    'looking for developer',
    'looking to hire',
    'hire developer',
    'freelancer needed',
    'need a developer',
    'seeking developer',
    'proposal',
    'quote',
    'contract work',
    'remote developer',
  ]
  const hasHiring = strongHireSignals.some((k) => t.includes(k))
  const hasMoneyOrJob = t.includes('budget') || t.includes('$') || t.includes('paid') || t.includes('rate') || t.includes('hourly')
  return hasHiring || hasMoneyOrJob
}

