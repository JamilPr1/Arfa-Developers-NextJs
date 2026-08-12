import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import {
  Assessment as AuditIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Search as SeoIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Free Audit / Consultation - Low-Risk Entry Point | Arfa Developers',
  description: 'Get a free website audit or consultation. Low-risk entry point for new clients. Identify issues and opportunities for improvement.',
  keywords: [
    'free website audit',
    'free SEO audit',
    'website performance audit',
    'broken website review',
    'project rescue assessment',
    'free web development consultation',
    'website security audit',
  ],
  openGraph: {
    title: 'Free Audit / Consultation - Low-Risk Entry Point | Arfa Developers',
    description: 'Get a free website audit or consultation. Low-risk entry point for new clients.',
    type: 'website',
    url: 'https://arfadevelopers.com/free-audit',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/free-audit',
  },
}

const auditAreas = [
  {
    icon: <SpeedIcon sx={{ fontSize: 50, color: '#0C1222' }} />,
    title: 'Performance Audit',
    description: 'Identify speed issues, optimization opportunities, and performance bottlenecks.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50, color: '#0C1222' }} />,
    title: 'Security Audit',
    description: 'Check for vulnerabilities, outdated software, and security best practices.',
  },
  {
    icon: <SeoIcon sx={{ fontSize: 50, color: '#0C1222' }} />,
    title: 'SEO Audit',
    description: 'Analyze SEO issues, ranking opportunities, and technical SEO problems.',
  },
  {
    icon: <AuditIcon sx={{ fontSize: 50, color: '#0C1222' }} />,
    title: 'Comprehensive Audit',
    description: 'Full website analysis covering performance, security, SEO, UX, and more.',
  },
]

const auditIncludes = [
  'Detailed analysis report',
  'Identified issues and problems',
  'Prioritized recommendations',
  'Actionable improvement steps',
  'Estimated impact and ROI',
  'No obligation to proceed',
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
      name: 'Free Audit',
      item: 'https://arfadevelopers.com/free-audit',
    },
  ],
}

export default function FreeAuditPage() {
  return (
    <>
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
              Free <Box component="span" sx={{ color: 'primary.main' }}>Audit</Box>
            </>
          }
          subtitle="Get a free website audit or consultation. Low-risk entry point to identify issues and opportunities for improvement."
          ctaText="Request Free Audit"
          ctaHref="/contact"
        />

        <Box sx={{ display: 'none' }}>
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
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <AuditIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                color: '#0C1222',
              }}
            >
              Free <span style={{ color: 'hsl(210, 98%, 48%)' }}>Audit</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#0C1222',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Get a free website audit or consultation. Low-risk entry point to identify issues and opportunities for improvement.
            </Typography>
            <Button
              component={Link}
              href="/contact"
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
              Request Free Audit
            </Button>
          </Container>
        </Box>
        </Box>

        {/* Audit Areas */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: '#0C1222',
            }}
          >
            What We Audit
          </Typography>
          <Grid container spacing={4}>
            {auditAreas.map((area, index) => (
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
                  <Box sx={{ mb: 2 }}>{area.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0C1222' }}>
                    {area.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {area.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* What's Included */}
        <Box sx={{ backgroundColor: '#F7F8FA', py: 8 }}>
          <Container maxWidth="md">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 6,
                textAlign: 'center',
                color: '#0C1222',
              }}
            >
              What&apos;s Included
            </Typography>
            <Card elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <List>
                {auditIncludes.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: { color: '#374151', fontWeight: 500 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
                Fill out our contact form or schedule a consultation. No obligation, just honest advice.
              </Typography>
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#0C1222',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#2563EB',
                  },
                }}
              >
                Request Free Audit
              </Button>
            </Box>
          </Container>
        </Box>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}
