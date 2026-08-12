'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { motion } from 'framer-motion'
import { submitLead, detectRegion, type LeadData } from '@/lib/formHandler'
import { trackEvent } from '@/lib/analytics'
import Link from 'next/link'

const projectTypes = [
  'Web Application',
  'Mobile App',
  'Enterprise Solution',
  'E-Commerce Platform',
  'SaaS Product',
  'Other',
]

const timelineOptions = [
  'Urgent (Within 1 month)',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring',
]

const budgetOptions = [
  'Under $10,000',
  '$10,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
  'Not sure yet',
]

export default function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    timeline: '',
    budget: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCalendly, setShowCalendly] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Format message with timeline and budget if provided
    let fullMessage = formData.message
    if (formData.timeline || formData.budget) {
      const additionalInfo = []
      if (formData.timeline) {
        additionalInfo.push(`Timeline: ${formData.timeline}`)
      }
      if (formData.budget) {
        additionalInfo.push(`Budget: ${formData.budget}`)
      }
      if (fullMessage) {
        fullMessage = `${fullMessage}\n\n${additionalInfo.join('\n')}`
      } else {
        fullMessage = additionalInfo.join('\n')
      }
    }

    const leadData: LeadData = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      projectType: formData.projectType,
      message: fullMessage,
      source: 'website-form',
      region: detectRegion(),
    }

    try {
      const result = await submitLead(leadData)
      
      if (result.success) {
        setSubmitted(true)
        // Track conversion in analytics
        trackEvent('form_submission', {
          event_category: 'lead_generation',
          event_label: formData.projectType || 'general',
        })
        trackEvent('generate_lead', {
          method: 'website_form',
          project_type: formData.projectType || 'general',
        })
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFormData({
            name: '',
            email: '',
            company: '',
            projectType: '',
            timeline: '',
            budget: '',
            message: '',
          })
        }, 5000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.')
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleConsultation = async () => {
    // Submit form data before opening Calendly
    try {
      // Format message with timeline and budget if provided
      let fullMessage = formData.message
      if (formData.timeline || formData.budget) {
        const additionalInfo = []
        if (formData.timeline) {
          additionalInfo.push(`Timeline: ${formData.timeline}`)
        }
        if (formData.budget) {
          additionalInfo.push(`Budget: ${formData.budget}`)
        }
        if (fullMessage) {
          fullMessage = `${fullMessage}\n\n${additionalInfo.join('\n')}`
        } else {
          fullMessage = additionalInfo.join('\n') || 'User clicked Book a Free Consultation'
        }
      } else if (!fullMessage) {
        fullMessage = 'User clicked Book a Free Consultation'
      }

      const leadData: LeadData = {
        name: formData.name || 'Not provided',
        email: formData.email || 'Not provided',
        company: formData.company || 'Not provided',
        projectType: formData.projectType || 'Not specified',
        message: fullMessage,
        source: 'website-form-booking',
        region: detectRegion(),
      }

      console.log('[CTA] Submitting lead before opening Calendly:', leadData)

      // Submit to API (fire and forget - don't wait for response)
      submitLead(leadData).catch((error) => {
        console.error('[CTA] Error submitting lead:', error)
      })
    } catch (error) {
      console.error('[CTA] Error preparing lead data:', error)
    }

    setShowCalendly(true)
    // Track Calendly click
    trackEvent('calendly_click', {
      event_category: 'lead_generation',
      event_label: 'direct_booking',
    })
    trackEvent('generate_lead', {
      method: 'calendly',
    })
  }

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 5 }} data-aos="fade-up">
          <Typography
            component="h2"
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Ready to Start Your Project?
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            Schedule a free consultation with our experts today
          </Typography>
          <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Link href="/project-rescue" style={{ textDecoration: 'none' }}>
              <MuiLink
                component="span"
                sx={{
                  color: '#1D4ED8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#0C1222', textDecoration: 'underline' },
                }}
              >
                Need a project rescue?
              </MuiLink>
            </Link>
            <Link href="/web-development-agency-usa" style={{ textDecoration: 'none' }}>
              <MuiLink
                component="span"
                sx={{
                  color: '#1D4ED8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#0C1222', textDecoration: 'underline' },
                }}
              >
                Web development agency USA
              </MuiLink>
            </Link>
            <Link href="/hire-nextjs-developers-usa" style={{ textDecoration: 'none' }}>
              <MuiLink
                component="span"
                sx={{
                  color: '#1D4ED8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#0C1222', textDecoration: 'underline' },
                }}
              >
                Hire Next.js developers USA
              </MuiLink>
            </Link>
            <Link href="/website-maintenance-support-usa" style={{ textDecoration: 'none' }}>
              <MuiLink
                component="span"
                sx={{
                  color: '#1D4ED8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#0C1222', textDecoration: 'underline' },
                }}
              >
                Website maintenance & support USA
              </MuiLink>
            </Link>
            <Link href="/custom-software-development-usa" style={{ textDecoration: 'none' }}>
              <MuiLink
                component="span"
                sx={{
                  color: '#1D4ED8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#0C1222', textDecoration: 'underline' },
                }}
              >
                Custom software development USA
              </MuiLink>
            </Link>
          </Box>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 800,
              mx: 'auto',
              background: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 2.5, sm: 4 },
              boxShadow: 1,
            }}
            data-aos="fade-up"
          >
            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you! We&apos;ll get back to you within 24 hours. Would you like to schedule a consultation now?
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarTodayIcon />}
                    onClick={handleScheduleConsultation}
                    sx={{ mt: 1 }}
                  >
                    Schedule Free Consultation
                  </Button>
                </Box>
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
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
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  variant="outlined"
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
                  required
                  variant="outlined"
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{
                    py: { xs: 1.25, sm: 1.5 },
                    minHeight: { xs: '48px', sm: '56px' },
                    fontSize: { xs: '0.9375rem', sm: '1.05rem' },
                  }}
                >
                  {loading ? 'Submitting...' : 'Get Free Consultation'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Or schedule directly:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CalendarTodayIcon />}
                    onClick={handleScheduleConsultation}
                  >
                    Book a Free Consultation
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {showCalendly && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
            onClick={() => setShowCalendly(false)}
          >
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: { xs: 1, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                maxWidth: { xs: '95vw', sm: '900px' },
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                }}
              >
                Schedule Your Free Consultation
              </Typography>
              {/* TODO: Replace with your actual Calendly URL */}
              <Box sx={{ height: { xs: '500px', sm: '700px' } }}>
                <iframe
                  src="https://calendly.com/jawadparvez-dev"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Schedule Consultation"
                  style={{ border: 'none' }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}
