'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SendIcon from '@mui/icons-material/Send'
import { motion, AnimatePresence } from 'framer-motion'
import { detectRegion } from '@/lib/formHandler'

interface ExitIntentPopupProps {
  onClose: () => void
  onScheduleConsultation: () => void
}

interface FormData {
  name: string
  email: string
  company: string
  projectType: string
  message: string
}

const projectTypes = [
  'Web Application',
  'Mobile App',
  'Enterprise Solution',
  'E-Commerce Platform',
  'SaaS Product',
  'Other',
]

export default function ExitIntentPopup({ onClose, onScheduleConsultation }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const hasShownRef = useRef(false)

  useEffect(() => {
    // This component is client-only, but guard anyway
    if (typeof window === 'undefined') return

    hasShownRef.current = window.localStorage.getItem('exitIntentPopupShown') === 'true'
    if (hasShownRef.current) return

    const markShownAndOpen = () => {
      if (hasShownRef.current) return
      hasShownRef.current = true
      window.localStorage.setItem('exitIntentPopupShown', 'true')
      setShowForm(true)
    }

    // Track exit intent (mouse leaving viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        markShownAndOpen()
      }
    }

    // Also show after 20 seconds (only once)
    const timer = window.setTimeout(() => {
      markShownAndOpen()
    }, 20000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShowForm(false)
    hasShownRef.current = true
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('exitIntentPopupShown', 'true')
    }
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit lead data to API (matching LeadData interface)
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        projectType: formData.projectType,
        message: formData.message.trim(),
        source: 'exit-intent-popup',
        region: typeof window !== 'undefined' ? detectRegion() : 'US',
      }

      console.log('[Exit Popup] Submitting lead:', leadData)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('[Exit Popup] Lead submitted successfully to Slack and Email')
        // Mark as shown and close
        hasShownRef.current = true
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('exitIntentPopupShown', 'true')
        }
        // Close popup first
        handleClose()
        // Open Calendly in new tab after a brief delay to ensure lead is sent
        setTimeout(() => {
          window.open('https://calendly.com/jawadparvez-dev', '_blank')
        }, 300)
      } else {
        console.error('[Exit Popup] Lead submission failed:', result.error)
        // Still proceed to open Calendly even if API fails
        handleClose()
        setTimeout(() => {
          window.open('https://calendly.com/jawadparvez-dev', '_blank')
        }, 300)
      }
    } catch (error) {
      console.error('[Exit Popup] Error submitting lead:', error)
      // Still proceed to open Calendly
      handleClose()
      setTimeout(() => {
        window.open('https://calendly.com/jawadparvez-dev', '_blank')
      }, 300)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {showForm && (
        <Dialog
          open={showForm}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              position: 'relative',
              maxHeight: '85vh',
            },
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ p: 3 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1E3A8A' }}>
                  Ready to Start Your Project?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Schedule a free consultation with our experts today
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company *"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      error={!!errors.company}
                      helperText={errors.company}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Project Type *"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                      error={!!errors.projectType}
                      helperText={errors.projectType}
                      variant="outlined"
                      size="small"
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
                      rows={3}
                      label="Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      error={!!errors.message}
                      helperText={errors.message}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      endIcon={isSubmitting ? null : <SendIcon />}
                      sx={{
                        py: 1.2,
                        backgroundColor: '#F59E0B',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#FBBF24',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get Free Consultation'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                        Or schedule directly:
                      </Typography>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<CalendarTodayIcon />}
                        onClick={(e) => {
                          e.preventDefault()
                          handleClose()
                          setTimeout(() => {
                            window.open('https://calendly.com/jawadparvez-dev', '_blank')
                          }, 300)
                        }}
                        sx={{
                          backgroundColor: 'white',
                          border: '1px solid #1E3A8A',
                          color: '#1E3A8A',
                          '&:hover': {
                            backgroundColor: '#EFF6FF',
                            borderColor: '#1E40AF',
                            color: '#1E40AF',
                          },
                        }}
                      >
                        Book a Free Consultation
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
