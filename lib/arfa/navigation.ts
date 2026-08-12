import type { ArfaResponse } from './types'
import { getValidNavigationPaths } from './pages-knowledge'

const PAGE_KEYWORDS: Record<string, string[]> = {
  '/pricing': ['pricing', 'price', 'cost', 'package', 'budget'],
  '/contact': ['contact', 'reach', 'email', 'phone', 'consultation', 'quote'],
  '/project-rescue': ['rescue', 'failed', 'abandoned', 'broken', 'takeover', 'freelancer'],
  '/website-rescue': ['website rescue', 'fix my website', 'broken website'],
  '/products': ['all products', 'product catalog', 'software catalog', 'what products'],
  '/portfolio': ['portfolio', 'work samples', 'our work'],
  '/case-studies': ['case stud'],
  '/about': ['about', 'who are you', 'company'],
  '/free-audit': ['free audit', 'audit'],
  '/hire-talent': ['hire talent', 'hire developer', 'dedicated developer'],
  '/hire-nextjs-developers-usa': ['hire next.js', 'hire nextjs', 'next.js developer'],
  '/custom-software-development-usa': ['custom software'],
  '/web-development-agency-usa': ['web development agency'],
  '/website-maintenance-support-usa': ['maintenance', 'support plan'],
  '/our-process': ['process', 'how you work'],
  '/faqs': ['faq', 'frequently asked'],
  '/blog': ['blog', 'article'],
  '/services': ['services list', 'what services'],
  '/testimonials': ['testimonial', 'reviews'],
  '/automation': ['automation'],
  '/join-our-team': ['join our team', 'careers', 'jobs'],
}

export function enrichResponseWithNavigation(
  transcript: string,
  response: ArfaResponse
): ArfaResponse {
  if (response.action.type !== 'none') {
    // Validate navigate URLs against known pages when possible
    if (response.action.type === 'navigate' && response.action.payload?.url) {
      const url = response.action.payload.url
      const valid = getValidNavigationPaths()
      if (url.startsWith('/') && !valid.includes(url) && !url.startsWith('/products/') && !url.startsWith('/blog/') && !url.startsWith('/services/')) {
        return { ...response, action: { type: 'navigate', payload: { url: '/products' } } }
      }
    }
    return response
  }

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
