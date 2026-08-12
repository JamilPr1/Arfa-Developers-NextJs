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
import PageHero from '@/components/PageHero'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { siteConfig } from '@/lib/siteConfig'
import { SITE_URL } from '@/lib/seoKeywords'

const contactUrl = `${SITE_URL}/contact`

// Dynamically import LocationMap to avoid SSR issues
const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Contact Us - Get Free Consultation | Arfa Developers',
  description: 'Contact Arfa Developers for your web development needs. Get a free consultation and let us help rescue your failed project or build your next application.',
  keywords: [
    'contact web developers USA',
    'free consultation web development',
    'web development quote',
    'project rescue consultation',
    'hire web developers',
    'get website fixed',
  ],
  openGraph: {
    title: 'Contact Us - Get Free Consultation | Arfa Developers',
    description: 'Contact us for a free consultation on your web development project.',
    type: 'website',
    url: contactUrl,
  },
  alternates: {
    canonical: contactUrl,
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
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Contact',
      item: contactUrl,
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
        <PageHero
          title={
            <>
              Get in{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Touch
              </Box>
            </>
          }
          subtitle="Ready to start your project or rescue a failed one? Contact us for a free consultation today."
        />

        {/* Contact Information & Form */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
          <Grid container spacing={{ xs: 4, sm: 6 }}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 4, 
                  color: '#0C1222',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <EmailIcon sx={{ color: '#0C1222', mr: { xs: 1.5, sm: 2 }, mt: 0.5, fontSize: { xs: 24, sm: 28 }, flexShrink: 0 }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#0C1222',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                      }}
                    >
                      Email
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, wordBreak: 'break-word' }}
                    >
                      {siteConfig.contactEmail}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <PhoneIcon sx={{ color: '#0C1222', mr: { xs: 1.5, sm: 2 }, mt: 0.5, fontSize: { xs: 24, sm: 28 }, flexShrink: 0 }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#0C1222',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                      }}
                    >
                      Phone
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      {siteConfig.phoneDisplay}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start' }}>
                  <LocationIcon sx={{ color: '#0C1222', mr: { xs: 1.5, sm: 2 }, mt: 0.5, fontSize: { xs: 24, sm: 28 }, flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: '#0C1222',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                      }}
                    >
                      Location
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {siteConfig.locationsDisplay} ({siteConfig.servingDisplay})
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
