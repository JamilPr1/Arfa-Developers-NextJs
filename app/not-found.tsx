import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
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
        <Typography variant="h1" sx={{ fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Page Not Found
        </Typography>
        <Button component={Link} href="/" variant="contained" size="large">
          Go Home
        </Button>
      </Box>
    </Container>
  )
}
