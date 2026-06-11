import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seoKeywords'

const pageUrl = `${SITE_URL}/join-our-team`

export const metadata: Metadata = {
  title: 'Join Our Team | Careers at Arfa Developers',
  description:
    'Apply to join Arfa Developers — web developers, designers, and project managers building custom apps and project rescue solutions.',
  keywords: ['web developer jobs', 'join development team', 'remote developer careers'],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Join Our Team | Arfa Developers',
    url: pageUrl,
    type: 'website',
  },
}

export default function JoinOurTeamLayout({ children }: { children: React.ReactNode }) {
  return children
}
