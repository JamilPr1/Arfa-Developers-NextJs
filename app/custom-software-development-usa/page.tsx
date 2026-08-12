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
    icon: <EngineeringIcon sx={{ fontSize: 46, color: '#0C1222' }} />,
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
    icon: <AnalyticsIcon sx={{ fontSize: 46, color: 'primary.main' }} />,
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
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 10 },
            textAlign: 'center',
            borderBottom: '1px solid #E8ECF1',
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.25rem', md: '3.25rem' },
                lineHeight: 1.15,
                color: '#0C1222',
                letterSpacing: '-0.03em',
              }}
            >
              Custom Software Development <span style={{ color: 'primary.main' }}>USA</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#64748B',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.05rem', md: '1.2rem' },
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
                  backgroundColor: '#0C1222',
                  color: '#FFFFFF',
                  px: 4.5,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#1E293B', transform: 'translateY(-1px)', boxShadow: 'none' },
                  transition: 'all 0.2s ease',
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
                  borderColor: '#E8ECF1',
                  color: '#0C1222',
                  px: 4.5,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#0C1222', backgroundColor: 'rgba(12,18,34,0.03)' },
                }}
              >
                View portfolio
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, textAlign: 'center', color: '#0C1222' }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0C1222' }}>
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

        <Box sx={{ backgroundColor: '#F7F8FA', py: 8 }}>
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
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', backgroundColor: '#FFFFFF', color: '#0C1222' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#0C1222' }}>
                    Already have a broken build?
                  </Typography>
                  <Typography sx={{ color: '#64748B', lineHeight: 1.8 }}>
                    If a freelancer/agency left you with unfinished code, we can take over and rescue it.
                    We’ll stabilize first, then ship improvements safely.
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: '#E8ECF1' }} />
                  <Button
                    component={Link}
                    href="/project-rescue"
                    variant="contained"
                    sx={{
                      backgroundColor: '#0C1222',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      '&:hover': { backgroundColor: '#1E293B' },
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

