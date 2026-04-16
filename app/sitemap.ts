import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.arfadevelopers.com'
  const now = new Date()

  const routes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/case-studies',
    '/case-studies/project-rescue-usa-saas',
    '/case-studies/ecommerce-rescue-usa',
    '/case-studies/healthcare-platform-usa',
    '/blog',
    '/contact',
    '/free-audit',
    '/website-rescue',
    '/project-rescue',
    '/web-development-agency-usa',
    '/custom-software-development-usa',
  ]

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}

