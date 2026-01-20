'use client'

import { useEffect } from 'react'
import { Box } from '@mui/material'

interface CalendlyWidgetProps {
  url: string
  height?: string
}

export default function CalendlyWidget({ url, height = '700px' }: CalendlyWidgetProps) {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      const calendlyScript = document.querySelector('script[src*="calendly.com"]')
      if (calendlyScript) {
        document.body.removeChild(calendlyScript)
      }
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        height,
        overflow: 'hidden',
        '& .calendly-inline-widget': {
          minWidth: '320px',
          height: '100%',
        },
      }}
    >
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: '320px', height: '100%' }}
      />
    </Box>
  )
}
