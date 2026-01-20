'use client'

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const rescueStories = [
  {
    icon: <SecurityIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
    title: 'Rescued Projects',
    description: 'We&apos;ve successfully rescued and rebuilt over 200+ projects that were abandoned or poorly executed by freelancers and inexperienced developers.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
    title: 'Fast Recovery',
    description: 'Our experienced team can quickly assess, fix, and rebuild your project, often delivering working solutions in days instead of months.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 50, color: '#1E3A8A' }} />,
    title: 'Ongoing Support',
    description: 'Unlike freelancers who disappear after delivery, we provide long-term support, maintenance, and continuous improvements to your project.',
  },
]

const commonIssues = [
  'Incomplete or abandoned projects',
  'Poor code quality and security vulnerabilities',
  'No documentation or handover process',
  'Missing deadlines and communication breakdowns',
  'Scalability and performance issues',
  'Lack of ongoing support and maintenance',
]

export default function About() {
  return (
    <Box id="about" sx={{ py: 10, bgcolor: '#F9FAFB' }}>
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
            We Rescue Projects from Failed Freelancers
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Our experienced team specializes in taking over and fixing projects that were abandoned, poorly executed, or left incomplete by freelancers and less experienced developers.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {rescueStories.map((story, index) => (
            <Grid item xs={12} md={4} key={story.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {story.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
                    {story.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {story.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            borderRadius: 4,
            p: 5,
            color: 'white',
            mb: 6,
          }}
          data-aos="fade-up"
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Common Issues We Fix
          </Typography>
          <Grid container spacing={2}>
            {commonIssues.map((issue, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon sx={{ color: '#F59E0B', fontSize: 28 }} />
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {issue}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            bgcolor: '#F9FAFB',
            borderRadius: 4,
            p: 5,
            border: '2px solid #E5E7EB',
          }}
          data-aos="fade-up"
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1E3A8A', textAlign: 'center' }}>
            Why Choose Us Over Freelancers?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Experienced Team
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our team has 10+ years of combined experience handling complex projects and rescuing failed implementations.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Reliable Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We don&apos;t disappear after delivery. You get ongoing support, maintenance, and continuous improvements.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Quality Assurance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Every project goes through rigorous testing, code reviews, and quality checks before delivery.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Transparent Communication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Regular updates, clear timelines, and honest communication throughout the entire project lifecycle.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
