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
import PageHero from '@/components/PageHero'
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
    icon: <SecurityIcon sx={{ fontSize: 60, color: '#0C1222' }} />,
    title: 'Rescued Projects',
    description: 'We\'ve successfully rescued and rebuilt over 200+ projects that were abandoned or poorly executed by freelancers and inexperienced developers.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 60, color: '#0C1222' }} />,
    title: 'Fast Recovery',
    description: 'Our experienced team can quickly assess, fix, and rebuild your project, often delivering working solutions in days instead of months.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 60, color: '#0C1222' }} />,
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
        <PageHero
          title={
            <>
              We{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Rescue Projects
              </Box>{' '}
              from Failed Freelancers
            </>
          }
          subtitle="Our experienced team specializes in taking over and fixing projects that were abandoned, poorly executed, or left incomplete by freelancers and less experienced developers."
          ctaText="Get Your Project Rescued"
          ctaHref="/contact"
        />

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
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
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
              background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              color: '#0C1222',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                color: '#0C1222',
              }}
            >
              Common Issues We Fix
            </Typography>
            <Grid container spacing={2}>
              {commonIssues.map((issue, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: '#1D4ED8', mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: '#0C1222', fontWeight: 500 }}>
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
