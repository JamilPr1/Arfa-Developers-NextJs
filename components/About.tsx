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
    icon: <SecurityIcon sx={{ fontSize: 28, color: '#1D4ED8' }} />,
    title: 'Rescued Projects',
    description: 'We&apos;ve successfully rescued and rebuilt over 200+ projects that were abandoned or poorly executed by freelancers and inexperienced developers.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 28, color: '#1D4ED8' }} />,
    title: 'Fast Recovery',
    description: 'Our experienced team can quickly assess, fix, and rebuild your project, often delivering working solutions in days instead of months.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 28, color: '#1D4ED8' }} />,
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
    <Box id="about" sx={{ py: { xs: 8, md: 10 }, bgcolor: '#F5F7FA', borderTop: '1px solid #E8ECF1' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up" suppressHydrationWarning>
          <Typography component="p" className="section-label" sx={{ mb: 1.5 }}>
            About
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0C1222',
              letterSpacing: '-0.03em',
            }}
          >
            We Rescue Projects from Failed Freelancers
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748B', maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
            Our experienced team specializes in taking over and fixing projects that were abandoned, poorly executed, or left incomplete by freelancers and less experienced developers.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {rescueStories.map((story, index) => (
            <Grid item xs={12} md={4} key={story.title}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 3.5,
                    textAlign: 'left',
                    border: '1px solid #E8ECF1',
                    boxShadow: 'none',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(12,18,34,0.06)',
                      borderColor: '#D5DBE3',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  suppressHydrationWarning
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {story.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
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
            background: '#FFFFFF',
            borderRadius: '12px',
            p: { xs: 3.5, md: 5 },
            color: '#0C1222',
            mb: 6,
            border: '1px solid #E8ECF1',
          }}
          data-aos="fade-up"
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 4, 
              textAlign: 'center',
              color: '#0C1222',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Common Issues We Fix
          </Typography>
          <Grid container spacing={2}>
            {commonIssues.map((issue, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#1D4ED8', mr: 2, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: '#0C1222', fontWeight: 500, fontSize: '1rem' }}>
                    {issue}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            bgcolor: '#F7F8FA',
            borderRadius: 4,
            p: 5,
            border: '2px solid #E5E7EB',
          }}
          data-aos="fade-up"
          suppressHydrationWarning
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#0C1222', textAlign: 'center' }}>
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
