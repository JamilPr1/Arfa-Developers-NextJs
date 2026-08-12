import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, Chip, Divider, Button } from '@mui/material'
import { CheckCircle as CheckIcon, ArrowBack as BackIcon } from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import { ResultsSummary, TestimonialBlock } from '@/components/CaseStudyBlocks'
import Link from 'next/link'
import Script from 'next/script'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/case-studies/project-rescue-usa-saas`

export const metadata: Metadata = {
  title: 'US Case Study: Rescuing a Failed SaaS Build in 5 Weeks | Arfa Developers',
  description:
    'How we rescued a failed SaaS platform for a US startup, stabilized production, and improved activation by 38% in 5 weeks.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'US Case Study: Rescuing a Failed SaaS Build in 5 Weeks',
    description:
      'From broken deployments to stable growth: a US SaaS rescue case study with measurable outcomes.',
    type: 'article',
    url: pageUrl,
  },
}

const metrics = [
  '38% increase in trial-to-paid conversion',
  '62% faster page response times',
  '99.95% production uptime after stabilization',
  '49% reduction in support tickets in 30 days',
]

const techStack = ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Vercel', 'Sentry']

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
    { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${baseUrl}/case-studies` },
    { '@type': 'ListItem', position: 3, name: 'US SaaS Rescue Case Study', item: pageUrl },
  ],
}

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'US Case Study: Rescuing a Failed SaaS Build in 5 Weeks',
  description:
    'How Arfa Developers rescued a failed SaaS build for a US startup and delivered measurable growth outcomes.',
  mainEntityOfPage: pageUrl,
  author: { '@type': 'Organization', name: 'Arfa Developers' },
  publisher: { '@type': 'Organization', name: 'Arfa Developers', url: baseUrl },
  datePublished: '2026-04-16',
  dateModified: '2026-04-16',
}

export default function CaseStudyRescueUsaSaasPage() {
  return (
    <>
      <Script
        id="case-study-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="case-study-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <Header />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Button
              component={Link}
              href="/case-studies"
              startIcon={<BackIcon />}
              sx={{
                color: '#64748B',
                mb: 2,
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Back to Case Studies
            </Button>
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.2rem' }, mb: 2, color: '#0C1222' }}>
              US SaaS Project Rescue in 5 Weeks
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 980, color: 'text.secondary', lineHeight: 1.6 }}>
              A US startup came to us after a failed agency engagement. Their onboarding was broken, deployments
              were unstable, and trial users were churning. We took over, stabilized, and shipped measurable wins.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                  Challenge
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.9, mb: 3 }}>
                  The startup had invested months into a SaaS product but was blocked by recurring production issues:
                  broken checkout flows, inconsistent trial activation events, slow dashboards, and fragile deployments.
                  Their internal team needed a partner who could take ownership immediately and ship fixes without
                  another rewrite cycle.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                  Solution
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.9, mb: 2 }}>
                  We executed a structured rescue plan:
                </Typography>
                <Box sx={{ pl: 1 }}>
                  {[
                    '48-hour triage and incident map across app, backend, and billing.',
                    'Stabilized CI/CD and release process to remove deployment failures.',
                    'Refactored checkout + activation events for reliable conversion tracking.',
                    'Optimized API queries and dashboard rendering paths.',
                    'Added monitoring, alerts, and rollback playbooks.',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.3 }}>
                      <CheckIcon sx={{ color: '#10B981', mr: 1.5, mt: 0.2 }} />
                      <Typography sx={{ color: '#374151' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                  Results
                </Typography>
                {metrics.map((m) => (
                  <Box key={m} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <CheckIcon sx={{ color: '#10B981', mr: 1.5, mt: 0.2 }} />
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>{m}</Typography>
                  </Box>
                ))}
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <ResultsSummary
                metrics={metrics}
                note="These are representative outcomes from the engagement. Exact figures vary by product maturity and traffic mix."
              />

              <TestimonialBlock
                quote="We were stuck for months with unstable releases. Arfa Developers took over, fixed the foundations, and shipped improvements every week. The product finally felt reliable."
                author="Product Lead"
                role="B2B SaaS"
                company="US Startup"
                tags={['Project Rescue', 'Stabilization', 'Weekly Shipping']}
              />

              <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                  Engagement Snapshot
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Client:</strong> US B2B SaaS Startup
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Timeline:</strong> 5 weeks
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Scope:</strong> Rescue + Stabilization + Growth fixes
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  <strong>Model:</strong> Dedicated delivery pod
                </Typography>
              </Card>

              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#0C1222' }}>
                  Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {techStack.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: '#EFF6FF', color: '#0C1222', fontWeight: 600 }} />
                  ))}
                </Box>
                <Button
                  component={Link}
                  href="/project-rescue"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: '#0C1222',
                    '&:hover': { backgroundColor: '#2563EB' },
                  }}
                >
                  Start your rescue
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}

