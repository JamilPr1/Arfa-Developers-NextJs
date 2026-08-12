'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { CheckCircle as CheckIcon, ArrowForward as ArrowIcon } from '@mui/icons-material'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCardMedia } from '@/components/ProductImage'

interface Product {
  id: number
  name: string
  slug: string
  shortDescription: string
  image: string
  imageFit?: 'cover' | 'contain'
  price: number
  currency: string
  priceDisplay?: string
  features: string[]
  category: string
  ctaText: string
}

interface ProductsGridProps {
  initialProducts?: Product[]
}

const FEATURES_SHOWN = 3
const DESCRIPTION_LINES = 3

function displayPrice(product: Product): string {
  if (product.priceDisplay) return product.priceDisplay
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
    minimumFractionDigits: 0,
  }).format(product.price)
}

export default function ProductsGrid({ initialProducts }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [loading, setLoading] = useState(!initialProducts?.length)

  useEffect(() => {
    if (initialProducts?.length) return

    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [initialProducts])

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#0C1222' }} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading products...</Typography>
      </Box>
    )
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No products available yet. Check back soon!
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={4} alignItems="stretch">
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} key={product.id} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            style={{ width: '100%', display: 'flex' }}
          >
            <Card
              component={Link}
              href={`/products/${product.slug}`}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(15,39,79,0.06)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 40px rgba(15, 39, 79, 0.12)',
                  borderColor: '#BFDBFE',
                },
              }}
            >
              <ProductCardMedia
                src={product.image}
                alt={product.name}
                fit={product.imageFit || 'cover'}
              />

              <CardContent
                sx={{
                  flex: 1,
                  p: { xs: 3, md: 3.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 1.5,
                    minHeight: 56,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#0C1222',
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      bgcolor: '#EFF6FF',
                      color: '#0C1222',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 24,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: '#2563EB', mb: 1.5, lineHeight: 1.2 }}
                >
                  {displayPrice(product)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.65,
                    minHeight: `calc(1.65em * ${DESCRIPTION_LINES})`,
                    display: '-webkit-box',
                    WebkitLineClamp: DESCRIPTION_LINES,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.shortDescription}
                </Typography>

                {product.features?.length > 0 && (
                  <List dense disablePadding sx={{ mb: 2, flex: 1 }}>
                    {product.features.slice(0, FEATURES_SHOWN).map((feature) => (
                      <ListItem key={feature} disableGutters sx={{ py: 0.35, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
                          <CheckIcon sx={{ color: '#10B981', fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                            sx: { lineHeight: 1.45, fontSize: '0.8125rem' },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                <Button
                  component="span"
                  variant="contained"
                  endIcon={<ArrowIcon />}
                  fullWidth
                  sx={{
                    mt: 'auto',
                    backgroundColor: '#0C1222',
                    py: 1.35,
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    pointerEvents: 'none',
                    '&:hover': { backgroundColor: '#2563EB' },
                  }}
                >
                  {product.ctaText || 'View Details'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  )
}
