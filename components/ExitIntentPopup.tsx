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
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  }

  const handleBookConsultation = async () => {
    setIsSubmitting(true)

    try {
      // Submit lead data to API (matching LeadData interface)
      const leadData = {
        name: formData.name.trim() || 'Not provided',
        email: formData.email.trim() || 'Not provided',
        company: formData.company.trim() || 'Not provided',
        projectType: formData.projectType || 'Not specified',
        message: formData.message.trim() || 'User clicked Book a Free Consultation',
        source: 'exit-intent-popup',
        region: typeof window !== 'undefined' ? detectRegion() : 'US',
      }

      console.log('[Exit Popup] Submitting lead before opening Calendly:', leadData)

      // Submit to API and wait for response
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      const result = await response.json()
      console.log('[Exit Popup] API response:', result)

      if (!response.ok) {
        console.error('[Exit Popup] ❌ Lead submission failed:', result)
      } else {
        console.log('[Exit Popup] ✅ Lead submitted successfully')
      }

      // Close popup
      handleClose()
      
      // Open Calendly in new tab after a brief delay
      setTimeout(() => {
        window.open('https://calendly.com/jawadparvez-dev', '_blank')
      }, 300)
    } catch (error) {
      console.error('[Exit Popup] Error:', error)
      // Still proceed to open Calendly even if submission fails
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
              borderRadius: { xs: 2, sm: 3 },
              position: 'relative',
              maxHeight: '90vh',
              m: { xs: 1, sm: 2 },
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

          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1, 
                    color: '#1E3A8A',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  Ready to Start Your Project?
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  }}
                >
                  Schedule a free consultation with our experts today
                </Typography>
              </Box>

              <Box>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
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
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={<CalendarTodayIcon />}
                      onClick={handleBookConsultation}
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid #1E3A8A',
                        color: '#1E3A8A',
                        py: { xs: 1.25, sm: 1.2 },
                        minHeight: { xs: '48px', sm: '56px' },
                        fontSize: { xs: '0.9375rem', sm: '1rem' },
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#EFF6FF',
                          borderColor: '#1E40AF',
                          color: '#1E40AF',
                        },
                        '&:disabled': {
                          backgroundColor: '#F3F4F6',
                          borderColor: '#D1D5DB',
                          color: '#9CA3AF',
                        },
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Book a Free Consultation'}
                    </Button>
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
