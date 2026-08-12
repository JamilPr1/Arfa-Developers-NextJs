'use client'

import Link from 'next/link'
import { Box } from '@mui/material'

type ArfaLogoProps = {
  height?: number
  href?: string
  iconOnly?: boolean
}

/** Official HD Arfa Developers logo (user-provided). */
export default function ArfaLogo({
  height = 36,
  href = '/',
  iconOnly = false,
}: ArfaLogoProps) {
  const src = iconOnly
    ? '/images/logo-arfa-developers-icon.png'
    : '/images/logo-arfa-developers.png'

  const img = (
    <Box
      component="img"
      src={src}
      alt="Arfa Developers"
      sx={{
        height,
        width: 'auto',
        maxWidth: iconOnly ? height * 1.3 : { xs: 200, sm: 240 },
        display: 'block',
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  )

  if (!href) return img

  return (
    <Link
      href={href}
      aria-label="Arfa Developers Home"
      style={{ textDecoration: 'none', lineHeight: 0, display: 'inline-flex', alignItems: 'center' }}
    >
      {img}
    </Link>
  )
}
