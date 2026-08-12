'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

type ExpandableImageProps = {
  src: string
  alt: string
  priority?: boolean
  /** Aspect ratio for the inline thumbnail (default 16/9). */
  aspectRatio?: string
}

/**
 * Thumbnail with hover-to-expand lightbox (desktop) and click/tap (all devices)
 * so detailed UI screenshots stay readable.
 */
export default function ExpandableImage({
  src,
  alt,
  priority = false,
  aspectRatio = '16 / 9',
}: ExpandableImageProps) {
  const theme = useTheme()
  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)')
  const [open, setOpen] = useState(false)
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const openLightbox = useCallback(() => setOpen(true), [])
  const closeLightbox = useCallback(() => setOpen(false), [])

  useEffect(() => {
    return () => {
      if (hoverTimer) clearTimeout(hoverTimer)
    }
  }, [hoverTimer])

  const handleMouseEnter = () => {
    if (isTouch) return
    if (hoverTimer) clearTimeout(hoverTimer)
    // Short delay avoids accidental flicker while scrolling past
    const t = setTimeout(() => setOpen(true), 220)
    setHoverTimer(t)
  }

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
  }

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`Enlarge image: ${alt}`}
        onClick={openLightbox}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openLightbox()
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: '#F8FAFC',
          aspectRatio,
          cursor: 'zoom-in',
          outline: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
            '& .expand-hint': { opacity: 1 },
          },
          '&:focus-visible': {
            outline: `3px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 560px"
          style={{ objectFit: 'contain' }}
        />
        <Box
          className="expand-hint"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 1.5,
            background:
              'linear-gradient(to top, rgba(15, 23, 42, 0.55) 0%, transparent 45%)',
            opacity: { xs: 1, md: 0 },
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.95)',
              color: 'text.primary',
              boxShadow: 1,
            }}
          >
            <ZoomInIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              {isTouch ? 'Tap to enlarge' : 'Hover or click to enlarge'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={closeLightbox}
        maxWidth={false}
        scroll="body"
        aria-label={alt}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(15, 23, 42, 0.72)' },
        }}
        PaperProps={{
          sx: {
            m: { xs: 1.5, sm: 2, md: 3 },
            maxWidth: 'min(1200px, 96vw)',
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#fff',
            boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 2,
            py: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              pr: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {alt}
          </Typography>
          <IconButton
            onClick={closeLightbox}
            aria-label="Close enlarged image"
            size="small"
            sx={{ flexShrink: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            p: { xs: 1, sm: 2 },
            bgcolor: '#F1F5F9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxHeight: 'min(82vh, 900px)',
              minHeight: { xs: 220, sm: 360 },
              borderRadius: 2,
              overflow: 'auto',
              bgcolor: '#fff',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Use a wide intrinsic layout so workflow UIs stay legible */}
            <Box sx={{ position: 'relative', width: '100%', minWidth: { md: 960 } }}>
              <Image
                src={src}
                alt={alt}
                width={1600}
                height={900}
                sizes="96vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                priority
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
