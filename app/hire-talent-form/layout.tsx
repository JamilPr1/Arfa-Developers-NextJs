import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seoKeywords'

const pageUrl = `${SITE_URL}/hire-talent-form`

export const metadata: Metadata = {
  title: 'Hire Developer Request Form | Arfa Developers',
  description:
    'Submit your hiring requirements — stack, budget, timeline — and we will match you with vetted web developers for your project.',
  keywords: ['hire developer form', 'request developers', 'staff augmentation USA'],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
}

export default function HireTalentFormLayout({ children }: { children: React.ReactNode }) {
  return children
}
