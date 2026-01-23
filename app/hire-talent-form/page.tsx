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
  MenuItem,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'

const projectTypes = [
  'Web Development',
  'Mobile App Development',
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'DevOps',
  'UI/UX Design',
  'Other',
]

export default function HireTalentFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    hoursPerWeek: '',
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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not provided',
          projectType: formData.projectType || 'Not specified',
          message: `Hire Talent Request\n\nPhone: ${formData.phone}\nBudget: $${formData.budget}\nTimeline: ${formData.timeline}\nHours/Week: ${formData.hoursPerWeek}\n\nMessage: ${formData.message}`,
          source: 'hire-talent-form',
          region: 'US',
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          hoursPerWeek: '',
          message: '',
        })
      } else {
        setError('Failed to submit request. Please try again.')
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
              Hire Talent
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#6B7280',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Tell us about your project needs and we&apos;ll match you with the perfect developer.
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
                Thank you for your request! We&apos;ll review your requirements and get back to you within 24 hours.
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
                    label="Your Name"
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
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Project Type"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  >
                    {projectTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget (per hour)"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    type="number"
                    placeholder="$50-$100"
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="e.g., 3 months, 6 months"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hours per Week"
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g., 20, 40"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ mr: 1, color: '#9CA3AF' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Project Details"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={5}
                    placeholder="Describe your project, requirements, and any specific skills or experience needed..."
                    required
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#9CA3AF', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
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
                    {loading ? <CircularProgress size={24} /> : 'Submit Request'}
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
