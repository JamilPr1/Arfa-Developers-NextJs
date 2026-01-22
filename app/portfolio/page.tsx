import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Tabs, Tab, Chip, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Our Portfolio - Web Development Projects & Case Studies | Arfa Developers',
  description: 'Explore our portfolio of successful web development projects including e-commerce platforms, healthcare systems, mobile apps, and enterprise solutions. See how we rescue and rebuild failed projects.',
  keywords: [
    'web development portfolio',
    'web app projects',
    'mobile app development portfolio',
    'enterprise software projects',
    'ecommerce development',
    'healthcare software',
    'fintech applications',
    'SaaS platforms',
    'project case studies',
  ],
  openGraph: {
    title: 'Our Portfolio - Web Development Projects & Case Studies | Arfa Developers',
    description: 'Explore our successful web development projects and see how we rescue and rebuild failed projects.',
    type: 'website',
    url: 'https://arfadevelopers.com/portfolio',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/portfolio',
  },
}

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    tech: ['React', 'Node.js', 'MongoDB'],
    description: 'Scalable e-commerce solution with real-time inventory management',
    fullDescription: 'Built a comprehensive e-commerce platform with advanced features including real-time inventory tracking, secure payment processing, and seamless order management. The platform handles thousands of transactions daily with 99.9% uptime.',
  },
  {
    id: 2,
    title: 'Healthcare Management System',
    type: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    description: 'HIPAA-compliant healthcare platform for patient management',
    fullDescription: 'Developed a HIPAA-compliant healthcare management system that securely handles patient records, appointments, and medical billing. The system serves over 50 healthcare facilities with strict security and compliance requirements.',
  },
  {
    id: 3,
    title: 'FinTech Mobile App',
    type: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    tech: ['React Native', 'Firebase', 'Stripe'],
    description: 'Secure mobile banking application with biometric authentication',
    fullDescription: 'Created a secure mobile banking application with biometric authentication, real-time transaction processing, and advanced security features. The app has over 100K downloads with a 4.8-star rating.',
  },
  {
    id: 4,
    title: 'SaaS Dashboard',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    tech: ['Vue.js', 'Python', 'AWS'],
    description: 'Analytics dashboard for SaaS businesses with real-time metrics',
    fullDescription: 'Built a comprehensive analytics dashboard that provides real-time insights for SaaS businesses. Features include custom reporting, data visualization, and automated alerts. Used by 500+ businesses.',
  },
  {
    id: 5,
    title: 'Real Estate Platform',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    tech: ['Next.js', 'GraphQL', 'MongoDB'],
    description: 'Property listing platform with virtual tour integration',
    fullDescription: 'Developed a modern real estate platform with virtual tour integration, advanced search filters, and property management tools. The platform lists over 10,000 properties with high user engagement.',
  },
  {
    id: 6,
    title: 'Education LMS',
    type: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    tech: ['React', 'Django', 'PostgreSQL'],
    description: 'Learning management system for online education',
    fullDescription: 'Created a comprehensive learning management system that supports online courses, student progress tracking, and interactive assessments. Serves over 50,000 students across multiple institutions.',
  },
]

const projectTypes = ['All', 'Web App', 'Mobile App', 'Enterprise']

const portfolioStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Web Development Portfolio',
  description: 'Portfolio of successful web development projects',
  itemListElement: projects.map((project, index) => ({
    '@type': 'CreativeWork',
    position: index + 1,
    name: project.title,
    description: project.fullDescription,
    creator: {
      '@type': 'Organization',
      name: 'Arfa Developers',
    },
  })),
}

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
      name: 'Portfolio',
      item: 'https://arfadevelopers.com/portfolio',
    },
  ],
}

export default function PortfolioPage() {
  return (
    <>
      <Script
        id="portfolio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData) }}
      />
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
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              Our{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Portfolio
              </Box>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              Showcasing innovative solutions that drive business success. 
              From startups to enterprises, we deliver excellence.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="#contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#FBBF24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Your Project
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Portfolio Projects */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                        {project.title}
                      </Typography>
                      <Chip
                        label={project.type}
                        size="small"
                        sx={{
                          backgroundColor: '#EFF6FF',
                          color: '#1E3A8A',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                      {project.tech.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: '#F9FAFB',
                            color: '#6B7280',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
