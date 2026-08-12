import type { ArfaResponse } from './types'

const PAGE_KEYWORDS: Record<string, string[]> = {
  '/pricing': ['pricing', 'price', 'cost', 'package', 'budget'],
  '/contact': ['contact', 'reach', 'email', 'phone', 'consultation', 'quote'],
  '/project-rescue': ['rescue', 'failed', 'abandoned', 'broken', 'takeover', 'freelancer'],
  '/products': ['all products', 'product catalog', 'software catalog', 'what products'],
  '/portfolio': ['portfolio', 'work', 'projects'],
  '/case-studies': ['case stud'],
  '/about': ['about', 'who are you', 'company'],
  '/free-audit': ['free audit', 'audit'],
  '/hire-talent': ['hire', 'developer', 'talent'],
  '/our-process': ['process', 'how you work'],
  '/faqs': ['faq', 'frequently asked'],
  '/blog': ['blog', 'article'],
}

export function enrichResponseWithNavigation(
  transcript: string,
  response: ArfaResponse
): ArfaResponse {
  if (response.action.type !== 'none') return response

  const lower = transcript.toLowerCase()

  for (const [url, keywords] of Object.entries(PAGE_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      return {
        ...response,
        action: { type: 'navigate', payload: { url } },
      }
    }
  }

  return response
}
