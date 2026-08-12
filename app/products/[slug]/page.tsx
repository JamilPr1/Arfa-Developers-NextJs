import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { CheckCircle as CheckIcon, ArrowBack as BackIcon } from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'
import { getProductBySlug, getProducts, formatProductPrice } from '@/lib/productsData'
import { ProductHeroMedia, ProductGallery } from '@/components/ProductImage'

export async function generateStaticParams() {
  const products = await getProducts(true)
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: `${product.name} — Features, Pricing & Details | Arfa Developers`,
    description: product.shortDescription,
    keywords: [
      product.name,
      product.category,
      'Arfa Developers',
      'software product',
      product.slug.replace(/-/g, ' '),
    ],
    openGraph: {
      title: `${product.name} | Arfa Developers`,
      description: product.shortDescription,
      images: product.gallery?.length
        ? product.gallery.map((g) => ({ url: g.src }))
        : product.image
          ? [{ url: product.image }]
          : [],
      type: 'website',
      url: `https://www.arfadevelopers.com/products/${product.slug}`,
    },
    alternates: {
      canonical: `https://www.arfadevelopers.com/products/${product.slug}`,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.shortDescription,
    image: product.image,
    applicationCategory: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      url: `https://www.arfadevelopers.com/products/${product.slug}`,
    },
    provider: {
      '@type': 'Organization',
      name: 'Arfa Developers',
      url: 'https://www.arfadevelopers.com',
    },
  }

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
            pt: { xs: 12, md: 14 },
            pb: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 18% 40%, rgba(255,255,255,0.12) 0%, transparent 48%), radial-gradient(circle at 85% 20%, rgba(245,158,11,0.12) 0%, transparent 40%)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Button
              component={Link}
              href="/products"
              startIcon={<BackIcon />}
              sx={{ color: 'text.secondary', mb: 3, '&:hover': { color: '#0C1222' } }}
            >
              All Products
            </Button>
            <Grid container spacing={{ xs: 4, md: 5 }} alignItems="center">
              <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
                <Chip
                  label={product.category}
                  sx={{ bgcolor: 'primary.50', color: 'primary.dark', mb: 2, fontWeight: 600 }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.25rem', md: '3rem' },
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {product.name}
                </Typography>
                <Typography variant="h5" sx={{ color: '#64748B', mb: 3, fontWeight: 400, lineHeight: 1.6 }}>
                  {product.shortDescription}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1D4ED8', mb: 3 }}>
                  {formatProductPrice(product)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    href={product.ctaLink || '/contact'}
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#0C1222',
                      fontWeight: 600,
                      px: 4,
                      '&:hover': { backgroundColor: '#1E293B' },
                    }}
                  >
                    {product.ctaText || 'Get Started'}
                  </Button>
                  {product.demoLink && (
                    <Button
                      component={Link}
                      href={product.demoLink}
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: '#0C1222',
                        fontWeight: 600,
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      View Demo
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
                <ProductHeroMedia src={product.image} alt={product.name} />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 10, bgcolor: '#F7F8FA' }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0C1222', mb: 3 }}>
                  About {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.05rem' }}>
                  {product.description}
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                {product.features?.length > 0 && (
                  <Card sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0C1222', mb: 3 }}>
                      Key Features
                    </Typography>
                    <List>
                      {product.features.map((feature) => (
                        <ListItem key={feature} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon sx={{ color: '#10B981' }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                )}
              </Grid>
            </Grid>

            {product.benefits && product.benefits.length > 0 && (
              <>
                <Divider sx={{ my: 6 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0C1222', mb: 4, textAlign: 'center' }}>
                  Why Choose {product.name}?
                </Typography>
                <Grid container spacing={3}>
                  {product.benefits.map((benefit) => (
                    <Grid item xs={12} md={4} key={benefit}>
                      <Card
                        sx={{
                          p: 3,
                          height: '100%',
                          borderRadius: 3,
                          textAlign: 'center',
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'translateY(-4px)' },
                        }}
                      >
                        <CheckIcon sx={{ color: '#10B981', fontSize: 40, mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {benefit}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {product.gallery && product.gallery.length > 0 && (
              <ProductGallery items={product.gallery} title={`See ${product.name} in Action`} />
            )}
          </Container>
        </Box>
      </Box>
      <CTA />
      <Footer />
    </>
  )
}
