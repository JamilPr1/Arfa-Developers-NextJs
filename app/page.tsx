import type { Metadata } from 'next'
import Script from 'next/script'
import HomePageClient from '@/components/HomePageClient'
import { CORE_KEYWORDS, SITE_URL } from '@/lib/seoKeywords'

export const metadata: Metadata = {
  title: 'Arfa Developers | Web Development, Project Rescue & AI Agents USA',
  description:
    'US-focused agency for Next.js/React apps, failed project rescue, AI voice agents, LLM apps, and automation. Free consultation — ship production-ready software.',
  keywords: [...CORE_KEYWORDS],
  openGraph: {
    title: 'Arfa Developers | Web Development, Project Rescue & AI Agents USA',
    description:
      'Custom web apps, project rescue, AI voice agents, and automation for US businesses. Next.js + OpenAI experts.',
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
  name: 'Arfa Developers — Web Development, Project Rescue & AI USA',
  url: SITE_URL,
  description:
    'Web development agency specializing in custom applications, project rescue, AI voice agents, and automation for US businesses.',
  about: {
    '@type': 'Thing',
    name: 'Web development, project rescue, and AI automation services',
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
