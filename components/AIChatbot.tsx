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

      // Customize Tawk.to widget using API
      ;(window as any).Tawk_API.onLoad = function () {
        // Customize widget appearance after it loads
        const customizeWidget = () => {
          // Find the widget bubble
          const widget = document.querySelector('#tawkchat-container')
          if (widget) {
            // Customize bubble text
            const bubble = widget.querySelector('.tawk-bubble') as HTMLElement | null
            if (bubble) {
              const textElement = bubble.querySelector('.tawk-bubble-text, .tawk-bubble-text-wrapper') as HTMLElement | null
              if (textElement) {
                // Replace "We Are Here!" with custom text
                const currentText = textElement.textContent || ''
                if (currentText.includes('We Are Here') || currentText.includes('we are here') || currentText.trim() === '') {
                  textElement.textContent = '💬 Need Help?'
                  textElement.style.color = '#FFFFFF'
                  textElement.style.fontWeight = '600'
                  textElement.style.fontSize = '14px'
                }
              }
              
              // Style the bubble
              bubble.style.background = 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)'
              bubble.style.borderRadius = '25px'
              bubble.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)'
              bubble.style.padding = '12px 20px'
            }
          }
        }

        // Try to customize immediately and after delays
        customizeWidget()
        setTimeout(customizeWidget, 500)
        setTimeout(customizeWidget, 1500)
        setTimeout(customizeWidget, 3000)
      }

      // Add custom CSS to style the widget
      const style = document.createElement('style')
      style.id = 'tawk-custom-styles'
      style.textContent = `
        /* Customize Tawk.to widget appearance */
        #tawkchat-container {
          bottom: 20px !important;
          right: 20px !important;
          z-index: 999 !important;
        }
        #tawkchat-container .tawk-bubble {
          background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%) !important;
          border-radius: 25px !important;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3) !important;
          padding: 12px 20px !important;
          border: none !important;
        }
        #tawkchat-container .tawk-bubble-text,
        #tawkchat-container .tawk-bubble-text-wrapper {
          color: #FFFFFF !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          font-family: 'Poppins', sans-serif !important;
        }
        /* Hide emoji if present in default text */
        #tawkchat-container .tawk-bubble-text::before {
          display: none !important;
        }
      `
      document.head.appendChild(style)

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
