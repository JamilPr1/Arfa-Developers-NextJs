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
  TextField,
  MenuItem,
  Slider,
  InputAdornment,
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
  country?: string
  published: boolean
}

export default function HireTalentPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('All')
  const [rateRange, setRateRange] = useState<number[]>([0, 200])
  const [minRating, setMinRating] = useState<number>(0)

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

  const countries = Array.from(
    new Set((talents || []).map((t) => (t.country || '').trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const filteredTalents = (talents || []).filter((t) => {
    const q = search.trim().toLowerCase()
    const matchesQuery =
      !q ||
      t.name?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q) ||
      (t.skills || []).some((s) => String(s).toLowerCase().includes(q)) ||
      (t.country || '').toLowerCase().includes(q)

    const matchesCountry = countryFilter === 'All' || (t.country || '').trim() === countryFilter
    const matchesRate = (t.hourlyRate || 0) >= rateRange[0] && (t.hourlyRate || 0) <= rateRange[1]
    const matchesRating = (t.rating || 0) >= minRating

    return matchesQuery && matchesCountry && matchesRate && matchesRating
  })

  const displayedTalents = showAll ? filteredTalents : filteredTalents.slice(0, 10)

  return (
    <>
      <Header />
      
      {/* Hero Section - Matching Homepage Design */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
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
            background: 'radial-gradient(circle at 100% 0%, rgba(29,78,216,0.06) 0%, transparent 50%)',
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
                color: '#0C1222',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                textAlign: 'center',
              }}
              data-aos="fade-up"
            >
              Hire Our{' '}
              <Box component="span" sx={{ color: '#1D4ED8' }}>
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
                color: '#64748B',
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
      <Box sx={{ py: 10, bgcolor: '#F7F8FA' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#0C1222',
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
              {/* Filters */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: '#0C1222',
                  borderRadius: 2,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      label="Search (name, skills, title)"
                      placeholder="e.g., Next.js, DevOps, React"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {countries.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Min rating"
                      value={minRating}
                      onChange={(e) => setMinRating(Math.min(5, Math.max(0, Number(e.target.value || 0))))}
                      InputProps={{
                        inputProps: { min: 0, max: 5, step: 0.1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0C1222', mb: 0.5 }}>
                      Hourly rate (${rateRange[0]}–${rateRange[1]})
                    </Typography>
                    <Slider
                      value={rateRange}
                      onChange={(_, v) => setRateRange(v as number[])}
                      valueLabelDisplay="auto"
                      min={0}
                      max={200}
                      step={5}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary">
                        Showing <b>{filteredTalents.length}</b> profiles
                      </Typography>
                      <Button
                        variant="text"
                        onClick={() => {
                          setSearch('')
                          setCountryFilter('All')
                          setRateRange([0, 200])
                          setMinRating(0)
                          setShowAll(false)
                        }}
                      >
                        Reset filters
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

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
                              position: 'relative',
                              bgcolor: '#E5E7EB',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                            }}
                          >
                            {talent.image ? (
                              <Box
                                component="img"
                                src={talent.image}
                                alt={talent.name}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#0C1222',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    px: 2,
                                  }}
                                >
                                  {talent.name.charAt(0).toUpperCase()}
                                </Typography>
                              </Box>
                            )}
                            {/* Top Rated Badge */}
                            {talent.rating && talent.rating >= 4.5 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  bgcolor: 'hsl(210, 98%, 48%)',
                                  color: '#0C1222',
                                  borderRadius: 1,
                                  px: 1.5,
                                  py: 0.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                                  zIndex: 2,
                                }}
                              >
                                <StarIcon sx={{ fontSize: 16 }} />
                                Top Rated
                              </Box>
                            )}
                            {/* Rating Badge */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: '#64748B',
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
                                color: '#0C1222',
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
                            {(talent.country || talent.location) && (
                              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {talent.country && (
                                  <Chip label={talent.country} size="small" variant="outlined" />
                                )}
                                {talent.location && (
                                  <Chip label={talent.location} size="small" variant="outlined" />
                                )}
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Box>
                                <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                                  Hourly Rate
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0C1222' }}>
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
                      borderColor: '#0C1222',
                      color: '#0C1222',
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
      <Box sx={{ py: 8, bgcolor: '#0C1222' }}>
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
                  color: '#0C1222',
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
                    bgcolor: '#0C1222',
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
                    borderColor: '#0C1222',
                    color: '#0C1222',
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
          background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
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
                  color: '#0C1222',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Limited Time Offer
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748B',
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
                        color: '#0C1222',
                        mb: 1,
                      }}
                    >
                      {countdown.days}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
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
                        color: '#0C1222',
                        mb: 1,
                      }}
                    >
                      {countdown.hours}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
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
                        color: '#0C1222',
                        mb: 1,
                      }}
                    >
                      {countdown.minutes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
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
                        color: '#0C1222',
                        mb: 1,
                      }}
                    >
                      {countdown.seconds}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
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
      <Box sx={{ py: 8, bgcolor: '#F7F8FA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 1 }}>
                  {talents.length}+
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Expert Developers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 1 }}>
                  {talents.reduce((sum, t) => sum + (t.projectsCompleted || 0), 0)}+
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Projects Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 1 }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#0C1222', mb: 0.5 }}>
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
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0C1222', mb: 2 }}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedTalent.skills?.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      sx={{
                        bgcolor: '#EFF6FF',
                        color: '#0C1222',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0C1222', mb: 2 }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                  {selectedTalent.description || 'No description available.'}
                </Typography>
              </Box>

              {selectedTalent.experience && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0C1222', mb: 2 }}>
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
                      bgcolor: '#F7F8FA',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <MoneyIcon sx={{ fontSize: 32, color: '#0C1222', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                      Hourly Rate
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#0C1222' }}>
                      ${selectedTalent.hourlyRate}/hr
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F7F8FA',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <WorkIcon sx={{ fontSize: 32, color: '#0C1222', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                      Projects Completed
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#0C1222' }}>
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
                sx={{ bgcolor: '#0C1222', '&:hover': { bgcolor: '#1E40AF' } }}
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
