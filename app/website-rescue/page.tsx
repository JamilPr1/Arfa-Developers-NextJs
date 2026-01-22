import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import {
  Build as FixIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Website Rescue / Fix-It - Take Over Broken Projects | Arfa Developers',
  description: 'Take over broken, abandoned, or underperforming projects. We rescue failed websites and applications with fast recovery and ongoing support.',
  keywords: [
    'website rescue',
    'fix broken website',
    'project rescue',
    'failed project recovery',
    'take over project',
    'fix abandoned project',
    'website fix it service',
  ],
  openGraph: {
    title: 'Website Rescue / Fix-It - Take Over Broken Projects | Arfa Developers',
    description: 'Take over broken, abandoned, or underperforming projects. Fast recovery and ongoing support.',
    type: 'website',
    url: 'https://arfadevelopers.com/website-rescue',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/website-rescue',
  },
}

const commonProblems = [
  {
    icon: <WarningIcon sx={{ fontSize: 50, color: '#EF4444' }} />,
    title: 'Abandoned Projects',
    description: 'Projects left incomplete by freelancers or agencies. We assess, fix, and complete them.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50, color: '#F59E0B' }} />,
    title: 'Performance Issues',
    description: 'Slow loading times, crashes, and poor user experience. We optimize and fix performance problems.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50, color: '#EF4444' }} />,
    title: 'Security Vulnerabilities',
    description: 'Outdated code, security holes, and compliance issues. We secure and update your application.',
  },
  {
    icon: <FixIcon sx={{ fontSize: 50, color: '#10B981' }} />,
    title: 'Broken Functionality',
    description: 'Features that don\'t work, integrations that fail, and bugs that frustrate users. We fix them all.',
  },
]

const rescueProcess = [
  'Quick assessment of current project state',
  'Identification of all issues and problems',
  'Detailed report with prioritized fixes',
  'Fast implementation of critical fixes',
  'Complete project recovery and optimization',
  'Ongoing support and maintenance',
]

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
      name: 'Website Rescue',
      item: 'https://arfadevelopers.com/website-rescue',
    },
  ],
}

export default function WebsiteRescuePage() {
  return (
    <>
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
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                color: 'white',
              }}
            >
              Website <span style={{ color: '#F59E0B' }}>Rescue</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Take over broken, abandoned, or underperforming projects. We rescue failed websites and applications with fast recovery and ongoing support.
            </Typography>
            <Button
              component={Link}
              href="/contact"
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
          </Container>
        </Box>

        {/* Common Problems */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: '#1E3A8A',
            }}
          >
            Common Problems We Fix
          </Typography>
          <Grid container spacing={4}>
            {commonProblems.map((problem, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{problem.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1E3A8A' }}>
                    {problem.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {problem.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Rescue Process */}
        <Box sx={{ backgroundColor: '#F9FAFB', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 6,
                textAlign: 'center',
                color: '#1E3A8A',
              }}
            >
              Our Rescue Process
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1E3A8A' }}>
                    How We Rescue Your Project
                  </Typography>
                  <List>
                    {rescueProcess.map((step, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={step}
                          primaryTypographyProps={{
                            variant: 'body1',
                            sx: { color: '#374151', fontWeight: 500 },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', backgroundColor: '#1E3A8A', color: 'white' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
                    Why Choose Us
                  </Typography>
                  <List>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="200+ Projects Rescued"
                        primaryTypographyProps={{
                          variant: 'body1',
                          sx: { color: 'white', fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Fast Recovery (Days, Not Months)"
                        primaryTypographyProps={{
                          variant: 'body1',
                          sx: { color: 'white', fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ongoing Support & Maintenance"
                        primaryTypographyProps={{
                          variant: 'body1',
                          sx: { color: 'white', fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Transparent Communication"
                        primaryTypographyProps={{
                          variant: 'body1',
                          sx: { color: 'white', fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}
