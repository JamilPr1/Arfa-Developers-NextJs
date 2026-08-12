'use client'

import { Box } from '@mui/material'

/** Fixed height for product listing cards — keeps grid uniform */
export const PRODUCT_CARD_IMAGE_HEIGHT = 260

interface ProductHeroMediaProps {
  src: string
  alt: string
}

/** Responsive hero image for product detail pages — fills frame edge-to-edge */
export function ProductHeroMedia({ src, alt }: ProductHeroMediaProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: 560, lg: 640 },
        mx: { xs: 'auto', md: 0 },
        ml: { md: 'auto' },
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
        bgcolor: 'transparent',
        aspectRatio: '16 / 9',
        lineHeight: 0,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </Box>
  )
}

interface ProductCardMediaProps {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
}

/** Uniform image slot for product listing cards */
export function ProductCardMedia({ src, alt, fit = 'cover' }: ProductCardMediaProps) {
  const isContain = fit === 'contain'

  return (
    <Box
      sx={{
        width: '100%',
        height: PRODUCT_CARD_IMAGE_HEIGHT,
        flexShrink: 0,
        bgcolor: isContain ? '#F3F4F6' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: isContain ? 'top center' : 'center',
          display: 'block',
        }}
      />
    </Box>
  )
}

interface ProductImageProps {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  height?: number | string | Record<string, number | string>
}

export function ProductImage({ src, alt, fit = 'cover', height = 220 }: ProductImageProps) {
  const isContain = fit === 'contain'

  return (
    <Box
      sx={{
        width: '100%',
        height,
        bgcolor: isContain ? '#F3F4F6' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: isContain ? '1px solid #e5e7eb' : 'none',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </Box>
  )
}

interface ProductGalleryProps {
  items: { src: string; caption: string }[]
  title?: string
}

export function ProductGallery({ items, title = 'Product Screenshots' }: ProductGalleryProps) {
  if (!items.length) return null

  return (
    <Box sx={{ mt: 6 }}>
      <TypographySection title={title} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 3,
          maxWidth: 960,
          mx: 'auto',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.src}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              bgcolor: '#fff',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              lineHeight: 0,
            }}
          >
            <Box
              component="img"
              src={item.src}
              alt={item.caption}
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#F9FAFB', borderTop: '1px solid #e5e7eb', lineHeight: 1.5 }}>
              <Box component="p" sx={{ m: 0, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
                {item.caption}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function TypographySection({ title }: { title: string }) {
  return (
    <Box
      component="h2"
      sx={{
        fontWeight: 700,
        color: '#1E3A8A',
        fontSize: { xs: '1.5rem', md: '2rem' },
        mb: 3,
        textAlign: 'center',
      }}
    >
      {title}
    </Box>
  )
}
