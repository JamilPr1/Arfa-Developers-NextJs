'use client'

import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material'
import {
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const services = [
  {
    icon: <WebIcon sx={{ fontSize: 50 }} />,
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks like React, Next.js, and Vue.js. Scalable, fast, and user-friendly.',
  },
  {
    icon: <MobileIcon sx={{ fontSize: 50 }} />,
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android. React Native and Flutter expertise.',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 50 }} />,
    title: 'Cloud Solutions',
    description: 'AWS, Azure, and GCP cloud infrastructure setup and management. Scalable cloud architectures for your business.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 50 }} />,
    title: 'Data Analytics',
    description: 'Business intelligence and data analytics solutions. Transform your data into actionable insights.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50 }} />,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security solutions. GDPR, HIPAA, and SOC 2 compliance implementation.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50 }} />,
    title: 'Performance Optimization',
    description: 'Speed up your applications with advanced optimization techniques. Improve SEO and user experience.',
  },
]

export default function Services() {
  return (
    <Box id="services" sx={{ py: 10, bgcolor: '#F9FAFB' }}>
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
            What We Do
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Comprehensive web solutions tailored to your business needs
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.title}>
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
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.05)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box
                      sx={{
                        color: '#1E3A8A',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        '&:hover': {
                          color: '#2563EB',
                        },
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
