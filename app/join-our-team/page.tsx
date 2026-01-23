'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'

export default function JoinOurTeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    portfolio: '',
    linkedin: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Submit to leads API with source 'join-our-team'
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.title || 'Not provided',
          projectType: 'Join Our Team',
          message: `Join Our Team Application\n\nPhone: ${formData.phone}\nTitle: ${formData.title}\nSkills: ${formData.skills}\nExperience: ${formData.experience}\nHourly Rate: $${formData.hourlyRate}\nPortfolio: ${formData.portfolio}\nLinkedIn: ${formData.linkedin}\n\nMessage: ${formData.message}`,
          source: 'join-our-team',
          region: 'US',
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          title: '',
          skills: '',
          experience: '',
          hourlyRate: '',
          portfolio: '',
          linkedin: '',
          message: '',
        })
      } else {
        setError('Failed to submit application. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Box sx={{ pt: { xs: 10, sm: 12 }, pb: 8, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
        <Container maxWidth="md">
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
              Join Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#6B7280',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Become part of our talented developer community. Work on exciting projects and grow your career.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              bgcolor: 'white',
            }}
          >
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your interest! We&apos;ll review your application and get back to you soon.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Full Stack Developer"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Skills (comma-separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, TypeScript, AWS"
                    required
                    InputProps={{
                      startAdornment: <CodeIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    type="number"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Hourly Rate ($)"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    type="number"
                    InputProps={{
                      startAdornment: <MoneyIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tell us about yourself"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Share your background, achievements, and why you want to join our team..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      bgcolor: '#1E3A8A',
                      '&:hover': { bgcolor: '#1E40AF' },
                      py: 1.5,
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit Application'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
      <CTA />
      <Footer />
    </>
  )
}
