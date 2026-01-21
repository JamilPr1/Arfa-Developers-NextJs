'use client'

import { Fab, Tooltip } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { motion } from 'framer-motion'

/**
 * Free/no-API "ChatGPT" option:
 * Opens ChatGPT web in a new tab. Real-time AI *inside* your site requires an API key.
 */
export default function ChatGPTButton() {
  const chatgptUrl = 'https://chat.openai.com/'

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
      style={{
        position: 'fixed',
        bottom: 100, // stack between page bottom and WhatsApp
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Chat with AI (opens ChatGPT)" placement="left">
        <Fab
          aria-label="Chat with AI"
          href={chatgptUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: 60,
            height: 60,
            color: '#fff',
            background: 'linear-gradient(135deg, #111827 0%, #0B1220 100%)',
            boxShadow: '0 4px 12px rgba(17, 24, 39, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0B1220 0%, #111827 100%)',
              boxShadow: '0 6px 16px rgba(17, 24, 39, 0.55)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <SmartToyIcon sx={{ fontSize: 30 }} />
        </Fab>
      </Tooltip>
    </motion.div>
  )
}

