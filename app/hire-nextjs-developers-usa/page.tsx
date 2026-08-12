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
  Chip,
  Divider,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Engineering as EngineeringIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/hire-nextjs-developers-usa`

export const metadata: Metadata = {
  title: 'Hire Next.js Developers USA | Senior React/Next.js Team | Arfa Developers',
  description:
    'Hire Next.js developers for US time zones. Senior React/Next.js engineers for new builds, product teams, and project rescue. Clean code, fast delivery, and ongoing support.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Hire Next.js Developers USA | Senior React/Next.js Team',
    description:
      'US-focused Next.js engineering support for startups and teams: new builds, performance, SEO, integrations, and rescue work.',
    type: 'website',
    url: pageUrl,
  },
}

const highlights = [
  {
    icon: <EngineeringIcon sx={{ fontSize: 46, color: '#0C1222' }} />,
    title: 'Senior Next.js delivery',
    desc: 'Production-grade React/Next.js apps with clean architecture, review discipline, and predictable shipping.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 46, color: '#10B981' }} />,
    title: 'Performance + Core Web Vitals',
    desc: 'Fast pages, stable layouts, optimized images, and measurable Lighthouse improvements.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 46, color: '#EF4444' }} />,
    title: 'Secure by default',
    desc: 'Auth best practices, dependency hygiene, secret management, and hardened deployments.',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 46, color: '#2563EB' }} />,
    title: 'Vercel / AWS friendly',
    desc: 'CI/CD, preview deployments, observability, logs, and incident-ready release pipelines.',
  },
]

const engagementOptions = [
  'Dedicated developer(s) for your product team',
  'Sprint-based delivery for specific features',
  'Project rescue + stabilization (takeover)',
  'Ongoing maintenance + improvements',
]

const outcomes = [
  'Faster shipping cadence with clean pull requests',
  'Higher conversion from improved UX + speed',
  'SEO-ready pages (metadata, schema, sitemap)',
  'Reliable deployments with rollback strategy',
]

const stacks = ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Stripe', 'Vercel']

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Hire Next.js Developers USA', item: pageUrl },
  ],
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Next.js Development',
  serviceType: 'Hire Next.js Developers',
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

export default function HireNextJsDevelopersUsaPage() {
  return (
    <>
      <Script
        id="hire-nextjs-usa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="hire-nextjs-usa-service"
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
              Hire <span style={{ color: 'primary.main' }}>Next.js Developers</span> in the USA
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
              Senior React/Next.js engineers for US time zones — new builds, feature delivery, performance/SEO,
              and project rescue. Clear weekly progress, clean code, reliable deployments.
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
                Talk to a Next.js Expert
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
                Need a Project Rescue?
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {highlights.map((h) => (
              <Grid item xs={12} sm={6} md={3} key={h.title}>
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
                  <Box sx={{ mb: 2 }}>{h.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: '#0C1222' }}>
                    {h.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {h.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textAlign: 'center', color: '#0C1222' }}>
              Engagement options
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3, maxWidth: 980, mx: 'auto' }}
            >
              Choose the fastest route to value — we can plug into your product team or run a focused delivery sprint.
            </Typography>
            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#111827' }}>
                    Common engagements
                  </Typography>
                  <List>
                    {engagementOptions.map((d) => (
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
              <Grid item xs={12} md={6}>
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
                    Outcomes you should expect
                  </Typography>
                  <Divider sx={{ borderColor: '#E8ECF1', mb: 2 }} />
                  <List>
                    {outcomes.map((d) => (
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

          <Box sx={{ mt: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textAlign: 'center', color: '#0C1222' }}>
              Tech stack we ship with
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3, maxWidth: 980, mx: 'auto' }}
            >
              Modern Next.js builds with the right defaults: TypeScript, robust APIs, reliable auth, and observability.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {stacks.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  sx={{
                    bgcolor: '#F3F4F6',
                    color: '#0C1222',
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#E5E7EB' },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}

