'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Chip } from '@mui/material'
import {
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    <Box id="services" sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFFFFF', borderTop: '1px solid #E8ECF1' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up" suppressHydrationWarning>
          <Typography component="p" className="section-label" sx={{ mb: 1.5 }}>
            Services
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
            What We Do
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748B', maxWidth: 560, mx: 'auto', fontWeight: 400 }}>
            Comprehensive web solutions tailored to your business needs
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Card
                  className="clean-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'none',
                    border: '1px solid #E8ECF1',
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
                  <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                    <Box
                      sx={{
                        color: '#1D4ED8',
                        mb: 2,
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        bgcolor: '#EFF4FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiSvgIcon-root': { fontSize: 26 },
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 650,
                        mb: 1.25,
                        color: '#0C1222',
                        fontSize: '1.15rem',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', lineHeight: 1.65 }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0C1222' }}>
            Explore high-intent service pages
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Link href="/project-rescue" style={{ textDecoration: 'none' }}>
              <Chip
                clickable
                label="Project Rescue"
                sx={{
                  backgroundColor: '#F5F7FA',
                  color: '#0C1222',
                  border: '1px solid #E8ECF1',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#EFF4FF', borderColor: '#1D4ED8' },
                }}
              />
            </Link>
            <Link href="/web-development-agency-usa" style={{ textDecoration: 'none' }}>
              <Chip
                clickable
                label="Web Development Agency USA"
                sx={{
                  backgroundColor: '#F5F7FA',
                  color: '#0C1222',
                  border: '1px solid #E8ECF1',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#EFF4FF', borderColor: '#1D4ED8' },
                }}
              />
            </Link>
            <Link href="/hire-nextjs-developers-usa" style={{ textDecoration: 'none' }}>
              <Chip
                clickable
                label="Hire Next.js Developers USA"
                sx={{
                  backgroundColor: '#F5F7FA',
                  color: '#0C1222',
                  border: '1px solid #E8ECF1',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#EFF4FF', borderColor: '#1D4ED8' },
                }}
              />
            </Link>
            <Link href="/website-maintenance-support-usa" style={{ textDecoration: 'none' }}>
              <Chip
                clickable
                label="Website Maintenance USA"
                sx={{
                  backgroundColor: '#F5F7FA',
                  color: '#0C1222',
                  border: '1px solid #E8ECF1',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#EFF4FF', borderColor: '#1D4ED8' },
                }}
              />
            </Link>
            <Link href="/custom-software-development-usa" style={{ textDecoration: 'none' }}>
              <Chip
                clickable
                label="Custom Software Development USA"
                sx={{
                  backgroundColor: '#F5F7FA',
                  color: '#0C1222',
                  border: '1px solid #E8ECF1',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#EFF4FF', borderColor: '#1D4ED8' },
                }}
              />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
