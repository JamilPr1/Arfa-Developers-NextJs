import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seoKeywords'

const pageUrl = `${SITE_URL}/hire-talent`

export const metadata: Metadata = {
  title: 'Hire Vetted Web Developers | Remote Talent | Arfa Developers',
  description:
    'Browse vetted developers for web, mobile, and full-stack projects. Hire remote talent through Arfa Developers with clear rates and proven delivery.',
  keywords: [
    'hire web developers',
    'hire remote developers',
    'hire next.js developer',
    'hire react developer',
    'dedicated development team',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Hire Vetted Web Developers | Arfa Developers',
    description: 'Hire remote developers for your next web or mobile project.',
    url: pageUrl,
    type: 'website',
  },
}

export default function HireTalentLayout({ children }: { children: React.ReactNode }) {
  return children
}
