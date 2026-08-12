'use client'

import { useState } from 'react'
import MarketingAppBar from '@/components/marketing/MarketingAppBar'
import MarketingHero from '@/components/marketing/MarketingHero'
import LogoCollection from '@/components/marketing/LogoCollection'
import MarketingHighlights from '@/components/marketing/MarketingHighlights'
import MarketingFeatures from '@/components/marketing/MarketingFeatures'
import MarketingPortfolioSection from '@/components/marketing/MarketingPortfolioSection'
import MarketingProductsStrip from '@/components/marketing/MarketingProductsStrip'
import MarketingTestimonials from '@/components/marketing/MarketingTestimonials'
import MarketingFAQ from '@/components/marketing/MarketingFAQ'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import CTA from '@/components/CTA'
import ExitIntentPopup from '@/components/ExitIntentPopup'

export default function HomePageClient() {
  const [showExitPopup, setShowExitPopup] = useState(false)

  const handleScheduleConsultation = () => {
    const ctaSection = document.getElementById('contact')
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main>
      <MarketingAppBar />
      <MarketingHero />
      <LogoCollection />
      <MarketingHighlights />
      <MarketingFeatures />
      <MarketingPortfolioSection />
      <MarketingProductsStrip />
      <MarketingTestimonials />
      <MarketingFAQ />
      <CTA />
      <MarketingFooter />
      <ExitIntentPopup
        onClose={() => setShowExitPopup(false)}
        onScheduleConsultation={handleScheduleConsultation}
      />
    </main>
  )
}
