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
  Speed as SpeedIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
  Build as BuildIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/website-maintenance-support-usa`

export const metadata: Metadata = {
  title: 'Website Maintenance & Support USA | Updates, Security, Performance | Arfa Developers',
  description:
    'Website maintenance and support for US businesses: updates, security monitoring, performance, bug fixes, and ongoing improvements for Next.js/React and modern web stacks. Fast response options.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Website Maintenance & Support USA | Updates, Security, Performance',
    description:
      'US-focused website maintenance: reliable updates, security, speed, monitoring, and bug fixes for modern websites and web apps.',
    type: 'website',
    url: pageUrl,
  },
}

const pillars = [
  {
    icon: <SupportIcon sx={{ fontSize: 46, color: '#2563EB' }} />,
    title: 'Responsive support',
    desc: 'Clear communication, ticket-based workflow, and fast turnaround on critical issues.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 46, color: '#EF4444' }} />,
    title: 'Security updates',
    desc: 'Dependency updates, vulnerability fixes, secrets hygiene, and secure auth best practices.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 46, color: '#10B981' }} />,
    title: 'Performance',
    desc: 'Core Web Vitals improvements, caching strategy, image optimization, and database tuning.',
  },
  {
    icon: <BuildIcon sx={{ fontSize: 46, color: '#0C1222' }} />,
    title: 'Stability',
    desc: 'Bug fixes, regression prevention, release discipline, and safer deployments.',
  },
]

const whatWeHandle = [
  'Monthly dependency updates + security patches',
  'Bug fixes and minor feature improvements',
  'Uptime monitoring + error tracking setup',
  'Performance audits and Core Web Vitals fixes',
  'Backup strategy + incident response support',
  'SEO technical hygiene (metadata, redirects, broken links)',
]

const planNotes = [
  'Best for: production websites and web apps that need ongoing reliability',
  'Works for: Next.js, React, Node.js, WordPress-to-Next migrations, and headless CMS setups',
  'Optional: weekly delivery cadence for continuous improvements',
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Website Maintenance & Support USA', item: pageUrl },
  ],
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Website Maintenance & Support',
  serviceType: 'Website Maintenance',
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

export default function WebsiteMaintenanceSupportUsaPage() {
  return (
    <>
      <Script
        id="maintenance-usa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="maintenance-usa-service"
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
                fontSize: { xs: '2.35rem', md: '3.6rem', lg: '4.1rem' },
                lineHeight: 1.15,
                color: '#0C1222',
              }}
            >
              Website <span style={{ color: 'primary.main' }}>Maintenance</span> & Support (USA)
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: 980,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.45rem' },
              }}
            >
              Keep your site fast, secure, and reliable. We handle updates, monitoring, bug fixes, and performance
              improvements for modern websites and web apps — aligned with US business hours.
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
                  px: 5,
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#1E293B', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Get a Maintenance Plan
              </Button>
              <Button
                component={Link}
                href="/project-rescue"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: '#0C1222',
                  px: 5,
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                Something broken? Rescue it
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {pillars.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.title}>
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
                  <Box sx={{ mb: 2 }}>{p.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: '#0C1222' }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {p.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textAlign: 'center', color: '#0C1222' }}>
              What we maintain
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3, maxWidth: 980, mx: 'auto' }}
            >
              We keep production systems healthy — not just “updates”, but the operational discipline that prevents downtime.
            </Typography>

            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12} md={7}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#111827' }}>
                    Included (typical)
                  </Typography>
                  <List>
                    {whatWeHandle.map((d) => (
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
                <Card
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8ECF1',
                    boxShadow: 'none',
                    color: '#0C1222',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#0C1222' }}>
                    Good fit if…
                  </Typography>
                  <Divider sx={{ borderColor: '#E8ECF1', mb: 2 }} />
                  <List>
                    {planNotes.map((d) => (
                      <ListItem key={d} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                        </ListItemIcon>
                        <ListItemText primary={d} primaryTypographyProps={{ sx: { fontWeight: 700 } }} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}

