import { siteConfig } from './siteConfig'

export const SITE_BASE_URL = siteConfig.siteUrl

/** All `/services/[slug]` routes (keep in sync with `app/services/[slug]/page.tsx`). */
export const SERVICE_SLUGS = [
  'ai-ml-llm',
  'business-automation',
  'web-development',
  'mobile-app-development',
  'cloud-solutions',
  'data-analytics',
  'security-compliance',
  'performance-optimization',
  'ecommerce-development',
  'enterprise-solutions',
  'website-redesign',
  'landing-pages',
  'seo-services',
  'technical-seo',
  'local-seo',
  'seo-audit',
  'digital-marketing',
  'google-ads-management',
  'content-marketing',
  'email-marketing',
] as const

/** Indexable static paths (excludes legal pages with `noindex`). */
export const STATIC_SITEMAP_PATHS = [
  '',
  '/about',
  '/services',
  '/ai-automation',
  '/portfolio',
  '/products',
  '/case-studies',
  '/case-studies/project-rescue-usa-saas',
  '/case-studies/ecommerce-rescue-usa',
  '/case-studies/healthcare-platform-usa',
  '/blog',
  '/contact',
  '/free-audit',
  '/pricing',
  '/testimonials',
  '/faqs',
  '/our-process',
  '/hire-talent',
  '/hire-talent-form',
  '/join-our-team',
  '/website-rescue',
  '/project-rescue',
  '/web-development-agency-usa',
  '/custom-software-development-usa',
  '/hire-nextjs-developers-usa',
  '/website-maintenance-support-usa',
] as const

const HIGH_PRIORITY_PATHS = new Set([
  '',
  '/web-development-agency-usa',
  '/project-rescue',
  '/website-rescue',
  '/custom-software-development-usa',
  '/hire-nextjs-developers-usa',
  '/website-maintenance-support-usa',
  '/ai-automation',
  '/free-audit',
  '/services',
])

export function priorityForPath(path: string): number {
  if (path === '') return 1
  if (HIGH_PRIORITY_PATHS.has(path)) return 0.9
  return 0.7
}
