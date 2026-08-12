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
import PageHero from '@/components/PageHero'
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
    icon: <BuildIcon sx={{ fontSize: 50, color: 'hsl(210, 98%, 48%)' }} />,
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
        <PageHero
          title={
            <>
              Project <Box component="span" sx={{ color: 'primary.main' }}>Rescue</Box> for US Businesses
            </>
          }
          subtitle="We take over failed freelancer/agency builds, fix what’s broken, and ship production-ready software fast — with clear weekly progress and ongoing support."
          ctaText="Get a Rescue Assessment"
          ctaHref="/contact"
          actions={
            <Button component={Link} href="/case-studies" variant="outlined" size="large">
              View case studies
            </Button>
          }
        />

        {/* Pain points */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: '#0C1222' }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0C1222' }}>
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
        <Box sx={{ backgroundColor: '#F7F8FA', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: '#0C1222' }}>
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8ECF1',
                    boxShadow: 'none',
                    color: '#0C1222',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                    Typical outcomes
                  </Typography>
                  <Divider sx={{ borderColor: '#E8ECF1', mb: 2 }} />
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
                          <CheckIcon sx={{ color: 'hsl(210, 98%, 48%)', fontSize: 22 }} />
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
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: '#0C1222' }}>
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

