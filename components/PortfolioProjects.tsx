'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Close as CloseIcon, Launch as LaunchIcon } from '@mui/icons-material'

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

export default function PortfolioProjects() {
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
      : projects.filter((project) => project && project.type === selectedType)

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading projects...</Typography>
      </Box>
    )
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No projects found.
        </Typography>
      </Box>
    )
  }

  return (
    <>
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

      <Grid container spacing={4}>
        {filteredProjects.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No projects found in this category.
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card
                onClick={() => {
                  setSelectedProject(project)
                  setOpenModal(true)
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
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
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=80'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                      {project.title}
                    </Typography>
                    <Chip
                      label={project.type}
                      size="small"
                      sx={{
                        backgroundColor: '#EFF6FF',
                        color: '#1E3A8A',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                    {project.tech.slice(0, 3).map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: '#F9FAFB',
                          color: '#6B7280',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

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
              {/* Project Details - Overview Section First */}
              <Box sx={{ p: 4, pb: 3 }}>
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

                {/* Overview */}
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
                    mb: 0,
                    color: '#6B7280',
                    lineHeight: 1.8,
                  }}
                >
                  {selectedProject.fullDescription || selectedProject.description}
                </Typography>
              </Box>

              {/* Project Image */}
              <Box
                sx={{
                  width: '100%',
                  maxHeight: '500px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
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
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Project Details - Technologies Section */}
              <Box sx={{ p: 4, pt: 3 }}>
                <Divider sx={{ mb: 3 }} />

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
    </>
  )
}
