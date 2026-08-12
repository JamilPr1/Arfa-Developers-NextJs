'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, Fade, IconButton, Portal, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

type ExpandableImageProps = {
  src: string
  alt: string
  priority?: boolean
  aspectRatio?: string
}

/**
 * Hover preview: large centered card opens while the cursor is on the thumbnail,
 * and closes as soon as the cursor leaves. Overlay uses pointer-events: none so
 * it never steals hover from the image. Touch devices fall back to tap to open/close.
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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleMouseEnter = () => {
    if (!isTouch) setOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isTouch) setOpen(false)
  }

  const handleClick = () => {
    // Touch / keyboard: toggle. Desktop click is optional; hover already opens.
    if (isTouch) setOpen((v) => !v)
  }

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`Preview image: ${alt}`}
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
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
          borderColor: open ? 'primary.main' : 'divider',
          bgcolor: '#F8FAFC',
          aspectRatio,
          cursor: 'zoom-in',
          outline: 'none',
          zIndex: open ? 2 : 1,
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          transform: open && !isTouch ? 'scale(1.01)' : 'none',
          boxShadow: open ? theme.shadows[6] : 'none',
          '&:hover .expand-hint': { opacity: 1 },
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
              'linear-gradient(to top, rgba(15, 23, 42, 0.5) 0%, transparent 42%)',
            opacity: isTouch ? 1 : 0,
            transition: 'opacity 0.15s ease',
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
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {isTouch ? 'Tap to enlarge' : 'Hover to enlarge'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Portal>
        <Fade in={open} timeout={160} unmountOnExit>
          <Box
            aria-hidden={!open}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: theme.zIndex.modal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 1.5, sm: 3 },
              // Critical: do not steal mouse from the thumbnail on desktop hover
              pointerEvents: isTouch ? 'auto' : 'none',
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
            }}
            onClick={() => {
              if (isTouch) setOpen(false)
            }}
          >
            <Box
              sx={{
                pointerEvents: isTouch ? 'auto' : 'none',
                width: '100%',
                maxWidth: 'min(1180px, 96vw)',
                maxHeight: '90vh',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#fff',
                boxShadow: '0 28px 80px rgba(0,0,0,0.4)',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
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
                  bgcolor: '#fff',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {alt}
                </Typography>
                {isTouch && (
                  <IconButton
                    size="small"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    sx={{ pointerEvents: 'auto' }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
              <Box
                sx={{
                  p: { xs: 1, sm: 2 },
                  bgcolor: '#F1F5F9',
                  overflow: 'auto',
                  maxHeight: 'calc(90vh - 52px)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    minWidth: { md: 980 },
                    bgcolor: '#fff',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={1600}
                    height={900}
                    sizes="96vw"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    priority
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Portal>
    </>
  )
}
