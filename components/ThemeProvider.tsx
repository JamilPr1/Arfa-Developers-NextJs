'use client'

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ReactNode, useMemo } from 'react'
import { createMarketingTheme } from '@/lib/theme/createMarketingTheme'

/**
 * App-wide theme: official MUI Marketing Page / Dashboard shared theme.
 * Applies to marketing site and admin.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createMarketingTheme(), [])

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
