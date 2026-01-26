'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Divider
} from '@mui/material'
import { Close as CloseIcon, Launch as LaunchIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import SimpleCarousel from './SimpleCarousel'

interface Project {
  id: number
  title: string
  type: string
  image: string
  url?: string
  tech: string[]
  description: string
  fullDescription?: string
}

const projectTypes = ['All', 'Web App', 'Mobile App', 'Enterprise']

export default function Portfolio() {
  const [selectedType, setSelectedType] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects =
    selectedType === 'All'
      ? projects
      : projects.filter((project) => project.type === selectedType)

  if (loading) {
    return (
      <Box id="portfolio" sx={{ py: 10, bgcolor: '#FFFFFF', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography>Loading projects...</Typography>
        </Container>
      </Box>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <Box id="portfolio" sx={{ py: 10, bgcolor: '#FFFFFF', overflow: 'visible', position: 'relative' }}>
      <Container maxWidth="lg" sx={{ overflow: 'visible', position: 'relative' }}>
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

        <Box sx={{ 
          display: { xs: 'none', md: 'block' }, 
          overflow: 'visible', 
          position: 'relative',
          width: '100%',
          mx: 'auto',
        }}>
          <SimpleCarousel
            items={filteredProjects}
            autoPlay={true}
            autoPlayInterval={2500}
            showDots={true}
            showArrows={true}
            renderItem={(project, index, isActive) => (
              <motion.div
                whileHover={isActive ? { scale: 1.02 } : {}}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onClick={() => {
                    if (isActive) {
                      setSelectedProject(project)
                      setOpenModal(true)
                    }
                  }}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: isActive ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isActive
                      ? '0 20px 40px rgba(0,0,0,0.2)'
                      : '0 10px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    borderRadius: 3,
                    backgroundColor: 'white',
                    '&:hover': isActive ? {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
                    } : {},
                  }}
                  data-aos="fade-up"
                  suppressHydrationWarning
                >
                  <Box sx={{ position: 'relative', flex: 1, minHeight: '280px' }}>
                    <Box
                      component="img"
                      src={project.image}
                      alt={project.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=80'
                      }}
                      sx={{ 
                        objectFit: 'cover', 
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f0f0f0',
                        display: 'block',
                      }}
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
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {project.tech.slice(0, 3).map((tech: string) => (
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
            )}
          />
        </Box>

        <Grid container spacing={3} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <Card
                onClick={() => {
                  setSelectedProject(project)
                  setOpenModal(true)
                }}
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
                data-aos="fade-up"
              >
                <Box
                  component="img"
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=80'
                  }}
                  sx={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    display: 'block',
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {project.tech.map((tech: string) => (
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

      {/* Project Detail Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3A8A' }}>
            {selectedProject?.title}
          </Typography>
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedProject && (
            <Box>
              {/* Project Image */}
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=80'
                  }}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Project Details */}
              <Box sx={{ p: 4 }}>
                {/* Type and URL */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    label={selectedProject.type}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  {selectedProject.url && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<LaunchIcon />}
                      sx={{
                        borderColor: '#1E3A8A',
                        color: '#1E3A8A',
                        '&:hover': {
                          borderColor: '#2563EB',
                          backgroundColor: 'rgba(30, 58, 138, 0.04)',
                        },
                      }}
                    >
                      View Project
                    </Button>
                  )}
                </Box>

                {/* Description */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#111827',
                  }}
                >
                  Overview
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: '#6B7280',
                    lineHeight: 1.8,
                  }}
                >
                  {selectedProject.fullDescription || selectedProject.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Technologies */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#111827',
                  }}
                >
                  Technologies Used
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedProject.tech.map((tech: string) => (
                    <Chip
                      key={tech}
                      label={tech}
                      sx={{
                        backgroundColor: '#F3F4F6',
                        color: '#1E3A8A',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#E5E7EB',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
