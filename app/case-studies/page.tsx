import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, Divider } from '@mui/material'
import {
  TrendingUp as GrowthIcon,
  AttachMoney as BudgetIcon,
  Schedule as TimelineIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Case Studies - Real Results, Budgets & Outcomes | Arfa Developers',
  description: 'Real case studies with actual results, budgets, and outcomes. See how we\'ve helped businesses achieve their goals with web development and project rescue.',
  keywords: [
    'web development case studies',
    'project rescue case studies',
    'real results',
    'client success stories',
    'web development outcomes',
  ],
  openGraph: {
    title: 'Case Studies - Real Results, Budgets & Outcomes | Arfa Developers',
    description: 'Real case studies with actual results, budgets, and outcomes from our web development projects.',
    type: 'website',
    url: 'https://arfadevelopers.com/case-studies',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/case-studies',
  },
}

const caseStudies = [
  {
    title: 'E-commerce Platform Rescue',
    client: 'Retail Business',
    challenge: 'Abandoned e-commerce project with broken checkout, slow performance, and security vulnerabilities.',
    solution: 'Complete project rescue including bug fixes, performance optimization, security updates, and feature completion.',
    results: [
      '40% increase in conversion rate',
      '60% faster page load times',
      'Zero security vulnerabilities',
      '100% checkout functionality restored',
    ],
    budget: '$8,500',
    timeline: '3 weeks',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    title: 'Website Redesign & Optimization',
    client: 'Local Service Business',
    challenge: 'Outdated website with poor UX, slow performance, and low conversion rates.',
    solution: 'Complete redesign with modern UI/UX, performance optimization, and conversion rate optimization.',
    results: [
      '35% increase in conversions',
      '50% improvement in page speed',
      '200% increase in mobile traffic',
      'Better user engagement metrics',
    ],
    budget: '$4,200',
    timeline: '4 weeks',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'SaaS Platform Development',
    client: 'Tech Startup',
    challenge: 'Need for a scalable SaaS platform with subscription management and user dashboard.',
    solution: 'Custom SaaS platform built from scratch with subscription billing, user management, and analytics.',
    results: [
      'Successful platform launch',
      '500+ active users in first month',
      '99.9% uptime',
      'Scalable architecture',
    ],
    budget: '$15,000',
    timeline: '10 weeks',
    technologies: ['React', 'Next.js', 'PostgreSQL', 'Stripe'],
  },
  {
    title: 'Healthcare System Rescue',
    client: 'Healthcare Provider',
    challenge: 'HIPAA compliance issues, poor performance, and incomplete features in patient management system.',
    solution: 'Complete system overhaul with HIPAA compliance, performance optimization, and feature completion.',
    results: [
      '100% HIPAA compliant',
      '70% faster system performance',
      'All features completed',
      'Improved user satisfaction',
    ],
    budget: '$12,000',
    timeline: '6 weeks',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'Landing Page Campaign',
    client: 'Marketing Agency',
    challenge: 'Need for high-converting landing pages for paid advertising campaigns.',
    solution: 'Multiple optimized landing pages with A/B testing, conversion tracking, and fast load times.',
    results: [
      '25% conversion rate improvement',
      '50% lower cost per acquisition',
      'Fast loading times (under 2 seconds)',
      'Better ad performance',
    ],
    budget: '$2,500',
    timeline: '2 weeks',
    technologies: ['Next.js', 'Analytics', 'A/B Testing'],
  },
  {
    title: 'Website Speed Optimization',
    client: 'E-commerce Store',
    challenge: 'Slow website losing customers and affecting SEO rankings.',
    solution: 'Comprehensive performance optimization including code, images, infrastructure, and caching.',
    results: [
      '80% faster load times',
      '30% improvement in SEO rankings',
      '25% reduction in bounce rate',
      'Better Core Web Vitals scores',
    ],
    budget: '$3,000',
    timeline: '2 weeks',
    technologies: ['Performance Optimization', 'CDN', 'Caching'],
  },
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://arfadevelopers.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Case Studies',
      item: 'https://arfadevelopers.com/case-studies',
    },
  ],
}

export default function CaseStudiesPage() {
  return (
    <>
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        {/* Hero Section */}
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
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                color: 'white',
              }}
            >
              Case <span style={{ color: '#F59E0B' }}>Studies</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Real results, budgets, and outcomes. See how we've helped businesses achieve their goals.
            </Typography>
          </Container>
        </Box>

        {/* Case Studies */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {caseStudies.map((study, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                      {study.technologies.map((tech, idx) => (
                        <Chip key={idx} label={tech} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#1E3A8A' }} />
                      ))}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1E3A8A' }}>
                      {study.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                      Client: {study.client}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1E3A8A' }}>
                          Challenge
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', mb: 3, lineHeight: 1.8 }}>
                          {study.challenge}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1E3A8A' }}>
                          Solution
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
                          {study.solution}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
                          Results
                        </Typography>
                        {study.results.map((result, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                            <CheckIcon sx={{ color: '#10B981', fontSize: 20, mr: 2, mt: 0.5 }} />
                            <Typography variant="body2" sx={{ color: '#374151', flex: 1 }}>
                              {result}
                            </Typography>
                          </Box>
                        ))}
                        <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BudgetIcon sx={{ color: '#1E3A8A' }} />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              <strong>Budget:</strong> {study.budget}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon sx={{ color: '#1E3A8A' }} />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              <strong>Timeline:</strong> {study.timeline}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
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
