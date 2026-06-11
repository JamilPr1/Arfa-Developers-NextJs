import { siteConfig } from './siteConfig'

export const SITE_URL = siteConfig.siteUrl

/** Primary ranking targets — money pages & rescue niche */
export const CORE_KEYWORDS = [
  'web development agency USA',
  'project rescue USA',
  'rescue failed projects',
  'fix broken website',
  'website rescue',
  'custom software development USA',
  'hire next.js developers USA',
  'free website audit',
  'next.js development agency',
  'failed freelancer project recovery',
] as const

/** Per-service SEO keywords (slug → meta keywords) */
export const SERVICE_SEO_KEYWORDS: Record<string, string[]> = {
  'web-development': [
    'web development services USA',
    'custom web application development',
    'react web development',
    'next.js web development',
    'full stack development agency',
  ],
  'mobile-app-development': [
    'mobile app development USA',
    'ios android app development',
    'react native development',
  ],
  'cloud-solutions': ['cloud solutions', 'aws cloud development', 'cloud migration services'],
  'data-analytics': ['data analytics services', 'business intelligence development'],
  'security-compliance': ['web application security', 'security compliance development'],
  'performance-optimization': [
    'website speed optimization',
    'core web vitals improvement',
    'next.js performance optimization',
  ],
  'ecommerce-development': ['ecommerce development USA', 'shopify development', 'woocommerce rescue'],
  'enterprise-solutions': ['enterprise software development', 'custom enterprise applications'],
  'website-redesign': ['website redesign services', 'website modernization USA'],
  'landing-pages': ['landing page development', 'high converting landing pages'],
  'seo-services': ['SEO services USA', 'search engine optimization agency'],
  'technical-seo': ['technical SEO services', 'technical SEO audit', 'next.js SEO'],
  'local-seo': ['local SEO services USA', 'local search optimization'],
  'seo-audit': ['SEO audit services', 'free SEO audit', 'website SEO analysis'],
  'digital-marketing': ['digital marketing agency', 'web marketing services'],
  'google-ads-management': ['google ads management', 'ppc agency USA'],
  'content-marketing': ['content marketing services', 'B2B content strategy'],
  'email-marketing': ['email marketing services', 'email automation development'],
}

export function keywordsForService(slug: string, title: string): string[] {
  const specific = SERVICE_SEO_KEYWORDS[slug] || []
  return [
    ...specific,
    `${title.toLowerCase()} services`,
    `${title.toLowerCase()} USA`,
    'arfa developers',
  ]
}
