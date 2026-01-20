'use client'

import { Fab } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  const phoneNumber = '5166037838' // US format without + or spaces
  const whatsappUrl = `https://wa.me/1${phoneNumber}`

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Fab
        color="success"
        aria-label="WhatsApp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          width: 60,
          height: 60,
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(37, 211, 102, 0.6)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </motion.div>
  )
}
