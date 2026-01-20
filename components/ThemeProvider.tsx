'use client'

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A', // Deep Blue
      light: '#2563EB', // Bright Blue
      dark: '#1E3A8A',
    },
    secondary: {
      main: '#2563EB', // Bright Blue
      light: '#3B82F6',
      dark: '#1E40AF',
    },
    error: {
      main: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // Amber/Orange accent
    },
    info: {
      main: '#2563EB',
    },
    success: {
      main: '#10B981',
    },
    background: {
      default: '#F9FAFB', // Light Gray
      paper: '#FFFFFF', // White for cards
    },
    text: {
      primary: '#111827', // Dark Gray / almost Black
      secondary: '#6B7280', // Medium Gray
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", "Helvetica", sans-serif', // Body font
    h1: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif', // Heading font
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      color: '#111827',
    },
    h2: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      color: '#111827',
    },
    h3: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
      color: '#111827',
    },
    h4: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      color: '#111827',
    },
    h5: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#111827',
    },
    h6: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#111827',
    },
    body1: {
      fontFamily: '"Roboto", "Arial", "Helvetica", sans-serif',
      fontWeight: 400,
      color: '#111827',
    },
    body2: {
      fontFamily: '"Roboto", "Arial", "Helvetica", sans-serif',
      fontWeight: 400,
      color: '#6B7280',
    },
    button: {
      fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          fontFamily: '"Poppins", "Arial", "Helvetica", sans-serif',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
          },
        },
        contained: {
          backgroundColor: '#1E3A8A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#2563EB',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
