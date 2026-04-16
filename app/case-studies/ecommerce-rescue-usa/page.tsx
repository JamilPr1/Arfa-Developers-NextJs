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
const pageUrl = `${baseUrl}/case-studies/ecommerce-rescue-usa`

export const metadata: Metadata = {
  title: 'US Case Study: eCommerce Rescue & CRO Recovery in 4 Weeks | Arfa Developers',
  description:
    'How we rescued a failing US eCommerce store by fixing checkout bugs, improving speed, and increasing conversion by 41% in 4 weeks.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'US Case Study: eCommerce Rescue & CRO Recovery in 4 Weeks',
    description:
      'Checkout failures to conversion growth: a US eCommerce rescue with measurable performance and revenue outcomes.',
    type: 'article',
    url: pageUrl,
  },
}

const metrics = [
  '41% increase in conversion rate',
  '29% increase in average order value',
  '57% faster checkout flow completion',
  '36% reduction in cart abandonment',
]

const techStack = ['Next.js', 'Node.js', 'Stripe', 'PostgreSQL', 'Vercel', 'Google Analytics 4']

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
    { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${baseUrl}/case-studies` },
    { '@type': 'ListItem', position: 3, name: 'US eCommerce Rescue Case Study', item: pageUrl },
  ],
}

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'US Case Study: eCommerce Rescue & CRO Recovery in 4 Weeks',
  description:
    'How Arfa Developers rescued a failing US eCommerce build and delivered measurable conversion and revenue improvements.',
  mainEntityOfPage: pageUrl,
  author: { '@type': 'Organization', name: 'Arfa Developers' },
  publisher: { '@type': 'Organization', name: 'Arfa Developers', url: baseUrl },
  datePublished: '2026-04-16',
  dateModified: '2026-04-16',
}

export default function EcommerceRescueUsaCaseStudyPage() {
  return (
    <>
      <Script
        id="case-study-ecom-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="case-study-ecom-article"
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
              US eCommerce Rescue & CRO Recovery
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 980, color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}>
              A US DTC brand had unstable checkout, slow PDP pages, and weak funnel visibility. We stabilized
              the stack and implemented conversion-focused fixes in 4 weeks.
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
                  The store had unreliable Stripe callbacks, inconsistent discount logic, and high cart drop-off.
                  Marketing was spending on paid traffic without trustworthy funnel data. The team needed fast
                  stabilization plus immediate revenue impact.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Solution
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.9, mb: 2 }}>
                  We delivered a rescue + optimization sprint:
                </Typography>
                <Box sx={{ pl: 1 }}>
                  {[
                    'Rebuilt checkout error handling + webhook reliability.',
                    'Optimized product and cart rendering for Core Web Vitals.',
                    'Fixed promo-code logic and edge-case cart failures.',
                    'Implemented clean event tracking for funnel accuracy.',
                    'Added CRO test plan and rapid UX improvements.',
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
                note="Outcomes shown reflect improvements after stabilization and CRO changes. Results vary based on traffic sources and product catalog."
              />

              <TestimonialBlock
                quote="Checkout issues were killing revenue. The rescue sprint fixed reliability and performance quickly, and we finally had clean funnel data to scale ads."
                author="Growth Manager"
                role="DTC eCommerce"
                company="US Brand"
                tags={['Checkout Rescue', 'CRO', 'Performance']}
              />

              <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#1E3A8A' }}>
                  Engagement Snapshot
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Client:</strong> US DTC eCommerce Brand
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Timeline:</strong> 4 weeks
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  <strong>Scope:</strong> Checkout rescue + CRO optimization
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  <strong>Model:</strong> Rescue sprint
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
                  Rescue my eCommerce project
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

