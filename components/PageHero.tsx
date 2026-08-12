'use client'

import { Box, Container, Typography, Button, Stack } from '@mui/material'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface PageHeroProps {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  ctaText?: string
  ctaHref?: string
  actions?: ReactNode
  media?: ReactNode
  align?: 'center' | 'left'
  compact?: boolean
  children?: ReactNode
}

/** Inner-page hero matching official MUI Marketing Hero pattern. */
export default function PageHero({
  title,
  subtitle,
  eyebrow,
  ctaText,
  ctaHref,
  actions,
  media,
  align = 'center',
  compact = false,
  children,
}: PageHeroProps) {
  const isCenter = align === 'center' && !media

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pt: compact ? { xs: 14, md: 16 } : { xs: 16, md: 18 },
        pb: compact ? { xs: 5, md: 7 } : { xs: 8, md: 10 },
        textAlign: isCenter ? 'center' : 'left',
      }}
    >
      <Container maxWidth="lg">
        {media ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: { xs: 4, md: 5 },
              alignItems: 'center',
            }}
          >
            <Box>
              {eyebrow}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  letterSpacing: -0.5,
                  lineHeight: 1.15,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    mb: ctaText || actions ? 3 : 0,
                    maxWidth: 640,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              {(ctaText && ctaHref) || actions ? (
                <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                  {ctaText && ctaHref && (
                    <Button component={Link} href={ctaHref} variant="contained" color="primary" size="large">
                      {ctaText}
                    </Button>
                  )}
                  {actions}
                </Stack>
              ) : null}
              {children}
            </Box>
            <Box>{media}</Box>
          </Box>
        ) : (
          <Stack
            spacing={2}
            useFlexGap
            sx={{
              alignItems: isCenter ? 'center' : 'flex-start',
              width: { xs: '100%', md: isCenter ? '80%' : '100%' },
              mx: isCenter ? 'auto' : 0,
            }}
          >
            {eyebrow}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 600,
                fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
                letterSpacing: -0.5,
                lineHeight: 1.15,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  maxWidth: 720,
                  lineHeight: 1.65,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  textAlign: isCenter ? 'center' : 'left',
                }}
              >
                {subtitle}
              </Typography>
            )}
            {(ctaText && ctaHref) || actions ? (
              <Stack
                direction="row"
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
                justifyContent={isCenter ? 'center' : 'flex-start'}
                sx={{ pt: 1 }}
              >
                {ctaText && ctaHref && (
                  <Button component={Link} href={ctaHref} variant="contained" color="primary" size="large">
                    {ctaText}
                  </Button>
                )}
                {actions}
              </Stack>
            ) : null}
            {children}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export const BRAND_GRADIENT =
  'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)'
export const BRAND_NAVY = 'hsl(220, 30%, 6%)'
export const BRAND_BLUE = 'hsl(210, 98%, 48%)'
export const BRAND_AMBER = 'hsl(220, 35%, 3%)'
