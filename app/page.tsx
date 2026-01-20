'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Blog from '@/components/Blog'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import ExitIntentPopup from '@/components/ExitIntentPopup'

export default function Home() {
  const [showExitPopup, setShowExitPopup] = useState(false)

  const handleScheduleConsultation = () => {
    // Scroll to CTA section or open Calendly
    const ctaSection = document.getElementById('contact')
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Testimonials />
      <Blog />
      <CTA />
      <Footer />
      <ExitIntentPopup
        onClose={() => setShowExitPopup(false)}
        onScheduleConsultation={handleScheduleConsultation}
      />
    </main>
  )
}
