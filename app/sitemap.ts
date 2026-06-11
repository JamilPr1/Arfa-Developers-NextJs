import type { MetadataRoute } from 'next'
import { readDataFile } from '@/lib/dataUtils'
import {
  SITE_BASE_URL,
  SERVICE_SLUGS,
  STATIC_SITEMAP_PATHS,
  priorityForPath,
} from '@/lib/sitemapPaths'

interface BlogRecord {
  id: number
  published?: boolean
  updatedAt?: string
  createdAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_SITEMAP_PATHS.map((path) => ({
    url: `${SITE_BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: priorityForPath(path),
  }))

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const blogs = await readDataFile<BlogRecord>('blogs.json')
    blogEntries = blogs
      .filter((b) => b.published !== false && b.id != null)
      .map((b) => ({
        url: `${SITE_BASE_URL}/blog/${b.id}`,
        lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.warn('sitemap: could not load blogs.json', error)
  }

  return [...staticEntries, ...serviceEntries, ...blogEntries]
}
