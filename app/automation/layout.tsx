import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Automation | Arfa Developers',
}

export default function AutomationLayout({ children }: { children: React.ReactNode }) {
  return children
}
