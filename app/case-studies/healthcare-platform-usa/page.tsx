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
const pageUrl = `${baseUrl}/case-studies/healthcare-platform-usa`

export const metadata: Metadata = {
  title: 'US Case Study: Healthcare Platform Stabilization & Compliance | Arfa Developers',
  description:
    'How we stabilized a US healthcare platform, improved reliability and delivery speed, and completed compliance-critical modules in 6 weeks.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'US Case Study: Healthcare Platform Stabilization & Compliance',
    description:
      'From delayed releases to stable delivery: US healthcare platform rescue with security, reliability, and measurable outcomes.',
    type: 'article',
    url: pageUrl,
  },
}

const metrics = [
  '68% faster release cycle time',
  '99.97% uptime after stabilization',
  '45% reduction in critical defects',
  'Compliance-critical modules delivered on schedule',
]

const techStack = ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'RBAC', 'Audit Logging', 'Sentry']

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
    { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${baseUrl}/case-studies` },
    { '@type': 'ListItem', position: 3, name: 'US Healthcare Platform Case Study', item: pageUrl },
  ],
}

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'US Case Study: Healthcare Platform Stabilization & Compliance',
  description:
    'How Arfa Developers stabilized a US healthcare platform and accelerated reliable, compliance-aligned delivery.',
  mainEntityOfPage: pageUrl,
  author: { '@type': 'Organization', name: 'Arfa Developers' },
  publisher: { '@type': 'Organization', name: 'Arfa Developers', url: baseUrl },
  datePublished: '2026-04-16',
  dateModified: '2026-04-16',
}

export default function HealthcarePlatformUsaCaseStudyPage() {
  return (
    <>
      <Script
        id="case-study-health-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="case-study-health-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <Header />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            color: 'white',
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
                color: 'rgba(255,255,255,0.9)',
                mb: 2,
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Back to Case Studies
            </Button>
            <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3.2rem' }, mb: 2, color: 'white' }}>
              US Healthcare Platform Stabilization
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 980, color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}>
              A healthcare operations team needed reliable releases and compliance-safe delivery. We took over
              their delayed platform and built a stable, predictable engineering workflow.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Challenge
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.9, mb: 3 }}>
                  The product had release bottlenecks, recurring regressions, and missing compliance-critical
                  workflows. Engineering and operations teams lacked confidence in production changes, causing
                  delays and mounting support load.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Solution
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.9, mb: 2 }}>
                  We implemented a stabilization and delivery framework:
                </Typography>
                <Box sx={{ pl: 1 }}>
                  {[
                    'Reworked release process with staged validation + rollback safety.',
                    'Fixed role-based access and audit logging gaps.',
                    'Reduced high-risk query paths and timeout hotspots.',
                    'Closed priority compliance workflow gaps.',
                    'Introduced engineering dashboards for reliability and change tracking.',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.3 }}>
                      <CheckIcon sx={{ color: '#10B981', mr: 1.5, mt: 0.2 }} />
                      <Typography sx={{ color: '#374151' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
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
                note="Healthcare engagements often include compliance constraints and change management; outcomes vary based on baseline maturity and release discipline."
              />

              <TestimonialBlock
                quote="We needed reliable releases and compliance-safe delivery. The team stabilized the platform and gave us a clear, predictable engineering rhythm."
                author="Operations Director"
                role="Healthcare"
                company="US Organization"
                tags={['Stabilization', 'Compliance', 'Reliability']}
              />

              <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Engagement Snapshot
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Client:</strong> US Healthcare Operations Team
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Timeline:</strong> 6 weeks
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Scope:</strong> Stabilization + compliance workflow delivery
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  <strong>Model:</strong> Dedicated engineering pod
                </Typography>
              </Card>

              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {techStack.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E3A8A', fontWeight: 600 }} />
                  ))}
                </Box>
                <Button
                  component={Link}
                  href="/project-rescue"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: '#1E3A8A',
                    '&:hover': { backgroundColor: '#2563EB' },
                  }}
                >
                  Stabilize my platform
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

