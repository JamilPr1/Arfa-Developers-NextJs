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

      // Customize Tawk.to widget using API - Hide text, show icon only
      ;(window as any).Tawk_API.onLoad = function () {
        // Hide all text bubbles and show only icon
        const hideTextBubble = () => {
          const widget = document.querySelector('#tawkchat-container') || document.querySelector('[id*="tawk"]')
          if (widget) {
            // Find and hide all bubble/text elements
            const bubbles = widget.querySelectorAll('.tawk-bubble, [class*="bubble"], [class*="widget-bubble"]')
            bubbles.forEach((bubble) => {
              const el = bubble as HTMLElement
              el.style.display = 'none'
              el.style.visibility = 'hidden'
              el.style.opacity = '0'
              el.style.width = '0'
              el.style.height = '0'
              el.style.padding = '0'
              el.style.margin = '0'
            })
            
            // Hide all text elements
            const textElements = widget.querySelectorAll(
              '.tawk-bubble-text, .tawk-bubble-text-wrapper, [class*="bubble-text"], [class*="widget-text"], [class*="text"]'
            )
            textElements.forEach((text) => {
              const el = text as HTMLElement
              el.style.display = 'none'
              el.style.visibility = 'hidden'
              el.style.opacity = '0'
            })
            
            // Style the button/icon to be circular and match brand
            const buttons = widget.querySelectorAll('.tawk-button, [class*="button"], [class*="icon"]')
            buttons.forEach((btn) => {
              const el = btn as HTMLElement
              el.style.width = '60px'
              el.style.height = '60px'
              el.style.borderRadius = '50%'
              el.style.background = 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)'
              el.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)'
              el.style.border = 'none'
            })
          }
        }

        // Hide text immediately and on delays
        hideTextBubble()
        setTimeout(hideTextBubble, 300)
        setTimeout(hideTextBubble, 800)
        setTimeout(hideTextBubble, 1500)
        setTimeout(hideTextBubble, 2500)
        setTimeout(hideTextBubble, 4000)
        
        // Use MutationObserver to catch dynamic changes
        const observer = new MutationObserver(() => {
          hideTextBubble()
        })
        
        setTimeout(() => {
          const widget = document.querySelector('#tawkchat-container')
          if (widget) {
            observer.observe(widget, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['style', 'class']
            })
          }
        }, 1000)
      }

      // Add custom CSS to style the widget - Icon only, no text
      const style = document.createElement('style')
      style.id = 'tawk-custom-styles'
      style.textContent = `
        /* Tawk containers can vary; cover the common ones */
        #tawkchat-container,
        #tawkchat-minified-container,
        #tawkchat-status-message,
        [id^="tawkchat-"],
        [id*="tawk"],
        [class*="tawk"] {
          right: 20px !important;
          z-index: 999 !important;
        }
        
        /* Hide the text bubble / attention grabber completely (\"We Are Here!\") */
        #tawkchat-container .tawk-bubble,
        #tawkchat-minified-container .tawk-bubble,
        [id^="tawkchat-"] .tawk-bubble,
        [id^="tawkchat-"] [class*="bubble"],
        [id^="tawkchat-"] [class*="widget-bubble"],
        [id^="tawkchat-"] [class*="attention"],
        [id^="tawkchat-"] [class*="status"],
        /* extra safety: hide any element that looks like a tawk bubble anywhere */
        .tawk-bubble,
        [class*="tawk-bubble"],
        [class*="tawk-attention"],
        [class*="tawk-status"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Hide all text elements */
        #tawkchat-container .tawk-bubble-text,
        #tawkchat-container .tawk-bubble-text-wrapper,
        #tawkchat-minified-container .tawk-bubble-text,
        #tawkchat-minified-container .tawk-bubble-text-wrapper,
        [id^="tawkchat-"] [class*="bubble-text"],
        [id^="tawkchat-"] [class*="widget-text"],
        [id^="tawkchat-"] [class*="text"],
        .tawk-bubble-text,
        .tawk-bubble-text-wrapper {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Style the icon button only - Simple circular button */
        #tawkchat-container iframe,
        #tawkchat-minified-container iframe,
        [id^="tawkchat-"] iframe {
          width: 60px !important;
          height: 60px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%) !important;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3) !important;
          border: none !important;
          transition: all 0.3s ease !important;
        }
        
        #tawkchat-container iframe:hover,
        #tawkchat-minified-container iframe:hover,
        [id^="tawkchat-"] iframe:hover {
          box-shadow: 0 6px 16px rgba(30, 58, 138, 0.5) !important;
          transform: scale(1.1) !important;
        }
        
        /* Ensure iframe (the widget) is styled as icon */
        #tawkchat-container iframe,
        #tawkchat-minified-container iframe,
        [id^="tawkchat-"] iframe {
          border-radius: 50% !important;
          overflow: hidden !important;
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
