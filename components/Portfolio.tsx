'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Tabs, Tab, Chip } from '@mui/material'
import { motion } from 'framer-motion'

const Slider = dynamic(() => import('react-slick'), { ssr: false })

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    tech: ['React', 'Node.js', 'MongoDB'],
    description: 'Scalable e-commerce solution with real-time inventory management',
  },
  {
    id: 2,
    title: 'Healthcare Management System',
    type: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    description: 'HIPAA-compliant healthcare platform for patient management',
  },
  {
    id: 3,
    title: 'FinTech Mobile App',
    type: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    tech: ['React Native', 'Firebase', 'Stripe'],
    description: 'Secure mobile banking application with biometric authentication',
  },
  {
    id: 4,
    title: 'SaaS Dashboard',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    tech: ['Vue.js', 'Python', 'AWS'],
    description: 'Analytics dashboard for SaaS businesses with real-time metrics',
  },
  {
    id: 5,
    title: 'Real Estate Platform',
    type: 'Web App',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    tech: ['Next.js', 'GraphQL', 'MongoDB'],
    description: 'Property listing platform with virtual tour integration',
  },
  {
    id: 6,
    title: 'Education LMS',
    type: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    tech: ['React', 'Django', 'PostgreSQL'],
    description: 'Learning management system for online education',
  },
]

const projectTypes = ['All', 'Web App', 'Mobile App', 'Enterprise']

export default function Portfolio() {
  const [selectedType, setSelectedType] = useState('All')

  const filteredProjects =
    selectedType === 'All'
      ? projects
      : projects.filter((project) => project.type === selectedType)

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Box id="portfolio" sx={{ py: 10, bgcolor: '#FFFFFF' }}>
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
            Our Work
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Showcasing innovative solutions that drive business success
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Tabs
            value={selectedType}
            onChange={(e, newValue) => setSelectedType(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            {projectTypes.map((type) => (
              <Tab key={type} label={type} value={type} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Slider {...sliderSettings}>
            {filteredProjects.map((project) => (
              <Box key={project.id} sx={{ px: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    data-aos="fade-up"
                  >
                    <Box sx={{ position: 'relative', flex: 1 }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={project.image}
                        alt={project.title}
                        sx={{ objectFit: 'cover', width: '100%' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                          p: 2,
                          color: 'white',
                          zIndex: 2,
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          }}
                        >
                          {project.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 2,
                            color: 'rgba(255,255,255,0.95)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}
                        >
                          {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {project.tech.map((tech) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              sx={{
                                background: 'rgba(255,255,255,0.25)',
                                color: 'white',
                                fontWeight: 500,
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    <CardContent sx={{ pt: 1, pb: 2 }}>
                      <Chip 
                        label={project.type} 
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Slider>
        </Box>

        <Grid container spacing={3} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                data-aos="fade-up"
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {project.tech.map((tech) => (
                      <Chip key={tech} label={tech} size="small" />
                    ))}
                  </Box>
                  <Chip label={project.type} size="small" color="primary" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
