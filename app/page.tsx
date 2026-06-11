import type { Metadata } from 'next'
import Script from 'next/script'
import HomePageClient from '@/components/HomePageClient'
import { CORE_KEYWORDS, SITE_URL } from '@/lib/seoKeywords'

export const metadata: Metadata = {
  title: 'Arfa Developers | Web Development Agency USA & Project Rescue',
  description:
    'US-focused web development agency. Custom Next.js/React apps, website rescue, and failed project takeover. Free consultation — we fix broken builds and ship production-ready software.',
  keywords: [...CORE_KEYWORDS],
  openGraph: {
    title: 'Arfa Developers | Web Development Agency USA & Project Rescue',
    description:
      'Custom web apps, project rescue, and website fixes for US businesses. Next.js experts. Free consultation.',
    type: 'website',
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Arfa Developers — Web Development Agency USA',
  url: SITE_URL,
  description:
    'Web development agency specializing in custom applications, project rescue, and website recovery for US businesses.',
  about: {
    '@type': 'Thing',
    name: 'Web development and project rescue services',
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '[data-seo-lead]'],
  },
}

export default function HomePage() {
  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <HomePageClient />
    </>
  )
}
