'use client'

import { useState, useEffect } from 'react'
import { Box, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

interface Promotion {
  id: number
  text: string
  link: string
  active: boolean
}

export default function PromotionsBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([])

  useEffect(() => {
    fetchPromotions()
    // Refresh promotions every 30 seconds
    const interval = setInterval(fetchPromotions, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions')
      const data = await response.json()
      setPromotions(data)
    } catch (error) {
      console.error('Error fetching promotions:', error)
    }
  }

  if (promotions.length === 0) return null

  // Calculate animation duration based on content length
  const totalWidth = promotions.reduce((sum, p) => sum + p.text.length * 8 + 64, 0)
  const duration = Math.max(20, totalWidth / 50) // Adjust speed based on content

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        overflow: 'hidden',
        bgcolor: '#1E3A8A',
        color: 'white',
        py: 1,
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: `scroll ${duration}s linear infinite`,
          '@keyframes scroll': {
            '0%': {
              transform: 'translateX(100%)',
            },
            '100%': {
              transform: 'translateX(-50%)',
            },
          },
        }}
      >
        {/* Duplicate promotions multiple times for seamless loop */}
        {[...promotions, ...promotions, ...promotions].map((promotion, index) => (
          <Box
            key={`${promotion.id}-${index}`}
            sx={{
              flexShrink: 0,
              px: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <MuiLink
              component={Link}
              href={promotion.link}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                display: 'inline-block',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {promotion.text}
            </MuiLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
