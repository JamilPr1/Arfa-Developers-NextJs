'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only initialize AOS after component has mounted on client
    setMounted(true)
    if (typeof window !== 'undefined') {
      // Delay to ensure DOM is fully hydrated and prevent SSR class conflicts
      const timer = setTimeout(() => {
        // Disable AOS during SSR by setting disable to 'mobile' initially
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          offset: 100,
          disable: false,
          startEvent: 'DOMContentLoaded',
        })
        // Refresh after a short delay to ensure all elements are ready
        setTimeout(() => {
          AOS.refresh()
        }, 200)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [])

  // Prevent AOS from running during SSR
  if (!mounted) {
    return null
  }

  return null
}
