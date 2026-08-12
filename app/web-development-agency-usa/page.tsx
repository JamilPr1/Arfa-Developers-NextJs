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
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/web-development-agency-usa`

export const metadata: Metadata = {
  title: 'Web Development Agency USA | Next.js, React & Custom Web Apps | Arfa Developers',
  description:
    'US-focused web development agency building high-performance websites and custom web applications. Next.js/React builds, eCommerce, SaaS, integrations, and ongoing support. Free consultation.',
  keywords: [
    'web development agency USA',
    'next.js development agency',
    'react development company USA',
    'custom web application development',
    'SaaS development agency',
    'ecommerce development USA',
    'hire web developers USA',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Web Development Agency USA | Next.js, React & Custom Web Apps',
    description:
      'We build high-performance websites and custom web apps for US businesses with clean code, strong UX, and reliable deployments.',
    type: 'website',
    url: pageUrl,
  },
}

const capabilities = [
  {
    icon: <CodeIcon sx={{ fontSize: 46, color: '#0C1222' }} />,
    title: 'Custom web apps',
    desc: 'Dashboards, portals, marketplaces, internal tools, and SaaS apps.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 46, color: '#10B981' }} />,
    title: 'Performance + UX',
    desc: 'Core Web Vitals, conversion improvements, and fast-loading interfaces.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 46, color: '#EF4444' }} />,
    title: 'Security by default',
    desc: 'Hardening, dependency hygiene, auth best practices, and audits.',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 46, color: '#2563EB' }} />,
    title: 'Deployments + DevOps',
    desc: 'CI/CD, Vercel/AWS, observability, logs, and incident response.',
  },
]

const stacks = ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Stripe', 'AWS']

const deliverables = [
  'Clear scope + milestones (weekly shipping cadence)',
  'Modern UI + responsive design',
  'SEO-ready pages (metadata + schema + sitemap)',
  'Analytics + event tracking (optional)',
  'Testing + code quality standards',
  'Maintenance and support options',
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Web Development Agency USA', item: pageUrl },
  ],
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Development Services',
  serviceType: 'Web Development Agency',
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

export default function WebDevelopmentAgencyUsaPage() {
  return (
    <>
      <Script
        id="webdev-usa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="webdev-usa-service"
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
                fontSize: { xs: '2.4rem', md: '3.6rem', lg: '4.1rem' },
                lineHeight: 1.15,
                color: '#0C1222',
              }}
            >
              Web Development Agency <span style={{ color: 'primary.main' }}>USA</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: 950,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.65,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.45rem' },
              }}
            >
              High-performance websites and custom web apps built with Next.js/React — designed to convert,
              ship fast, and scale safely.
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
                Get a Free Consultation
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
            {capabilities.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c.title}>
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
                  <Box sx={{ mb: 2 }}>{c.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0C1222' }}>
                    {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {c.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textAlign: 'center', color: '#0C1222' }}>
              Modern stack, enterprise discipline
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3, maxWidth: 950, mx: 'auto' }}>
              We ship fast without cutting corners — clean architecture, safe deployments, and maintainable code.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {stacks.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  sx={{
                    bgcolor: '#F3F4F6',
                    color: '#0C1222',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#E5E7EB' },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>

        <Box sx={{ backgroundColor: '#F7F8FA', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#111827' }}>
                    What you get
                  </Typography>
                  <List>
                    {deliverables.map((d) => (
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
                    Prefer fixed scope? Or ongoing delivery?
                  </Typography>
                  <Typography sx={{ color: '#64748B', lineHeight: 1.8 }}>
                    We can deliver a fixed-scope build, or act as your product engineering partner with a monthly
                    cadence. Either way: clear milestones, quality standards, and predictable communication.
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      href="/contact"
                      variant="contained"
                      sx={{
                        backgroundColor: '#0C1222',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        '&:hover': { backgroundColor: '#1E293B' },
                      }}
                    >
                      Talk to an expert
                    </Button>
                    <Button
                      component={Link}
                      href="/pricing"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.6)',
                        color: '#0C1222',
                        fontWeight: 800,
                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.08)' },
                      }}
                    >
                      View pricing
                    </Button>
                  </Box>
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

