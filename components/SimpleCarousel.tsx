'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

interface SimpleCarouselProps {
  items: any[]
  renderItem: (item: any, index: number, isActive: boolean) => React.ReactNode
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
}

export default function SimpleCarousel({
  items,
  renderItem,
  autoPlay = true,
  autoPlayInterval = 2500,
  showDots = true,
  showArrows = true,
}: SimpleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (autoPlay && !isHovered && items.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, isHovered, items.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + items.length) % items.length
  }

  if (items.length === 0) return null

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        py: 4,
        px: { xs: 2, md: 4 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows - Positioned in white space, not on slides */}
      {showArrows && items.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: 'absolute',
              left: { xs: 10, md: 'calc(50% - 450px)' }, // Much further left in white space
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              backgroundColor: 'rgba(30, 58, 138, 0.9)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 1)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={goToNext}
            sx={{
              position: 'absolute',
              right: { xs: 10, md: 'calc(50% - 450px)' }, // Much further right in white space
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              backgroundColor: 'rgba(30, 58, 138, 0.9)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 1)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Carousel Container - Shows 3 slides: left, center, right */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        {/* Left Slide - More visible and positioned further out */}
        {items[getSlideIndex(-1)] && (
          <motion.div
            key={`left-${getSlideIndex(-1)}`}
            initial={{ opacity: 0, x: 100, scale: 0.75 }}
            animate={{ 
              opacity: 0.85,
              x: -240,
              scale: 0.75,
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              position: 'absolute',
              width: '320px',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ width: '100%' }}>
              {renderItem(items[getSlideIndex(-1)], getSlideIndex(-1), false)}
            </Box>
          </motion.div>
        )}

        {/* Center Slide (Active) - Scrolls from right to left */}
        {items[currentIndex] && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`center-${currentIndex}`}
              initial={{ opacity: 0, x: 400, scale: 0.9 }} // Start from right (off-screen)
              animate={{ 
                opacity: 1, 
                x: 0, // Move to center
                scale: 1 
              }}
              exit={{ opacity: 0, x: -400, scale: 0.9 }} // Exit to left
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                position: 'relative',
                width: '400px',
                zIndex: 5,
              }}
            >
              <Box sx={{ width: '100%' }}>
                {renderItem(items[currentIndex], currentIndex, true)}
              </Box>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Right Slide - More visible and positioned further out */}
        {items[getSlideIndex(1)] && (
          <motion.div
            key={`right-${getSlideIndex(1)}`}
            initial={{ opacity: 0, x: 400, scale: 0.75 }}
            animate={{ 
              opacity: 0.85,
              x: 240,
              scale: 0.75,
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              position: 'absolute',
              width: '320px',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ width: '100%' }}>
              {renderItem(items[getSlideIndex(1)], getSlideIndex(1), false)}
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Dots Navigation */}
      {showDots && items.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 10,
          }}
        >
          {items.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? '#1E3A8A' : 'rgba(30, 58, 138, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: currentIndex === index ? '#1E3A8A' : 'rgba(30, 58, 138, 0.6)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
