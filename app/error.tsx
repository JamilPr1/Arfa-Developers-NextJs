'use client'

import { useEffect } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 700, mb: 2, color: '#1E3A8A' }}>
          Something went wrong!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          {error.message || 'An unexpected error occurred'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={reset} variant="contained" size="large">
            Try again
          </Button>
          <Button component={Link} href="/" variant="outlined" size="large">
            Go Home
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
