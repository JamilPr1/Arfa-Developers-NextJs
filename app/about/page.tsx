import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@mui/material'

export const metadata: Metadata = {
  title: 'About Us - Project Rescue Specialists | Arfa Developers',
  description: 'We specialize in rescuing and rebuilding failed projects from freelancers and inexperienced developers. Over 200+ projects rescued with fast recovery and ongoing support.',
  keywords: [
    'rescue failed projects',
    'fix broken websites',
    'project recovery',
    'freelancer project rescue',
    'web development rescue',
    'project takeover',
    'code quality improvement',
    'project maintenance',
  ],
  openGraph: {
    title: 'About Us - Project Rescue Specialists | Arfa Developers',
    description: 'We rescue and rebuild failed projects from freelancers. Over 200+ projects rescued with fast recovery and ongoing support.',
    type: 'website',
    url: 'https://arfadevelopers.com/about',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/about',
  },
}

const rescueStories = [
  {
    icon: <SecurityIcon sx={{ fontSize: 60, color: '#1E3A8A' }} />,
    title: 'Rescued Projects',
    description: 'We\'ve successfully rescued and rebuilt over 200+ projects that were abandoned or poorly executed by freelancers and inexperienced developers.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 60, color: '#1E3A8A' }} />,
    title: 'Fast Recovery',
    description: 'Our experienced team can quickly assess, fix, and rebuild your project, often delivering working solutions in days instead of months.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 60, color: '#1E3A8A' }} />,
    title: 'Ongoing Support',
    description: 'Unlike freelancers who disappear after delivery, we provide long-term support, maintenance, and continuous improvements to your project.',
  },
]

const commonIssues = [
  'Incomplete or abandoned projects',
  'Poor code quality and security vulnerabilities',
  'No documentation or handover process',
  'Missing deadlines and communication breakdowns',
  'Scalability and performance issues',
  'Lack of ongoing support and maintenance',
]

const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Arfa Developers',
  description: 'We specialize in rescuing and rebuilding failed projects from freelancers and inexperienced developers.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Arfa Developers',
    description: 'Web development agency specializing in project rescue and recovery',
  },
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
      name: 'About',
      item: 'https://arfadevelopers.com/about',
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
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
              We{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Rescue Projects
              </Box>
              {' '}from Failed Freelancers
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
              Our experienced team specializes in taking over and fixing projects that were abandoned, 
              poorly executed, or left incomplete by freelancers and less experienced developers.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="#contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#FBBF24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Your Project Rescued
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Rescue Stories */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {rescueStories.map((story) => (
              <Grid item xs={12} md={4} key={story.title}>
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {story.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
                    {story.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {story.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Common Issues */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              color: 'white',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                color: 'white',
              }}
            >
              Common Issues We Fix
            </Typography>
            <Grid container spacing={2}>
              {commonIssues.map((issue, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: '#ffd700', mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
                      {issue}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
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
