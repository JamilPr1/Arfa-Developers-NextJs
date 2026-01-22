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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
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
  projectType: string
  timeline: string
  budget: string
  description: string
  name: string
  email: string
  phone: string
}

export default function ExitIntentPopup({ onClose, onScheduleConsultation }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    timeline: '',
    budget: '',
    description: '',
    name: '',
    email: '',
    phone: '',
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

  const projectTypeOptions = [
    'Web Application',
    'Mobile App (iOS/Android)',
    'E-commerce Platform',
    'Custom Software',
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

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type'
    }
    if (!formData.timeline) {
      newErrors.timeline = 'Please select a timeline'
    }
    if (!formData.budget) {
      newErrors.budget = 'Please select a budget range'
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
      // Format message with all project details for Slack and Email
      const messageParts = []
      messageParts.push(`Phone: ${formData.phone.trim()}`)
      messageParts.push(`Timeline: ${formData.timeline}`)
      messageParts.push(`Budget: ${formData.budget}`)
      if (formData.description.trim()) {
        messageParts.push(`\nProject Description:\n${formData.description.trim()}`)
      }
      const fullMessage = messageParts.join('\n')

      // Submit lead data to API (matching LeadData interface)
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.phone.trim(), // Using company field for phone
        projectType: formData.projectType,
        message: fullMessage,
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
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              position: 'relative',
              maxHeight: '90vh',
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

          <DialogContent sx={{ p: 4 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1E3A8A' }}>
                  Wait! Get a Free Consultation
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Don&apos;t miss out on transforming your business. Schedule a free 30-minute consultation with our experts.
                </Typography>
              </Box>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  maxHeight: 'calc(90vh - 200px)', 
                  overflowY: 'auto', 
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#555',
                    },
                  },
                }}
              >
                {/* Project Type */}
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.projectType}>
                  <InputLabel>Project Type *</InputLabel>
                  <Select
                    value={formData.projectType}
                    onChange={(e) => handleChange('projectType', e.target.value)}
                    label="Project Type *"
                  >
                    {projectTypeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.projectType && <FormHelperText>{errors.projectType}</FormHelperText>}
                </FormControl>

                {/* Timeline */}
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.timeline}>
                  <InputLabel>Timeline *</InputLabel>
                  <Select
                    value={formData.timeline}
                    onChange={(e) => handleChange('timeline', e.target.value)}
                    label="Timeline *"
                  >
                    {timelineOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.timeline && <FormHelperText>{errors.timeline}</FormHelperText>}
                </FormControl>

                {/* Budget */}
                <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.budget}>
                  <InputLabel>Budget Range *</InputLabel>
                  <Select
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    label="Budget Range *"
                  >
                    {budgetOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.budget && <FormHelperText>{errors.budget}</FormHelperText>}
                </FormControl>

                {/* Description */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Project Description (Optional)"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Tell us briefly about your project..."
                />

                {/* Name */}
                <TextField
                  fullWidth
                  label="Your Name *"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  type="email"
                  label="Your Email *"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                  placeholder="your@email.com"
                />

                {/* Phone */}
                <TextField
                  fullWidth
                  type="tel"
                  label="Your Phone *"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={{ mb: 3 }}
                  placeholder="+1 (555) 123-4567"
                />

                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<CalendarTodayIcon />}
                  sx={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #1E3A8A',
                    color: '#1E3A8A',
                    py: 1.5,
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
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                No spam. Unsubscribe anytime.
              </Typography>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
