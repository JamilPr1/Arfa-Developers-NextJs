'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { motion, AnimatePresence } from 'framer-motion'

interface ExitIntentPopupProps {
  onClose: () => void
  onScheduleConsultation: () => void
}

export default function ExitIntentPopup({ onClose, onScheduleConsultation }: ExitIntentPopupProps) {
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Track exit intent (mouse leaving viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowForm(true)
      }
    }

    // Also show after 20 seconds
    const timer = setTimeout(() => {
      setShowForm(true)
    }, 20000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShowForm(false)
    onClose()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Redirect to Calendly or open consultation form
      onScheduleConsultation()
      handleClose()
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

          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1E3A8A' }}>
                  Wait! Get a Free Consultation
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Don&apos;t miss out on transforming your business. Schedule a free 30-minute consultation with our experts.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleEmailSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  placeholder="your@email.com"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CalendarTodayIcon />}
                  sx={{
                    backgroundColor: '#F59E0B',
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#FBBF24',
                    },
                  }}
                >
                  Schedule Free Consultation
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                No spam. Unsubscribe anytime.
              </Typography>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
