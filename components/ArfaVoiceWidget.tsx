'use client'

import { useState } from 'react'
import { Fab, Paper, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { ArfaProvider, useArfaContext } from '@/contexts/ArfaContext'
import ArfaVoicePanel from '@/components/arfa/ArfaVoicePanel'
import '@/styles/arfa-voice.css'

function ArfaVoiceWidgetInner() {
  const [isOpen, setIsOpen] = useState(false)
  const { activate, deactivate, isSpeaking, voiceState } = useArfaContext()

  const handleOpen = async () => {
    setIsOpen(true)
    await activate()
  }

  const handleClose = () => {
    deactivate()
    setIsOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              aria-label="Ask Arfa AI anything"
              onClick={handleOpen}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: 1.6, duration: 0.35 }}
              className="arfa-fab-prompt"
            >
              <span className="arfa-fab-prompt-title">Ask me anything</span>
              <span className="arfa-fab-prompt-sub">I can answer by voice</span>
            </motion.button>
          )}
        </AnimatePresence>

        <Fab
          aria-label="Talk to Arfa AI"
          onClick={handleOpen}
          sx={{
            width: 60,
            height: 60,
            flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.45)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.6)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            ...(isSpeaking || voiceState === 'listening'
              ? { animation: 'arfaPulse 2s ease-in-out infinite' }
              : {}),
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 26,
              color: 'white',
              lineHeight: 1,
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          >
            A
          </Typography>
        </Fab>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: '20px',
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '400px', height: '480px' }}
            >
              <Paper
                elevation={12}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #7c3aed 100%)',
                    color: 'white',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      Arfa AI
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Voice assistant · arfadevelopers.com
                    </Typography>
                  </Box>
                  <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <ArfaVoicePanel />
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ArfaVoiceWidget() {
  return (
    <ArfaProvider>
      <ArfaVoiceWidgetInner />
    </ArfaProvider>
  )
}
