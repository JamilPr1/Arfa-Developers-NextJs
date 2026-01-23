'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
} from '@mui/material'
import {
  Star as StarIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
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
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    fetchTalents()
    // Set countdown to 7 days from now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
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
      
      {/* Hero Section - Matching Homepage Design */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: 10,
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.5 },
              '50%': { opacity: 1 },
            },
          }}
        />

        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                textAlign: 'center',
              }}
              data-aos="fade-up"
            >
              Hire Our{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Top Talent
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Access top-rated developers at flat hourly rates. Save money while getting world-class talent.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Profile Cards Section */}
      <Box sx={{ py: 10, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1E3A8A',
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
            data-aos="fade-up"
          >
            Top Rated Developers
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {displayedTalents.length > 0 ? (
                  displayedTalents.map((talent) => (
                    <Grid item xs={12} sm={6} md={4} key={talent.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                            },
                          }}
                          onClick={() => handleOpenDialog(talent)}
                        >
                          <Box
                            sx={{
                              height: 200,
                              backgroundImage: `url(${talent.image || '/api/placeholder/300/200'})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                              bgcolor: '#E5E7EB',
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
                          </Box>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Box>
                                <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                                  Hourly Rate
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                                  ${talent.hourlyRate}/hr
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  // Empty state cards - show placeholder cards
                  Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`empty-${index}`}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          opacity: 0.6,
                        }}
                      >
                        <Box
                          sx={{
                            height: 200,
                            bgcolor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Avatar sx={{ width: 80, height: 80, bgcolor: '#9CA3AF' }}>
                            <WorkIcon />
                          </Avatar>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#9CA3AF',
                              mb: 1,
                            }}
                          >
                            Available Soon
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#9CA3AF',
                              mb: 2,
                            }}
                          >
                            Developer Profile
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 0.5 }}>
                                Hourly Rate
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#9CA3AF' }}>
                                $--/hr
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
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

      {/* Buttons Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1E3A8A',
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Ready to Hire?
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
                    fontSize: '1rem',
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
                    fontSize: '1rem',
                  }}
                >
                  Join Our Team
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Countdown Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Limited Time Offer
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Special rates available for the next
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                      }}
                    >
                      {countdown.days}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Days
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                      }}
                    >
                      {countdown.hours}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                      }}
                    >
                      {countdown.minutes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                      }}
                    >
                      {countdown.seconds}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Seconds
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                  {talents.length}+
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Expert Developers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                  {talents.reduce((sum, t) => sum + (t.projectsCompleted || 0), 0)}+
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Projects Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 1 }}>
                  {talents.length > 0 ? (talents.reduce((sum, t) => sum + (t.rating || 0), 0) / talents.length).toFixed(1) : '0.0'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Average Rating
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
