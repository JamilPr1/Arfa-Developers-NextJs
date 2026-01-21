'use client'

import { useState, useRef, useEffect } from 'react'
import { Fab, Box, Paper, Typography, TextField, IconButton, CircularProgress } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: Date
}

export default function SlackChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 Welcome to Arfa Developers. Send a message and we'll connect you with a team member shortly.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string>('')
  const chatTokenRef = useRef<string>('')
  const pollCursorRef = useRef<string>('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Stable session id (persists per browser)
    if (!sessionIdRef.current && typeof window !== 'undefined') {
      const existing = window.localStorage.getItem('slackChatSessionId')
      if (existing) {
        sessionIdRef.current = existing
      } else {
        const newId = `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`
        sessionIdRef.current = newId
        window.localStorage.setItem('slackChatSessionId', newId)
      }

      const storedToken = window.localStorage.getItem('slackChatToken')
      if (storedToken) {
        chatTokenRef.current = storedToken
      }
    }

    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Poll Slack thread for agent replies while chat is open
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false

    const poll = async () => {
      if (!chatTokenRef.current) {
        console.log('[Chat Widget] No token available for polling')
        return
      }
      try {
        const params = new URLSearchParams({
          token: chatTokenRef.current,
        })
        if (pollCursorRef.current) params.set('cursor', pollCursorRef.current)

        const res = await fetch(`/api/chat/poll?${params.toString()}`, { method: 'GET' })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
          console.error('[Chat Widget] Poll request failed:', {
            status: res.status,
            statusText: res.statusText,
            error: errorData?.error || errorData?.details,
          })
          // Don't show error to user on every poll - only log it
          return
        }
        const data = await res.json()
        if (!data?.success) {
          console.error('[Chat Widget] Poll returned unsuccessful:', {
            error: data?.error,
            details: data?.details,
          })
          return
        }

        // Update cursor to latest message timestamp
        if (typeof data.cursor === 'string') {
          pollCursorRef.current = data.cursor
        }

        const newMsgs = (data.messages || []) as Array<{ id: string; text: string; ts: string }>
        if (newMsgs.length > 0) {
          console.log(`[Chat Widget] Received ${newMsgs.length} new agent messages`)
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            const additions: Message[] = newMsgs
              .filter((m) => m.id && !existingIds.has(m.id))
              .map((m) => ({
                id: m.id,
                text: m.text || '',
                sender: 'agent',
                timestamp: new Date(parseFloat(m.ts) * 1000),
              }))
            if (additions.length > 0) {
              console.log('[Chat Widget] Adding messages:', additions.map(m => m.text))
              return [...prev, ...additions]
            }
            return prev
          })
        }
      } catch (error) {
        console.error('[Chat Widget] Polling error:', error)
      }
    }

    const interval = window.setInterval(() => {
      if (!cancelled) poll()
    }, 2500)
    poll()

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)
    setIsConnecting(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          timestamp: userMessage.timestamp.toISOString(),
          sessionId: sessionIdRef.current,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          token: chatTokenRef.current || undefined,
        }),
      })

      const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }))
      
      if (response.ok && data?.success) {
        const newToken = data?.token
        const threadTs = data?.threadTs
        if (typeof newToken === 'string' && typeof window !== 'undefined') {
          chatTokenRef.current = newToken
          window.localStorage.setItem('slackChatToken', newToken)
        }
        if (typeof threadTs === 'string') {
          // Start cursor from the thread starter timestamp
          // We'll only show messages with timestamps greater than this
          pollCursorRef.current = threadTs
          console.log('[Chat Widget] Initialized polling cursor to threadTs:', threadTs)
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "✅ Thanks! Someone from our team will connect with you shortly. Please keep this chat open and feel free to send more details.",
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        // Show the actual error message from the API
        const errorText = data?.error || 'Failed to send message'
        console.error('Chat API error:', errorText, data)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `❌ ${errorText}. Please try again or contact us at +1-516-603-7838.`,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat send error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Network error: ${error instanceof Error ? error.message : 'Failed to send message'}. Please try again or contact us at +1-516-603-7838.`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
      setIsConnecting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: 100, // Stack between page bottom and WhatsApp
          right: 20,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="Chat with us"
          onClick={() => setIsOpen(true)}
          sx={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(30, 58, 138, 0.6)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ChatIcon sx={{ fontSize: 30, color: 'white' }} />
        </Fab>
      </motion.div>

      {/* Chat Modal */}
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
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '400px', maxHeight: '600px' }}
            >
              <Paper
                elevation={8}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  maxHeight: '600px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    💬 Chat with Us
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsOpen(false)}
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  {isConnecting && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Paper elevation={1} sx={{ p: 1.5, borderRadius: '12px' }}>
                        <Typography variant="body2">Connecting you with a team member…</Typography>
                      </Paper>
                    </Box>
                  )}
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '75%',
                          backgroundColor: msg.sender === 'user' ? '#1E3A8A' : msg.sender === 'agent' ? '#ffffff' : 'white',
                          color: msg.sender === 'user' ? 'white' : 'text.primary',
                          borderRadius: '12px',
                        }}
                      >
                        <Typography variant="body2">{msg.text}</Typography>
                      </Paper>
                    </Box>
                  ))}
                  {isSending && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                    size="small"
                    multiline
                    maxRows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isSending}
                    sx={{
                      backgroundColor: '#1E3A8A',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#2563EB',
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
