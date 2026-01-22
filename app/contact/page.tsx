import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// Dynamically import LocationMap to avoid SSR issues
const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Contact Us - Get Free Consultation | Arfa Developers',
  description: 'Contact Arfa Developers for your web development needs. Get a free consultation and let us help rescue your failed project or build your next application.',
  keywords: [
    'contact web developers',
    'free consultation',
    'web development quote',
    'project rescue consultation',
    'hire web developers',
  ],
  openGraph: {
    title: 'Contact Us - Get Free Consultation | Arfa Developers',
    description: 'Contact us for a free consultation on your web development project.',
    type: 'website',
    url: 'https://arfadevelopers.com/contact',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/contact',
  },
}

const contactStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Arfa Developers',
  description: 'Get in touch with us for web development services',
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://arfadevelopers.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Contact',
      item: 'https://arfadevelopers.com/contact',
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            color: 'white',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              Get in{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Touch
              </Box>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              Ready to start your project or rescue a failed one? 
              Contact us for a free consultation today.
            </Typography>
          </Container>
        </Box>

        {/* Contact Information & Form */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1E3A8A' }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <EmailIcon sx={{ color: '#1E3A8A', mr: 2, mt: 0.5, fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1E3A8A' }}>
                      Email
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      info@arfadevelopers.com
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <PhoneIcon sx={{ color: '#1E3A8A', mr: 2, mt: 0.5, fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1E3A8A' }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <LocationIcon sx={{ color: '#1E3A8A', mr: 2, mt: 0.5, fontSize: 28 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1E3A8A' }}>
                      Location
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Serving USA, UK, Qatar, Saudi Arabia, and Pakistan
                    </Typography>
                    <LocationMap />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form Section - Using CTA Component */}
            <Grid item xs={12} md={8}>
              <Box id="contact">
                <CTA />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
