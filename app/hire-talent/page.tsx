'use client'

import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Rating,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material'
import {
  Star as StarIcon,
  Close as CloseIcon,
  Code as CodeIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'

interface Talent {
  id: number
  name: string
  title: string
  image: string
  skills: string[]
  hourlyRate: number
  rating: number
  projectsCompleted: number
  description: string
  experience: string
  location?: string
  published: boolean
}

export default function HireTalentPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    try {
      const response = await fetch(`/api/talent?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        setTalents(data)
      }
    } catch (error) {
      console.error('Error fetching talents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (talent: Talent) => {
    setSelectedTalent(talent)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedTalent(null)
  }

  const displayedTalents = showAll ? talents : talents.slice(0, 10)

  return (
    <>
      <Header />
      <Box sx={{ pt: { xs: 10, sm: 12 }, pb: 8, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#1E3A8A',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Hire Our Talent
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#6B7280',
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              Access top-rated developers at flat hourly rates. Save money while getting world-class talent.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/hire-talent-form"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#1E3A8A',
                  '&:hover': { bgcolor: '#1E40AF' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Hire Talent Now
              </Button>
              <Button
                component={Link}
                href="/join-our-team"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#1E3A8A',
                  color: '#1E3A8A',
                  '&:hover': { borderColor: '#1E40AF', bgcolor: 'rgba(30, 58, 138, 0.1)' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Join Our Team
              </Button>
            </Box>
          </Box>

          {/* Stats Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                    {talents.length}+
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280' }}>
                    Expert Developers
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                    {talents.reduce((sum, t) => sum + (t.projectsCompleted || 0), 0)}+
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280' }}>
                    Projects Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                    {talents.length > 0 ? (talents.reduce((sum, t) => sum + (t.rating || 0), 0) / talents.length).toFixed(1) : '0.0'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280' }}>
                    Average Rating
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Talents Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: '#1E3A8A',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                Top Rated Developers
              </Typography>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {displayedTalents.map((talent) => (
                  <Grid item xs={12} sm={6} md={4} key={talent.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                      onClick={() => handleOpenDialog(talent)}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          backgroundImage: `url(${talent.image || '/api/placeholder/300/200'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <StarIcon sx={{ color: '#FBBF24', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {talent.rating?.toFixed(1) || '0.0'}
                          </Typography>
                        </Box>
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1E3A8A',
                            mb: 1,
                          }}
                        >
                          {talent.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6B7280',
                            mb: 2,
                          }}
                        >
                          {talent.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {talent.skills?.slice(0, 3).map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: '#EFF6FF',
                                color: '#1E3A8A',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                          {talent.skills && talent.skills.length > 3 && (
                            <Chip
                              label={`+${talent.skills.length - 3}`}
                              size="small"
                              sx={{
                                bgcolor: '#F3F4F6',
                                color: '#6B7280',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                              Hourly Rate
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                              ${talent.hourlyRate}/hr
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                              Projects
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                              {talent.projectsCompleted || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {talents.length > 10 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setShowAll(!showAll)}
                    sx={{
                      borderColor: '#1E3A8A',
                      color: '#1E3A8A',
                      '&:hover': { borderColor: '#1E40AF', bgcolor: 'rgba(30, 58, 138, 0.1)' },
                      px: 4,
                    }}
                  >
                    {showAll ? 'Show Less' : `View All ${talents.length} Profiles`}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Talent Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        {selectedTalent && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src={selectedTalent.image}
                    alt={selectedTalent.name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E3A8A', mb: 0.5 }}>
                      {selectedTalent.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280', mb: 1 }}>
                      {selectedTalent.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={selectedTalent.rating || 0} readOnly precision={0.1} size="small" />
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        ({selectedTalent.rating?.toFixed(1) || '0.0'})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A', mb: 2 }}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedTalent.skills?.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      sx={{
                        bgcolor: '#EFF6FF',
                        color: '#1E3A8A',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A', mb: 2 }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                  {selectedTalent.description || 'No description available.'}
                </Typography>
              </Box>

              {selectedTalent.experience && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A', mb: 2 }}>
                    Experience
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                    {selectedTalent.experience}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F9FAFB',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <MoneyIcon sx={{ fontSize: 32, color: '#1E3A8A', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                      Hourly Rate
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                      ${selectedTalent.hourlyRate}/hr
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F9FAFB',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <WorkIcon sx={{ fontSize: 32, color: '#1E3A8A', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                      Projects Completed
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                      {selectedTalent.projectsCompleted || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>
              <Button
                component={Link}
                href="/hire-talent-form"
                variant="contained"
                sx={{ bgcolor: '#1E3A8A', '&:hover': { bgcolor: '#1E40AF' } }}
              >
                Hire This Talent
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <CTA />
      <Footer />
    </>
  )
}
