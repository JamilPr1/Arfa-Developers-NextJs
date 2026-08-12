import { siteConfig } from './siteConfig'

export const SITE_URL = siteConfig.siteUrl

/** Primary ranking targets — money pages, rescue niche, AI/ML & modern stacks */
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
  'AI software development USA',
  'AI voice agents',
  'conversational AI for business',
  'OpenAI integration services',
  'LLM application development',
  'RAG chatbot development',
  'AI automation agency',
  'machine learning consulting USA',
  'WhatsApp AI automation',
  'AI sales agents',
  'custom GPT integration',
  'React development agency USA',
  'TypeScript web development',
  'full stack Next.js agency',
] as const

/** In-demand stacks highlighted across marketing + service pages */
export const IN_DEMAND_STACKS = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'OpenAI',
  'LangChain',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'AWS',
  'Vercel',
  'Redis',
  'React Native',
  'Tailwind CSS',
] as const

/** Per-service SEO keywords (slug → meta keywords) */
export const SERVICE_SEO_KEYWORDS: Record<string, string[]> = {
  'ai-ml-llm': [
    'AI ML LLM development',
    'LLM application development',
    'OpenAI integration services',
    'RAG chatbot development',
    'AI voice agents',
    'LangChain development',
    'custom GPT integration',
    'generative AI development agency',
    'conversational AI for business',
    'AI software development USA',
  ],
  'business-automation': [
    'business process automation AI',
    'n8n automation',
    'n8n workflow automation',
    'WhatsApp AI automation',
    'CRM automation with AI',
    'AI workflow automation',
    'Zapier alternative n8n',
    'AI automation agency USA',
    'Meta CRM automation',
  ],
  'web-development': [
    'web development services USA',
    'custom web application development',
    'react web development',
    'next.js web development',
    'full stack development agency',
    'TypeScript web apps',
    'AI-powered web applications',
  ],
  'mobile-app-development': [
    'mobile app development USA',
    'ios android app development',
    'react native development',
    'Flutter app development',
    'AI mobile apps',
  ],
  'cloud-solutions': [
    'cloud solutions',
    'aws cloud development',
    'cloud migration services',
    'Docker Kubernetes consulting',
    'Vercel deployment agency',
  ],
  'data-analytics': [
    'data analytics services',
    'business intelligence development',
    'AI analytics dashboards',
    'machine learning insights',
  ],
  'security-compliance': [
    'web application security',
    'security compliance development',
    'HIPAA web development',
  ],
  'performance-optimization': [
    'website speed optimization',
    'core web vitals improvement',
    'next.js performance optimization',
  ],
  'ecommerce-development': [
    'ecommerce development USA',
    'shopify development',
    'woocommerce rescue',
    'headless commerce Next.js',
  ],
  'enterprise-solutions': [
    'enterprise software development',
    'custom enterprise applications',
    'AI automation for enterprise',
  ],
  'website-redesign': ['website redesign services', 'website modernization USA', 'Next.js redesign'],
  'landing-pages': ['landing page development', 'high converting landing pages', 'CRO landing pages'],
  'seo-services': ['SEO services USA', 'search engine optimization agency', 'technical SEO Next.js'],
  'technical-seo': ['technical SEO services', 'technical SEO audit', 'next.js SEO'],
  'local-seo': ['local SEO services USA', 'local search optimization'],
  'seo-audit': ['SEO audit services', 'free SEO audit', 'website SEO analysis'],
  'digital-marketing': ['digital marketing agency', 'web marketing services', 'AI marketing automation'],
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
    'AI software development',
  ]
}
