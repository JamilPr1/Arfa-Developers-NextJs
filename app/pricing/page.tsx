import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import {
  CheckCircle as CheckIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Pricing - Transparent Packages & Ranges | Arfa Developers',
  description: 'Transparent pricing packages and ranges with no hidden costs. Web development, redesign, SEO, and digital marketing services with clear pricing.',
  keywords: [
    'web development pricing',
    'website redesign cost',
    'SEO pricing',
    'digital marketing pricing',
    'transparent pricing',
    'web development packages',
    'affordable web development',
  ],
  openGraph: {
    title: 'Pricing - Transparent Packages & Ranges | Arfa Developers',
    description: 'Transparent pricing packages and ranges with no hidden costs. Clear pricing for all our services.',
    type: 'website',
    url: 'https://arfadevelopers.com/pricing',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/pricing',
  },
}

const pricingPackages = [
  {
    name: 'Web Development',
    price: '$2,500 - $15,000+',
    description: 'Custom web applications built to your specifications',
    features: [
      'Custom Design & Development',
      'Responsive Mobile-First Design',
      'Content Management System',
      'SEO Optimization',
      'Performance Optimization',
      '3 Months Support',
    ],
  },
  {
    name: 'Website Redesign',
    price: '$1,500 - $8,000',
    description: 'Fix broken UX, slow performance, and poor conversions',
    features: [
      'UX/UI Redesign',
      'Performance Optimization',
      'Conversion Rate Optimization',
      'Mobile Responsiveness',
      'SEO Improvements',
      '2 Months Support',
    ],
  },
  {
    name: 'Landing Pages',
    price: '$500 - $2,500',
    description: 'High-converting pages for ads, launches, and offers',
    features: [
      'Custom Landing Page Design',
      'A/B Testing Setup',
      'Fast Loading Times',
      'Conversion Tracking',
      'Mobile Responsive',
      '1 Month Support',
    ],
  },
  {
    name: 'E-commerce Development',
    price: '$3,000 - $20,000+',
    description: 'Simple, scalable online stores focused on sales',
    features: [
      'Custom E-commerce Platform',
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Management',
      'Product Catalog',
      '6 Months Support',
    ],
  },
  {
    name: 'SEO Services',
    price: '$500 - $3,000/month',
    description: 'Transparent, realistic SEO focused on long-term growth',
    features: [
      'Comprehensive SEO Strategy',
      'Keyword Research & Optimization',
      'Content Creation',
      'Link Building',
      'Monthly Reporting',
      'Ongoing Optimization',
    ],
  },
  {
    name: 'Digital Marketing',
    price: '$1,000 - $5,000/month',
    description: 'Cost-controlled marketing focused on ROI',
    features: [
      'Multi-Channel Campaigns',
      'Conversion Tracking',
      'A/B Testing',
      'Performance Reporting',
      'Budget Optimization',
      'Monthly Strategy Review',
    ],
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
      name: 'Pricing',
      item: 'https://arfadevelopers.com/pricing',
    },
  ],
}

export default function PricingPage() {
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
              Transparent <span style={{ color: '#F59E0B' }}>Pricing</span>
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
              No hidden costs. Clear pricing ranges for all our services. Get a custom quote based on your specific needs.
            </Typography>
          </Container>
        </Box>

        {/* Pricing Packages */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: 'center',
              color: '#1E3A8A',
            }}
          >
            Service Pricing
          </Typography>
          <Grid container spacing={4}>
            {pricingPackages.map((pkg, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PriceIcon sx={{ fontSize: 40, color: '#1E3A8A', mr: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E3A8A' }}>
                        {pkg.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: '#2563EB',
                        mb: 2,
                      }}
                    >
                      {pkg.price}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
                      {pkg.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <List>
                      {pkg.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon sx={{ color: '#10B981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { color: '#374151' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      component={Link}
                      href="/contact"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 3,
                        backgroundColor: '#1E3A8A',
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#2563EB',
                        },
                      }}
                    >
                      Get Custom Quote
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Need a Custom Solution?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#6B7280', maxWidth: 600, mx: 'auto' }}>
              All pricing is based on your specific requirements. Contact us for a detailed quote tailored to your project needs and budget.
            </Typography>
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#1E3A8A',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
            >
              Request Custom Quote
            </Button>
          </Box>
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}
