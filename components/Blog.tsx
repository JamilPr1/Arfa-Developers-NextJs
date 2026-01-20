'use client'

import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'

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
]

export default function Blog() {
  return (
    <Box id="blog" sx={{ py: 10, bgcolor: '#F9FAFB' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#1E3A8A',
            }}
          >
            Insights & Articles
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Stay updated with the latest trends, tips, and insights from our team
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={3} key={post.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.05)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      {post.date} • {post.readTime}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: 'none',
                        color: '#1E3A8A',
                        fontWeight: 600,
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
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
