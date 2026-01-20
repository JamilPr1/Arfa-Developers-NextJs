'use client'

import { useEffect } from 'react'

export default function AIChatbot() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Tawk.to - Free AI Chatbot that can read website content and auto-reply
    // Property ID: 696ffb99f657ac197b784100/1jfemtkfg
    const tawkId = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID || '696ffb99f657ac197b784100/1jfemtkfg'

    if (tawkId) {
      // Initialize Tawk.to API
      ;(window as any).Tawk_API = (window as any).Tawk_API || {}
      ;(window as any).Tawk_LoadStart = new Date()

      // Tawk.to script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://embed.tawk.to/${tawkId}`
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
      
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      } else {
        document.head.appendChild(script)
      }

      return () => {
        const tawkScript = document.querySelector(`script[src*="tawk.to"]`)
        if (tawkScript && tawkScript.parentNode) {
          tawkScript.parentNode.removeChild(tawkScript)
        }
      }
    } else {
      // Alternative: Crisp (free tier) - AI chatbot with auto-reply
      const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || ''
      
      if (crispWebsiteId) {
        ;(window as any).$crisp = []
        ;(window as any).CRISP_WEBSITE_ID = crispWebsiteId
        const script = document.createElement('script')
        script.src = 'https://client.crisp.chat/l.js'
        script.async = true
        document.head.appendChild(script)

        return () => {
          const crispScript = document.querySelector(`script[src*="crisp.chat"]`)
          if (crispScript && crispScript.parentNode) {
            crispScript.parentNode.removeChild(crispScript)
          }
        }
      }
    }
  }, [])

  return null
}
