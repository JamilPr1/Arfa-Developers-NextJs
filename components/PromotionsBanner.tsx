'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch immediately on mount with priority
    fetchPromotions()
    // Refresh promotions every 60 seconds (less frequent for better performance)
    const interval = setInterval(fetchPromotions, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchPromotions = async () => {
    try {
      setIsLoading(true)
      // Use fetch with no-cache and priority
      const response = await fetch('/api/promotions', {
        cache: 'no-store',
        next: { revalidate: 0 },
        priority: 'high',
      })
      if (response.ok) {
        const data = await response.json()
        const validPromotions = Array.isArray(data) ? data.filter((p: any) => p.active) : []
        setPromotions(validPromotions)
      } else {
        setPromotions([])
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
      setPromotions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state briefly, then show content
  if (isLoading && promotions.length === 0) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          bgcolor: '#1E3A8A',
          py: { xs: 1, sm: 1.5 },
          zIndex: 1300,
        }}
      />
    )
  }

  if (promotions.length === 0) return null

  // Calculate animation duration - slower speed (60-90 seconds for smooth scrolling)
  const totalWidth = promotions.reduce((sum, p) => sum + (p.text?.length || 0) * 10 + 80, 0)
  const duration = Math.max(60, Math.min(90, totalWidth / 20)) // Slower, capped at 90s for smooth scrolling

  return (
    <Box
      ref={bannerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        overflow: 'hidden',
        bgcolor: '#1E3A8A',
        color: 'white',
        py: { xs: 1, sm: 1.5 },
        zIndex: 1300,
        cursor: 'pointer',
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: `scroll ${duration}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
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
              px: { xs: 4, sm: 6 },
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
                fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                display: 'inline-block',
                '&:hover': {
                  textDecoration: 'underline',
                },
                transition: 'all 0.2s ease',
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
