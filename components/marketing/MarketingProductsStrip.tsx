'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import productsData from '@/lib/data/products.json'

type ProductLite = {
  name: string
  slug: string
  shortDescription: string
  priceDisplay?: string
  published?: boolean
}

const products = (productsData as ProductLite[])
  .filter((p) => p.published !== false)
  .slice(0, 6)

export default function MarketingProductsStrip() {
  return (
    <Box
      id="products"
      sx={{
        py: { xs: 6, sm: 10 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container>
        <Box sx={{ textAlign: { xs: 'left', md: 'center' }, mb: 4, maxWidth: 720, mx: { md: 'auto' } }}>
          <Typography component="h2" variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Software products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Production-ready tools from Arfa Developers — explore features, pricing, and demos.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.slug}>
              <Card
                variant="outlined"
                component={Link}
                href={`/products/${p.slug}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  boxShadow: 'none',
                  '&:hover': { borderColor: 'primary.main', boxShadow: 1, transform: 'none' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.05rem' }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {p.shortDescription}
                  </Typography>
                  {p.priceDisplay && (
                    <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {p.priceDisplay}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} href="/products" variant="contained" color="primary">
            View all products
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
