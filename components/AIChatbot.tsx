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
          // Find the widget bubble - try multiple selectors
          const widget = document.querySelector('#tawkchat-container') || document.querySelector('[id*="tawk"]')
          if (widget) {
            // Customize bubble text - try multiple selectors
            const bubbleEl = widget.querySelector('.tawk-bubble') || 
                          widget.querySelector('[class*="bubble"]') ||
                          widget.querySelector('[class*="tawk"]')
            const bubble = bubbleEl as HTMLElement | null
            
            if (bubble) {
              // Find text element with multiple selectors
              const textSelectors = [
                '.tawk-bubble-text',
                '.tawk-bubble-text-wrapper',
                '[class*="bubble-text"]',
                '[class*="widget-text"]',
                'span',
                'div'
              ]
              
              let textElement: HTMLElement | null = null
              for (const selector of textSelectors) {
                const found = bubble.querySelector(selector) as HTMLElement | null
                if (found && (found.textContent || found.innerText)) {
                  textElement = found
                  break
                }
              }
              
              // If no text element found, use bubble itself
              if (!textElement) {
                textElement = bubble
              }
              
              if (textElement) {
                // Always replace text regardless of current content
                const currentText = textElement.textContent || textElement.innerText || ''
                
                // Replace any variation of "We Are Here" or set default text
                if (currentText.toLowerCase().includes('we are here') || 
                    currentText.toLowerCase().includes('we\'re here') ||
                    currentText.trim() === '' ||
                    currentText.length < 5) {
                  textElement.textContent = '💬 Need Help?'
                  textElement.style.color = '#FFFFFF'
                  textElement.style.fontWeight = '600'
                  textElement.style.fontSize = '14px'
                } else if (!currentText.includes('Need Help')) {
                  // Force change if it's not our custom text
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

        // Try to customize immediately and after delays (more attempts)
        customizeWidget()
        setTimeout(customizeWidget, 300)
        setTimeout(customizeWidget, 800)
        setTimeout(customizeWidget, 1500)
        setTimeout(customizeWidget, 2500)
        setTimeout(customizeWidget, 4000)
        
        // Also use MutationObserver to catch dynamic changes
        const observer = new MutationObserver(() => {
          customizeWidget()
        })
        
        setTimeout(() => {
          const widget = document.querySelector('#tawkchat-container')
          if (widget) {
            observer.observe(widget, {
              childList: true,
              subtree: true,
              characterData: true
            })
          }
        }, 1000)
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
        #tawkchat-container .tawk-bubble-text-wrapper,
        #tawkchat-container [class*="bubble-text"],
        #tawkchat-container [class*="widget-text"],
        #tawkchat-container .tawk-bubble span,
        #tawkchat-container .tawk-bubble div {
          color: #FFFFFF !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          font-family: 'Poppins', sans-serif !important;
        }
        /* Force text content using CSS (if possible) */
        #tawkchat-container .tawk-bubble::after {
          content: '💬 Need Help?' !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        /* Hide original text if needed */
        #tawkchat-container .tawk-bubble-text:not(:empty) {
          display: none !important;
        }
        #tawkchat-container .tawk-bubble-text:empty::after {
          content: '💬 Need Help?' !important;
          display: block !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          font-size: 14px !important;
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
