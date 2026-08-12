import { SERVICE_SLUGS, STATIC_SITEMAP_PATHS } from '@/lib/sitemapPaths'
import { getProductsKnowledge } from './products-knowledge'

export interface PageKnowledge {
  path: string
  title: string
  description: string
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Home',
    description: 'Main landing page — US web development agency, project rescue, and custom software overview.',
  },
  '/about': {
    title: 'About Us',
    description: 'Company story, team, and why clients choose Arfa Developers.',
  },
  '/services': {
    title: 'Services',
    description: 'Full list of web, mobile, cloud, SEO, marketing, and enterprise services.',
  },
  '/portfolio': {
    title: 'Portfolio',
    description: 'Selected projects and delivered work samples.',
  },
  '/products': {
    title: 'Products',
    description: 'Software product catalog — Voice Agent, POS, CRM, HRM, e-commerce, school, clinic, and more.',
  },
  '/case-studies': {
    title: 'Case Studies',
    description: 'Detailed success stories including SaaS rescue, ecommerce, and healthcare platforms.',
  },
  '/case-studies/project-rescue-usa-saas': {
    title: 'Case Study: SaaS Project Rescue',
    description: 'How we rescued a failed US SaaS build and shipped a production-ready product.',
  },
  '/case-studies/ecommerce-rescue-usa': {
    title: 'Case Study: Ecommerce Rescue',
    description: 'Ecommerce platform recovery — performance, checkout, and conversion fixes.',
  },
  '/case-studies/healthcare-platform-usa': {
    title: 'Case Study: Healthcare Platform',
    description: 'Custom healthcare software delivery for a US client.',
  },
  '/blog': {
    title: 'Blog',
    description: 'Articles on web development, SEO, Next.js, and project rescue.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Free consultation — email, phone, WhatsApp, and contact form.',
  },
  '/free-audit': {
    title: 'Free Audit',
    description: 'Request a free website or project audit.',
  },
  '/pricing': {
    title: 'Pricing',
    description: 'Transparent pricing ranges for web development, redesign, ecommerce, SEO, and marketing.',
  },
  '/testimonials': {
    title: 'Testimonials',
    description: 'Client reviews and feedback.',
  },
  '/faqs': {
    title: 'FAQs',
    description: 'Frequently asked questions about process, pricing, and project rescue.',
  },
  '/our-process': {
    title: 'Our Process',
    description: 'How we work with clients from discovery to launch and support.',
  },
  '/hire-talent': {
    title: 'Hire Talent',
    description: 'Hire dedicated developers for your team.',
  },
  '/hire-talent-form': {
    title: 'Hire Talent Form',
    description: 'Submit a request to hire developers.',
  },
  '/join-our-team': {
    title: 'Join Our Team',
    description: 'Careers and openings at Arfa Developers.',
  },
  '/website-rescue': {
    title: 'Website Rescue',
    description: 'Fix broken, slow, or abandoned websites.',
  },
  '/project-rescue': {
    title: 'Project Rescue',
    description: 'Takeover and recovery of failed or abandoned software projects.',
  },
  '/web-development-agency-usa': {
    title: 'Web Development Agency USA',
    description: 'US-focused agency page for custom web application development.',
  },
  '/custom-software-development-usa': {
    title: 'Custom Software Development USA',
    description: 'Custom software for US businesses — discovery, build, and support.',
  },
  '/hire-nextjs-developers-usa': {
    title: 'Hire Next.js Developers USA',
    description: 'Hire experienced Next.js / React developers for US projects.',
  },
  '/website-maintenance-support-usa': {
    title: 'Website Maintenance & Support USA',
    description: 'Ongoing maintenance, updates, and support for live sites.',
  },
  '/automation': {
    title: 'Automation',
    description: 'Business automation solutions and lead-generation tooling.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description: 'How we collect and use personal data.',
  },
  '/terms-of-service': {
    title: 'Terms of Service',
    description: 'Terms governing use of our website and services.',
  },
  '/refund-policy': {
    title: 'Refund Policy',
    description: 'Refund terms for services and engagements.',
  },
}

