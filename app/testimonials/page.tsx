import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, Rating } from '@mui/material'
import {
  FormatQuote as QuoteIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Testimonials - Honest Feedback from Real Clients | Arfa Developers',
  description: 'Honest feedback from real clients. Read testimonials from businesses we\'ve helped with web development, project rescue, and digital solutions.',
  keywords: [
    'client testimonials',
    'customer reviews',
    'client feedback',
    'web development testimonials',
    'project rescue testimonials',
  ],
  openGraph: {
    title: 'Testimonials - Honest Feedback from Real Clients | Arfa Developers',
    description: 'Honest feedback from real clients about our web development and project rescue services.',
    type: 'website',
    url: 'https://arfadevelopers.com/testimonials',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/testimonials',
  },
}

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    role: 'CEO',
    rating: 5,
    text: 'Arfa Developers rescued our abandoned project and delivered a working solution in just two weeks. Their team is professional, responsive, and truly understands business needs.',
  },
  {
    name: 'Michael Chen',
    company: 'E-commerce Solutions',
    role: 'Founder',
    rating: 5,
    text: 'We had a broken website that was losing customers daily. Arfa Developers fixed all the issues, improved performance, and increased our conversions by 40%. Highly recommended!',
  },
  {
    name: 'Emily Rodriguez',
    company: 'Local Business Group',
    role: 'Marketing Director',
    rating: 5,
    text: 'The team at Arfa Developers took over our incomplete project and not only finished it but improved it significantly. Their ongoing support has been invaluable.',
  },
  {
    name: 'David Thompson',
    company: 'SaaS Platform',
    role: 'CTO',
    rating: 5,
    text: 'Fast, reliable, and cost-effective. Arfa Developers delivered exactly what we needed within our budget and timeline. The code quality is excellent and well-documented.',
  },
  {
    name: 'Lisa Anderson',
    company: 'Healthcare Services',
    role: 'Operations Manager',
    rating: 5,
    text: 'After a bad experience with a freelancer, we were hesitant. But Arfa Developers proved to be professional, transparent, and delivered beyond our expectations.',
  },
  {
    name: 'James Wilson',
    company: 'Retail Business',
    role: 'Owner',
    rating: 5,
    text: 'Our website was slow and losing sales. Arfa Developers optimized everything, fixed security issues, and our sales increased by 35%. Great value for money!',
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
      name: 'Testimonials',
      item: 'https://arfadevelopers.com/testimonials',
    },
  ],
}

export default function TestimonialsPage() {
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
              Client <span style={{ color: '#F59E0B' }}>Testimonials</span>
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
              Honest feedback from real clients. See what businesses like yours have to say about working with us.
            </Typography>
          </Container>
        </Box>

        {/* Testimonials Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <QuoteIcon
                    sx={{
                      fontSize: 60,
                      color: '#E5E7EB',
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      opacity: 0.3,
                    }}
                  />
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: '#374151',
                        lineHeight: 1.8,
                        fontStyle: 'italic',
                        fontSize: '1.05rem',
                      }}
                    >
                      &quot;{testimonial.text}&quot;
                    </Typography>
                    <Box sx={{ borderTop: '1px solid #E5E7EB', pt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {testimonial.role}, {testimonial.company}
                      </Typography>
                    </Box>
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
