'use client'

import { useEffect } from 'react'

interface LiveChatProps {
  provider: 'tidio' | 'drift' | 'intercom'
  id?: string
}

export default function LiveChat({ provider, id }: LiveChatProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    switch (provider) {
      case 'tidio':
        // Tidio Chat
        if (id) {
          const script = document.createElement('script')
          script.src = `//code.tidio.co/${id}.js`
          script.async = true
          document.body.appendChild(script)

          return () => {
            const tidioScript = document.querySelector(`script[src*="tidio.co"]`)
            if (tidioScript) {
              document.body.removeChild(tidioScript)
            }
          }
        }
        break

      case 'drift':
        // Drift Chat
        if (id) {
          ;(window as any).driftSettings = {
            embedId: id,
          }
          const script = document.createElement('script')
          script.id = 'drift-widget'
          script.src = 'https://js.driftt.com/include/' + id + '/js'
          script.async = true
          document.body.appendChild(script)

          return () => {
            const driftScript = document.querySelector('#drift-widget')
            if (driftScript) {
              document.body.removeChild(driftScript)
            }
          }
        }
        break

      case 'intercom':
        // Intercom Chat
        if (id) {
          ;(window as any).Intercom('boot', {
            app_id: id,
          })

          const script = document.createElement('script')
          script.src = 'https://widget.intercom.io/widget/' + id
          script.async = true
          document.body.appendChild(script)

          return () => {
            const intercomScript = document.querySelector(`script[src*="intercom.io"]`)
            if (intercomScript) {
              document.body.removeChild(intercomScript)
            }
          }
        }
        break
    }
  }, [provider, id])

  return null
}
