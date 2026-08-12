'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'

type BlogPost = {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
}

export default function BlogIndex({
  variant = 'home',
}: {
  variant?: 'home' | 'page'
}) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('/api/blogs', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to fetch blogs')
        if (!mounted) return
        setBlogPosts(Array.isArray(json) ? json : [])
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Failed to fetch blogs')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const visiblePosts = useMemo(() => {
    if (variant === 'home') return blogPosts.slice(0, 4)
    return blogPosts
  }, [blogPosts, variant])

  if (loading) {
    return (
      <Box id={variant === 'home' ? 'blog' : undefined} sx={{ py: 10, bgcolor: '#F7F8FA', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading blogs...</Typography>
        </Container>
      </Box>
    )
  }

  if (error) {
    return (
      <Box id={variant === 'home' ? 'blog' : undefined} sx={{ py: 10, bgcolor: '#F7F8FA' }}>
        <Container maxWidth="lg">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    )
  }

  if (visiblePosts.length === 0) {
    return null
  }

  return (
    <Box id={variant === 'home' ? 'blog' : undefined} sx={{ py: 10, bgcolor: '#F7F8FA' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
          <Typography
            variant={variant === 'home' ? 'h2' : 'h3'}
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#0C1222',
            }}
          >
            Insights & Articles
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Stay updated with the latest trends, tips, and insights from our team
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {visiblePosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={variant === 'home' ? 3 : 4} key={post.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card
                  component={Link}
                  href={`/blog/${post.id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {post.date} • {post.readTime}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Button
                        endIcon={<ArrowForwardIcon />}
                        component="span"
                        sx={{
                          textTransform: 'none',
                          color: '#0C1222',
                          fontWeight: 700,
                          p: 0,
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#2563EB',
                            transform: 'translateX(5px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {variant === 'home' && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              href="/blog"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              View All Articles
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

