import type { ArfaAction, ArfaResponse } from './types'
import { findPageForNavigation, getValidNavigationPaths } from './pages-knowledge'

const PAGE_KEYWORDS: Record<string, string[]> = {
  '/pricing': ['pricing page', 'price list', 'packages'],
  '/contact': ['contact page', 'get in touch', 'reach out'],
  '/project-rescue': ['project rescue', 'failed project', 'abandoned project'],
  '/website-rescue': ['website rescue', 'fix my website', 'broken website'],
  '/products': ['products page', 'product catalog', 'software catalog', 'all products'],
  '/portfolio': ['portfolio page', 'work samples', 'our work'],
  '/case-studies': ['case studies', 'case study'],
  '/about': ['about page', 'about us'],
  '/free-audit': ['free audit', 'website audit'],
  '/hire-talent': ['hire talent', 'hire developer', 'dedicated developer'],
  '/hire-nextjs-developers-usa': ['hire next.js', 'hire nextjs', 'next.js developer'],
  '/custom-software-development-usa': ['custom software page'],
  '/web-development-agency-usa': ['web development agency'],
  '/website-maintenance-support-usa': ['maintenance support', 'support plan'],
  '/our-process': ['our process', 'how you work'],
  '/faqs': ['faq page', 'frequently asked'],
  '/blog': ['blog page'],
  '/services': ['services page', 'all services'],
  '/testimonials': ['testimonials', 'client reviews'],
  '/automation': ['automation page'],
  '/join-our-team': ['join our team', 'careers', 'job opening'],
}

const NAV_INTENT =
  /\b(take me|go to|open|navigate|show me|bring me|visit|redirect|send me|i want to (see|go|open)|can you open|please open|take us)\b/i

/** Normalize model ACTION shapes into { type, payload: { url } }. */
export function normalizeAction(raw: unknown): ArfaAction {
  if (!raw || typeof raw !== 'object') return { type: 'none' }
  const obj = raw as Record<string, unknown>
  const type = String(obj.type || 'none') as ArfaAction['type']

  if (type === 'open_contact') return { type: 'open_contact', payload: { url: '/contact' } }

  if (type === 'navigate') {
    const payload = (obj.payload as Record<string, unknown> | undefined) || {}
    const url = String(obj.url || payload.url || '').trim()
    if (!url) return { type: 'none' }
    return { type: 'navigate', payload: { url: canonicalizePath(url) } }
  }

  return { type: 'none' }
}

function canonicalizePath(url: string): string {
  if (url.startsWith('http')) return url
  let path = url.startsWith('/') ? url : `/${url}`
  path = path.replace(/\/+$/, '') || '/'
  const valid = getValidNavigationPaths()
  if (valid.includes(path)) return path
  if (path.startsWith('/products/') || path.startsWith('/blog/') || path.startsWith('/services/')) {
    return path
  }
  const match = findPageForNavigation(path.replace(/\//g, ' '))
  return match?.path || path
}

export function enrichResponseWithNavigation(
  transcript: string,
  response: ArfaResponse
): ArfaResponse {
  const action = normalizeAction(response.action)
  const next: ArfaResponse = { ...response, action }
  const wantsNav = NAV_INTENT.test(transcript)
  const matched = findPageForNavigation(transcript)

  // Model already chose a destination
  if (next.action.type === 'navigate' && next.action.payload?.url) {
    return next
  }
  if (next.action.type === 'open_contact') {
    return next
  }

  // Explicit navigation requests → open the best matching page
  if (wantsNav && matched) {
    return {
      ...next,
      action: { type: 'navigate', payload: { url: matched.path } },
      text: next.text?.trim()
        ? next.text
        : `Sure — opening ${matched.title} for you now.`,
    }
  }

  // Keyword fallbacks when user clearly asks to go somewhere
  if (wantsNav) {
    const lower = transcript.toLowerCase()
    for (const [url, keywords] of Object.entries(PAGE_KEYWORDS)) {
      if (keywords.some((k) => lower.includes(k))) {
        return {
          ...next,
          action: { type: 'navigate', payload: { url } },
        }
      }
    }
  }

  return next
}
