import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, Stepper, Step, StepLabel, StepContent } from '@mui/material'
import {
  Search as DiscoveryIcon,
  DesignServices as DesignIcon,
  Build as DevelopmentIcon,
  RocketLaunch as LaunchIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Our Process - Step-by-Step Development Process | Arfa Developers',
  description: 'Step-by-step breakdown of our development process from discovery to launch. Transparent, collaborative, and results-focused.',
  keywords: [
    'web development process',
    'development workflow',
    'project process',
    'website development steps',
    'development methodology',
  ],
  openGraph: {
    title: 'Our Process - Step-by-Step Development Process | Arfa Developers',
    description: 'Step-by-step breakdown of our development process from discovery to launch.',
    type: 'website',
    url: 'https://arfadevelopers.com/our-process',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/our-process',
  },
}

const processSteps = [
  {
    title: 'Discovery & Planning',
    description: 'We start by understanding your business, goals, and requirements. This phase includes project scope definition, budget planning, and timeline establishment.',
    details: [
      'Initial consultation and requirements gathering',
      'Business goals and objectives analysis',
      'Target audience and user persona definition',
      'Project scope and feature prioritization',
      'Budget and timeline planning',
      'Technical requirements assessment',
    ],
    icon: <DiscoveryIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
  },
  {
    title: 'Design & Prototyping',
    description: 'We create wireframes, mockups, and prototypes to visualize your project before development begins. Your feedback is incorporated throughout this phase.',
    details: [
      'Wireframe creation and user flow mapping',
      'UI/UX design mockups',
      'Interactive prototype development',
      'Design review and feedback cycles',
      'Responsive design planning',
      'Brand consistency and style guide',
    ],
    icon: <DesignIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
  },
  {
    title: 'Development & Testing',
    description: 'Our development team builds your project using best practices, clean code, and modern technologies. Continuous testing ensures quality throughout.',
    details: [
      'Agile development sprints',
      'Code reviews and quality assurance',
      'Feature development and integration',
      'Continuous testing and bug fixes',
      'Performance optimization',
      'Security implementation',
    ],
    icon: <DevelopmentIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
  },
  {
    title: 'Launch & Support',
    description: 'We handle deployment, launch, and provide ongoing support. Your project goes live smoothly with monitoring and maintenance.',
    details: [
      'Final testing and quality assurance',
      'Deployment and go-live process',
      'Performance monitoring setup',
      'Documentation and handover',
      'Training and support',
      'Ongoing maintenance and updates',
    ],
    icon: <LaunchIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
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
      name: 'Our Process',
      item: 'https://arfadevelopers.com/our-process',
    },
  ],
}

export default function OurProcessPage() {
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
              Our <span style={{ color: '#F59E0B' }}>Process</span>
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
              A transparent, step-by-step process from discovery to launch. We keep you informed every step of the way.
            </Typography>
          </Container>
        </Box>

        {/* Process Steps */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {processSteps.map((step, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { xs: 'center', md: 'flex-start' },
                      p: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: '100%', md: 120 },
                        mb: { xs: 3, md: 0 },
                        mr: { md: 4 },
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: '#1E3A8A',
                        }}
                      >
                        {index + 1}. {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          color: '#6B7280',
                          fontSize: '1.1rem',
                          lineHeight: 1.8,
                        }}
                      >
                        {step.description}
                      </Typography>
                      <Box>
                        {step.details.map((detail, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              mb: 1.5,
                            }}
                          >
                            <CheckIcon
                              sx={{
                                color: '#10B981',
                                fontSize: 20,
                                mr: 2,
                                mt: 0.5,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#374151',
                                flex: 1,
                              }}
                            >
                              {detail}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Ready to Start Your Project?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#6B7280', maxWidth: 600, mx: 'auto' }}>
              Let&apos;s discuss your project and how our process can help you achieve your goals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <CTA />
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
