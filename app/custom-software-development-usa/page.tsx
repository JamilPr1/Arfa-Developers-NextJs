import type { Metadata } from 'next'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Analytics as AnalyticsIcon,
  Engineering as EngineeringIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/custom-software-development-usa`

export const metadata: Metadata = {
  title: 'Custom Software Development USA | SaaS, Portals & Enterprise Apps | Arfa Developers',
  description:
    'Custom software development for US companies. We build SaaS platforms, internal tools, portals, integrations, and scalable backends—plus ongoing maintenance and support.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Custom Software Development USA | SaaS, Portals & Enterprise Apps',
    description:
      'We build custom software for US companies: SaaS, portals, integrations, and scalable backends—delivered with clean architecture and predictable milestones.',
    type: 'website',
    url: pageUrl,
  },
}

const useCases = [
  {
    icon: <EngineeringIcon sx={{ fontSize: 46, color: '#1E3A8A' }} />,
    title: 'SaaS & subscription platforms',
    desc: 'Multi-tenant apps, billing, onboarding, roles, and analytics.',
  },
  {
    icon: <ApiIcon sx={{ fontSize: 46, color: '#2563EB' }} />,
    title: 'Integrations & automation',
    desc: 'Stripe, HubSpot, Slack, CRMs, and custom APIs.',
  },
  {
    icon: <StorageIcon sx={{ fontSize: 46, color: '#10B981' }} />,
    title: 'Data & backends',
    desc: 'Postgres, Supabase, Node.js services, and scalable architecture.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 46, color: '#F59E0B' }} />,
    title: 'Dashboards & internal tools',
    desc: 'Operations tooling, reporting, workflows, and admin panels.',
  },
]

const delivery = [
  'Discovery workshop + requirements',
  'Architecture + roadmap (milestones)',
  'UI/UX (if needed) + implementation',
  'QA + performance + security checks',
  'Deployment + monitoring + handover',
  'Ongoing support and feature delivery',
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Custom Software Development USA', item: pageUrl },
  ],
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom Software Development',
  serviceType: 'Custom Software Development',
  areaServed: [{ '@type': 'Country', name: 'United States' }],
  provider: { '@type': 'Organization', name: 'Arfa Developers', url: baseUrl },
  url: pageUrl,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free consultation',
  },
}

export default function CustomSoftwareDevelopmentUsaPage() {
  return (
    <>
      <Script
        id="custom-software-usa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="custom-software-usa-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />

      <Header />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0B2A6F 100%)',
            color: 'white',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.4rem', md: '3.6rem', lg: '4.1rem' },
                lineHeight: 1.15,
                color: 'white',
              }}
            >
              Custom Software Development <span style={{ color: '#F59E0B' }}>USA</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.95)',
                maxWidth: 980,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.45rem' },
              }}
            >
              SaaS platforms, portals, internal tools, and scalable backends — delivered with clean architecture,
              predictable milestones, and long-term maintainability.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
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
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#FBBF24', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Request a Quote
              </Button>
              <Button
                component={Link}
                href="/portfolio"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                View portfolio
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, textAlign: 'center', color: '#1E3A8A' }}>
            Built for serious delivery
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: 950, mx: 'auto' }}>
            If you need dependable engineering (not just code), we’re a strong fit. We design for scale, maintainability,
            and business outcomes — and we communicate clearly throughout.
          </Typography>

          <Grid container spacing={4}>
            {useCases.map((u) => (
              <Grid item xs={12} sm={6} md={3} key={u.title}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.25s ease',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{u.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1E3A8A' }}>
                    {u.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {u.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ backgroundColor: '#F9FAFB', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#111827' }}>
                    Delivery process
                  </Typography>
                  <List>
                    {delivery.map((d) => (
                      <ListItem key={d} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                        </ListItemIcon>
                        <ListItemText primary={d} primaryTypographyProps={{ sx: { fontWeight: 700, color: '#374151' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', backgroundColor: '#0B2A6F', color: 'white' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: 'white' }}>
                    Already have a broken build?
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                    If a freelancer/agency left you with unfinished code, we can take over and rescue it.
                    We’ll stabilize first, then ship improvements safely.
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Button
                    component={Link}
                    href="/project-rescue"
                    variant="contained"
                    sx={{
                      backgroundColor: '#F59E0B',
                      color: 'white',
                      fontWeight: 800,
                      '&:hover': { backgroundColor: '#FBBF24' },
                    }}
                  >
                    Project rescue
                  </Button>
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

