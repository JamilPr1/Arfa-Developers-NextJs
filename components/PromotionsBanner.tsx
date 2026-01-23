'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [hasLoaded, setHasLoaded] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  const fetchPromotions = useCallback(async () => {
    try {
      // Use fetch with no-cache and timestamp to ensure fresh data
      // Priority fetch for immediate loading - use AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/promotions?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        const validPromotions = Array.isArray(data) ? data.filter((p: any) => p && p.active === true) : []
        setPromotions(validPromotions)
        setHasLoaded(true)
        setIsLoading(false)
      } else {
        console.warn('Failed to fetch promotions:', response.status)
        setIsLoading(false)
        setHasLoaded(true) // Mark as loaded even on error to prevent infinite loading
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching promotions:', error)
      }
      setIsLoading(false)
      setHasLoaded(true) // Mark as loaded to prevent infinite loading state
    }
  }, [])

  useEffect(() => {
    // Fetch immediately on mount
    fetchPromotions()
    // Refresh promotions every 30 seconds to keep it active
    const interval = setInterval(fetchPromotions, 30000)
    return () => clearInterval(interval)
  }, [fetchPromotions])

  // Show loading state only on initial load (first time) - but don't block rendering
  // Render immediately with empty state, then update when data loads
  if (!hasLoaded && isLoading && promotions.length === 0) {
    // Return minimal loading state that doesn't block
    return null
  }

  // Don't render if no active promotions after loading
  if (hasLoaded && promotions.length === 0) return null

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
