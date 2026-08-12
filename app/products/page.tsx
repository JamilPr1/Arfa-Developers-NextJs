import type { Metadata } from 'next'
import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import ProductsGrid from '@/components/ProductsGrid'
import PageHero from '@/components/PageHero'
import Script from 'next/script'
import { getProducts } from '@/lib/productsData'

export const metadata: Metadata = {
  title: 'Software Products | Voice Commerce, POS, CRM, HRM & More | Arfa Developers',
  description:
    'Explore 12+ software products by Arfa Developers — voice commerce, retail POS, social CRM, procurement, HRM, AI sales agents, WhatsApp automation, school ERP, e-commerce, real estate CRM, and clinic management.',
  keywords: [
    'voice commerce software',
    'AI voice agents',
    'restaurant POS system',
    'school management software',
    'HRM payroll software',
    'WhatsApp business automation',
    'WhatsApp AI automation',
    'e-commerce store builder',
    'real estate CRM',
    'clinic management system',
    'Meta Facebook Instagram CRM',
    'procurement sourcing platform',
    'AI sales agents',
    'OpenAI product integrations',
    'LLM business software',
    'Arfa Developers products',
  ],
  openGraph: {
    title: 'Software Products | AI, POS, CRM & Automation | Arfa Developers',
    description:
      'Voice commerce, AI sales agents, POS, CRM, HRM, WhatsApp automation, school ERP, e-commerce, and clinic software by Arfa Developers.',
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
        <PageHero
          title={
            <>
              Software{' '}
              <Box component="span" sx={{ color: '#1D4ED8' }}>
                Products
              </Box>
            </>
          }
          subtitle="Production-ready software from Arfa Developers — AI voice commerce, retail POS, CRM, HRM, WhatsApp automation, education, healthcare, and real estate tools built for real operations."
          ctaText="Get a Free Consultation"
          ctaHref="/contact"
        />

        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'var(--surface-muted)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#0C1222', mb: 2 }}>
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
