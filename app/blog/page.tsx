import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Blog - Web Development Insights & Best Practices | Arfa Developers',
  description: 'Read our latest articles on web development, best practices, project management, and technology trends. Learn from our experience rescuing and building successful projects.',
  keywords: [
    'web development blog',
    'web development best practices',
    'project management',
    'technology trends',
    'software development tips',
    'coding tutorials',
    'web development insights',
  ],
  openGraph: {
    title: 'Blog - Web Development Insights & Best Practices | Arfa Developers',
    description: 'Read our latest articles on web development, best practices, and technology trends.',
    type: 'website',
    url: 'https://arfadevelopers.com/blog',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/blog',
  },
}

const blogPosts = [
  {
    id: 1,
    title: '10 Best Practices for Modern Web Development in 2024',
    excerpt: 'Discover the latest trends and best practices that will shape web development this year.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    date: 'January 15, 2024',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Scaling Your Application: A Complete Guide',
    excerpt: 'Learn how to build scalable applications that can grow with your business needs.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    date: 'January 10, 2024',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'The Future of Cloud Computing in Enterprise',
    excerpt: 'Exploring how cloud technologies are transforming enterprise software development.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    date: 'January 5, 2024',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Security First: Building Secure Web Applications',
    excerpt: 'Essential security practices every developer should implement in their applications.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    date: 'December 28, 2023',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Rescuing Failed Projects: A Step-by-Step Guide',
    excerpt: 'Learn how we assess, fix, and rebuild projects that were abandoned or poorly executed.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    date: 'December 20, 2023',
    readTime: '10 min read',
  },
  {
    id: 6,
    title: 'Choosing the Right Tech Stack for Your Project',
    excerpt: 'A comprehensive guide to selecting the best technologies for your web application.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    date: 'December 15, 2023',
    readTime: '6 min read',
  },
]

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Arfa Developers Blog',
  description: 'Web development insights, best practices, and technology trends',
  blogPost: blogPosts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.image,
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
      name: 'Blog',
      item: 'https://arfadevelopers.com/blog',
    },
  ],
}

export default function BlogPage() {
  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
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
                Blog
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
              Insights, best practices, and technology trends from our development team.
            </Typography>
          </Container>
        </Box>

        {/* Blog Posts */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {blogPosts.map((post) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
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
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {post.date} • {post.readTime}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1E3A8A',
                        flexGrow: 1,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        alignSelf: 'flex-start',
                        color: '#1E3A8A',
                        fontWeight: 600,
                        '&:hover': {
                          color: '#2563EB',
                        },
                      }}
                    >
                      Read More
                    </Button>
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
