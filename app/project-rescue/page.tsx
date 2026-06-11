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
  Warning as WarningIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/project-rescue`

export const metadata: Metadata = {
  title: 'Project Rescue USA | Take Over Failed Builds & Fix Broken Websites | Arfa Developers',
  description:
    'Project rescue for US businesses. We take over failed freelancer/agency builds, fix bugs, performance and security issues, and ship production-ready software fast. Free consultation.',
  keywords: [
    'project rescue USA',
    'rescue failed projects',
    'failed freelancer project',
    'take over abandoned project',
    'fix broken website',
    'SaaS project rescue',
    'half-built app recovery',
    'agency project takeover',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Project Rescue USA | Take Over Failed Builds & Fix Broken Websites',
    description:
      'We take over failed builds and rescue broken websites/apps for US businesses. Fast recovery, clean code, ongoing support.',
    type: 'website',
    url: pageUrl,
  },
}

const painPoints = [
  {
    icon: <WarningIcon sx={{ fontSize: 50, color: '#EF4444' }} />,
    title: 'Freelancer disappeared',
    desc: 'You have partial code, no handover, and a deadline still looming.',
  },
  {
    icon: <BuildIcon sx={{ fontSize: 50, color: '#F59E0B' }} />,
    title: 'Broken features',
    desc: 'Checkout fails, auth breaks, integrations crash, or the app is unstable.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50, color: '#10B981' }} />,
    title: 'Slow and unreliable',
    desc: 'Poor performance, timeouts, high bounce rates, and failed deployments.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50, color: '#EF4444' }} />,
    title: 'Security risks',
    desc: 'Outdated dependencies, exposed keys, and missing best practices.',
  },
]

const processSteps = [
  '24–48h codebase triage (repo + hosting + logs)',
  'Prioritized rescue plan (critical fixes first)',
  'Stabilize: bugs, build pipeline, deployments',
  'Optimize: performance + security hardening',
  'Ship: production-ready release + monitoring',
  'Ongoing support (SLA options available)',
]

const faqs = [
  {
    q: 'Can you take over an unfinished project from a freelancer or agency?',
    a: 'Yes. We do a quick triage first, then take ownership of the codebase and delivery plan.',
  },
  {
    q: 'How fast can you rescue a project?',
    a: 'Most rescues start with critical fixes in days. Full stabilization depends on scope, but we prioritize the fastest path to production.',
  },
  {
    q: 'Do you work with US time zones?',
    a: 'Yes. We schedule overlapping hours for US teams and provide clear weekly updates.',
  },
  {
    q: 'Do you sign an NDA?',
    a: 'Yes. We can sign an NDA before reviewing sensitive details.',
  },
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Project Rescue', item: pageUrl },
  ],
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Project Rescue',
  serviceType: 'Project Rescue / Takeover',
  areaServed: [{ '@type': 'Country', name: 'United States' }],
  provider: { '@type': 'Organization', name: 'Arfa Developers', url: baseUrl },
  url: pageUrl,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free consultation and rescue assessment',
  },
}

export default function ProjectRescuePage() {
  return (
    <>
      <Script
        id="project-rescue-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="project-rescue-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="project-rescue-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />

      <Header />
      <Box component="main">
        {/* Hero */}
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
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.4rem', md: '3.6rem', lg: '4.1rem' },
                lineHeight: 1.15,
                color: 'white',
              }}
            >
              Project <span style={{ color: '#F59E0B' }}>Rescue</span> for US Businesses
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.95)',
                maxWidth: 920,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.45rem' },
              }}
            >
              We take over failed freelancer/agency builds, fix what’s broken, and ship production-ready
              software fast — with clear weekly progress and ongoing support.
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
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#FBBF24', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Get a Rescue Assessment
              </Button>
              <Button
                component={Link}
                href="/case-studies"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                See Case Studies
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Pain points */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: '#1E3A8A' }}>
            If this feels familiar — we can fix it
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: 900, mx: 'auto' }}>
            Most rescues fail because teams try to “patch” the symptoms. We stabilize the foundation first,
            then ship improvements safely.
          </Typography>
          <Grid container spacing={4}>
            {painPoints.map((p) => (
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1E3A8A' }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {p.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Process */}
        <Box sx={{ backgroundColor: '#F9FAFB', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: '#1E3A8A' }}>
              Our rescue process (built for speed + safety)
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#111827' }}>
                    What happens first
                  </Typography>
                  <List>
                    {processSteps.map((step) => (
                      <ListItem key={step} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#10B981', fontSize: 24 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={step}
                          primaryTypographyProps={{ variant: 'body1', sx: { color: '#374151', fontWeight: 600 } }}
                        />
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
                    backgroundColor: '#0B2A6F',
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                    Typical outcomes
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                  <List>
                    {[
                      'Stable builds + reliable deployments',
                      'Faster page/app performance',
                      'Security hardening + best practices',
                      'Clear roadmap + predictable delivery',
                      'Support options after launch',
                    ].map((item) => (
                      <ListItem key={item} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ sx: { fontWeight: 600 } }} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* FAQ */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: '#1E3A8A' }}>
            Frequently asked questions
          </Typography>
          <Grid container spacing={3}>
            {faqs.map((f) => (
              <Grid item xs={12} md={6} key={f.q}>
                <Card elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>
                    {f.q}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
                    {f.a}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}

