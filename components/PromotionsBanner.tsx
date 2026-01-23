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
  const bannerRef = useRef<HTMLDivElement>(null)

  const fetchPromotions = useCallback(async () => {
    try {
      setIsLoading(true)
      // Use fetch with no-cache and timestamp to ensure fresh data
      // Priority fetch for immediate loading - use AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout for faster fail
      
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
      } else {
        console.warn('Failed to fetch promotions:', response.status)
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching promotions:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch immediately on mount - highest priority
    if (typeof window !== 'undefined') {
      // Fetch immediately, don't wait
      fetchPromotions()
      // Refresh promotions every 30 seconds to keep it active
      const interval = setInterval(fetchPromotions, 30000)
      return () => clearInterval(interval)
    }
  }, [fetchPromotions])

  // Always render the banner container immediately
  // Show loading skeleton or actual promotions
  // Only hide if we've loaded and there are no active promotions
  if (!isLoading && promotions.length === 0) return null

  // Calculate animation duration - slower speed (60-90 seconds for smooth scrolling)
  const totalWidth = promotions.length > 0 
    ? promotions.reduce((sum, p) => sum + (p.text?.length || 0) * 10 + 80, 0)
    : 200 // Default width for loading state
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
        cursor: promotions.length > 0 ? 'pointer' : 'default',
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: promotions.length > 0 ? `scroll ${duration}s linear infinite` : 'none',
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
        {isLoading && promotions.length === 0 ? (
          // Loading skeleton - show immediately
          <Box
            sx={{
              flexShrink: 0,
              px: { xs: 4, sm: 6 },
              whiteSpace: 'nowrap',
              opacity: 0.7,
            }}
          >
            <Box
              sx={{
                width: '200px',
                height: '20px',
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.7 },
                  '50%': { opacity: 0.4 },
                },
              }}
            />
          </Box>
        ) : (
          // Duplicate promotions multiple times for seamless loop
          promotions.length > 0 && [...promotions, ...promotions, ...promotions].map((promotion, index) => (
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
          ))
        )}
      </Box>
    </Box>
  )
}
