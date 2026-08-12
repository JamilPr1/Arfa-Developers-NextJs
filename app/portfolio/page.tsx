import type { Metadata } from 'next'
import { Box, Container, Typography, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'
import PortfolioProjects from '@/components/PortfolioProjects'

export const metadata: Metadata = {
  title: 'Portfolio | AI Apps, Web Platforms & Project Rescue | Arfa Developers',
  description:
    'Portfolio of Arfa Developers work: Next.js commerce, clinic systems, AI voice agents, Meta CRM automation, school LMS, real estate CRM, and US SaaS project rescue.',
  keywords: [
    'web development portfolio USA',
    'AI voice agent portfolio',
    'Next.js project case studies',
    'project rescue case studies',
    'ecommerce development portfolio',
    'clinic management software',
    'WhatsApp automation projects',
    'Meta CRM development',
    'school management system',
    'real estate CRM development',
    'OpenAI integration projects',
  ],
  openGraph: {
    title: 'Portfolio | AI Apps, Web Platforms & Project Rescue | Arfa Developers',
    description: 'See production web apps, AI agents, automation, and rescue case studies from Arfa Developers.',
    type: 'website',
    url: 'https://www.arfadevelopers.com/portfolio',
  },
  alternates: {
    canonical: 'https://www.arfadevelopers.com/portfolio',
  },
}

// Structured data will be generated dynamically from API data
const portfolioStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Web Development Portfolio',
  description: 'Portfolio of successful web development projects',
  itemListElement: [],
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
      name: 'Portfolio',
      item: 'https://arfadevelopers.com/portfolio',
    },
  ],
}

export default function PortfolioPage() {
  return (
    <>
      <Script
        id="portfolio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData) }}
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
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
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
              background: 'radial-gradient(circle at 100% 0%, rgba(29,78,216,0.06) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                color: '#0C1222',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              Our{' '}
              <Box component="span" sx={{ color: '#1D4ED8' }}>
                Portfolio
              </Box>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#0C1222',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              Showcasing innovative solutions that drive business success. 
              From startups to enterprises, we deliver excellence.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="#contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#0C1222',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1E293B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Your Project
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Portfolio Projects */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <PortfolioProjects />
        </Container>

        {/* CTA Section */}
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