const SERVICE_TITLES: Record<string, string> = {
  'web-development': 'Web Development',
  'mobile-app-development': 'Mobile App Development',
  'cloud-solutions': 'Cloud Solutions',
  'data-analytics': 'Data Analytics',
  'security-compliance': 'Security & Compliance',
  'performance-optimization': 'Performance Optimization',
  'ecommerce-development': 'E-commerce Development',
  'enterprise-solutions': 'Enterprise Solutions',
  'website-redesign': 'Website Redesign',
  'landing-pages': 'Landing Pages',
  'seo-services': 'SEO Services',
  'technical-seo': 'Technical SEO',
  'local-seo': 'Local SEO',
  'seo-audit': 'SEO Audit',
  'digital-marketing': 'Digital Marketing',
  'google-ads-management': 'Google Ads Management',
  'content-marketing': 'Content Marketing',
  'email-marketing': 'Email Marketing',
}

/** All public pages Arfa can navigate to or describe. */
export function getAllPagesKnowledge(): PageKnowledge[] {
  const pages: PageKnowledge[] = []
  const seen = new Set<string>()

  const add = (path: string, title?: string, description?: string) => {
    const normalized = path === '' ? '/' : path
    if (seen.has(normalized)) return
    seen.add(normalized)
    const meta = PAGE_META[normalized]
    pages.push({
      path: normalized,
      title: title || meta?.title || titleFromPath(normalized),
      description: description || meta?.description || `Page at ${normalized}`,
    })
  }

  for (const p of STATIC_SITEMAP_PATHS) {
    add(p === '' ? '/' : p)
  }

  add('/automation')
  add('/privacy-policy')
  add('/terms-of-service')
  add('/refund-policy')

  for (const slug of SERVICE_SLUGS) {
    add(
      `/services/${slug}`,
      SERVICE_TITLES[slug] || titleFromPath(slug),
      `${SERVICE_TITLES[slug] || slug} service details, features, and use cases.`
    )
  }

  for (const product of getProductsKnowledge()) {
    add(product.url, product.name, `${product.shortDescription} Pricing: ${product.price}.`)
  }

  return pages
}

export function getValidNavigationPaths(): string[] {
  return getAllPagesKnowledge().map((p) => p.path)
}

/** Match user speech like "take me to pricing" / "open school management" to a site path. */
export function findPageForNavigation(query: string): PageKnowledge | null {
  const lower = query.toLowerCase().trim()
  if (!lower) return null

  const pages = getAllPagesKnowledge()

  // Explicit path spoken aloud
  const pathMatch = lower.match(/\/[a-z0-9\-\/]+/)
  if (pathMatch) {
    const path = pathMatch[0].replace(/\/$/, '') || '/'
    const found = pages.find((p) => p.path === path)
    if (found) return found
  }

  let best: { page: PageKnowledge; score: number } | null = null

  for (const page of pages) {
    const title = page.title.toLowerCase()
    const slugWords = page.path.replace(/^\//, '').replace(/\//g, ' ').replace(/-/g, ' ')
    let score = 0

    if (lower.includes(title) && title.length > 3) score = Math.max(score, 100)
    if (slugWords && lower.includes(slugWords) && slugWords.length > 3) score = Math.max(score, 95)

    // Token overlap against title + slug
    const tokens = `${title} ${slugWords}`.split(/\s+/).filter((t) => t.length > 2)
    const qTokens = lower.split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t))
    if (tokens.length && qTokens.length) {
      const hit = qTokens.filter((t) => tokens.some((tok) => tok.includes(t) || t.includes(tok))).length
      const ratio = hit / qTokens.length
      if (ratio >= 0.5) score = Math.max(score, Math.round(ratio * 90))
    }

    // Prefer longer/more specific paths when scores tie
    if (score > 0 && (!best || score > best.score || (score === best.score && page.path.length > best.page.path.length))) {
      best = { page, score }
    }
  }

  return best && best.score >= 50 ? best.page : null
}

const STOP = new Set([
  'the', 'and', 'for', 'you', 'your', 'our', 'can', 'please', 'want', 'like', 'take', 'me', 'to', 'go',
  'open', 'show', 'page', 'website', 'site', 'about', 'tell', 'what', 'where', 'how', 'is', 'are',
  'a', 'an', 'of', 'on', 'in', 'my', 'this', 'that', 'navigate', 'bring',
])

function titleFromPath(path: string): string {
  return path
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' — ') || 'Home'
}
