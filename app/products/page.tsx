import type { Metadata } from 'next'
import { Box, Container, Typography, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import ProductsGrid from '@/components/ProductsGrid'
import Link from 'next/link'
import Script from 'next/script'
import { getProducts } from '@/lib/productsData'

export const metadata: Metadata = {
  title: 'Software Products | Voice Commerce, POS, CRM, HRM & More | Arfa Developers',
  description:
    'Explore 12+ software products by Arfa Developers — voice commerce, retail POS, social CRM, procurement, HRM, AI sales agents, WhatsApp automation, school ERP, e-commerce, real estate CRM, and clinic management.',
  keywords: [
    'voice commerce software',
    'restaurant POS system',
    'school management software',
    'HRM payroll software',
    'WhatsApp business automation',
    'e-commerce store builder',
    'real estate CRM',
    'clinic management system',
    'Meta Facebook Instagram CRM',
    'procurement sourcing platform',
    'AI sales agents',
    'Arfa Developers products',
  ],
  openGraph: {
    title: 'Software Products | Arfa Developers',
    description: 'Voice commerce, POS, CRM, HRM, e-commerce, education, healthcare, and real estate software built by Arfa Developers.',
    type: 'website',
    url: 'https://www.arfadevelopers.com/products',
  },
  alternates: {
    canonical: 'https://www.arfadevelopers.com/products',
  },
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.arfadevelopers.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.arfadevelopers.com/products' },
  ],
}

export default async function ProductsPage() {
  const products = await getProducts(true)

  return (
    <>
      <Script
        id="products-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
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
              Software{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Products
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
              }}
            >
              Production-ready software from Arfa Developers — voice commerce, retail POS, CRM, HRM, e-commerce, education, healthcare, and real estate tools built for real business operations.
            </Typography>
            <Button
              component={Link}
              href="/contact"
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
              Get a Free Consultation
            </Button>
          </Container>
        </Box>

        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#F9FAFB' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 2 }}>
                Our Products
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 640, mx: 'auto', fontWeight: 400, lineHeight: 1.7 }}
              >
                Compare features and pricing side by side. Every card opens a full product page with screenshots, specs, and contact options.
              </Typography>
            </Box>
            <ProductsGrid initialProducts={products} />
          </Container>
        </Box>
      </Box>
      <CTA />
      <Footer />
    </>
  )
}
