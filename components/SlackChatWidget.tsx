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

interface LeadInfo {
  projectType?: string
  timeline?: string
  budget?: string
  name?: string
  email?: string
  projectDetails?: string
}

export default function SlackChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({})
  const [questionStep, setQuestionStep] = useState<number>(0)
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [isCollectingContactInfo, setIsCollectingContactInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string>('')
  const chatTokenRef = useRef<string>('')
  const pollCursorRef = useRef<string>('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const questions = [
    {
      id: 'projectType',
      question: 'What type of project are you looking for?',
      options: [
        'Web Application',
        'Mobile App (iOS/Android)',
        'E-commerce Platform',
        'Custom Software',
        'Other',
      ],
    },
    {
      id: 'timeline',
      question: 'What\'s your timeline?',
      options: [
        'Urgent (Within 1 month)',
        '1-3 months',
        '3-6 months',
        '6+ months',
        'Just exploring',
      ],
    },
    {
      id: 'budget',
      question: 'What\'s your approximate budget range?',
      options: [
        'Under $10,000',
        '$10,000 - $50,000',
        '$50,000 - $100,000',
        '$100,000+',
        'Not sure yet',
      ],
    },
  ]

  useEffect(() => {
    // Stable session id (persists per browser)
    if (typeof window !== 'undefined') {
      if (!sessionIdRef.current) {
        const existing = window.localStorage.getItem('slackChatSessionId')
        if (existing) {
          sessionIdRef.current = existing
        } else {
          const newId = `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`
          sessionIdRef.current = newId
          window.localStorage.setItem('slackChatSessionId', newId)
        }
      }

      // Always check for stored token and restore it
      const storedToken = window.localStorage.getItem('slackChatToken')
      if (storedToken && !chatTokenRef.current) {
        chatTokenRef.current = storedToken
        setIsQuestionnaireComplete(true) // If token exists, questionnaire was already completed
        console.log('[Chat Widget] Restored token from localStorage')
      }
      
      // Check if questionnaire was completed
      const completed = window.localStorage.getItem('slackChatQuestionnaireComplete')
      if (completed === 'true') {
        setIsQuestionnaireComplete(true)
      }
    }

    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, questionStep])
  
  // Initialize welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (isQuestionnaireComplete) {
        // Questionnaire already completed
        setMessages([
          {
            id: '1',
            text: "Hi! 👋 Thanks for providing your project details. Send a message and we'll connect you with a team member shortly.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ])
      } else {
        // Start questionnaire - reset to first question
        setQuestionStep(0)
        setMessages([
          {
            id: '1',
            text: "Hi! 👋 Welcome to Arfa Developers. Let's start with a few quick questions to understand your project better.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ])
        // Question will be shown by the questionnaire component
      }
    }
  }, [isOpen])

  // Poll Slack thread for agent replies while chat is open
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    let pollAttempts = 0

    const poll = async () => {
      if (!chatTokenRef.current) {
        console.log('[Chat Widget] ❌ No token available for polling')
        return
      }
      
      pollAttempts++
      const pollStartTime = Date.now()
      
      console.log(`[Chat Widget] 🔄 Poll attempt #${pollAttempts} starting...`, {
        hasToken: !!chatTokenRef.current,
        tokenLength: chatTokenRef.current.length,
        cursor: pollCursorRef.current || 'none',
        timestamp: new Date().toISOString(),
        currentMessages: messages.length,
      })
      
      // Add a delay for the first few polls to give Slack time to index the thread
      if (pollAttempts <= 3) {
        const delay = 2000 * pollAttempts
        console.log(`[Chat Widget] ⏳ Waiting ${delay}ms before poll (attempt ${pollAttempts})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      try {
        const params = new URLSearchParams({
          token: chatTokenRef.current,
        })
        if (pollCursorRef.current) {
          params.set('cursor', pollCursorRef.current)
          console.log(`[Chat Widget] 📍 Using cursor: ${pollCursorRef.current}`)
        } else {
          console.log(`[Chat Widget] 📍 No cursor - will fetch all messages from thread`)
        }

        const pollUrl = `/api/chat/poll?${params.toString()}`
        console.log(`[Chat Widget] 🌐 Fetching: ${pollUrl.substring(0, 100)}...`)
        
        const res = await fetch(pollUrl, { method: 'GET' })
        const fetchTime = Date.now() - pollStartTime
        
        console.log(`[Chat Widget] 📥 Response received (${fetchTime}ms):`, {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          contentType: res.headers.get('content-type'),
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }))
          const errorMsg = errorData?.error || errorData?.details || 'Unknown error'
          
          console.error('[Chat Widget] ❌ Poll request failed:', {
            status: res.status,
            statusText: res.statusText,
            error: errorMsg,
            details: errorData?.details,
            retry: errorData?.retry,
            fullResponse: errorData,
          })
          
          // If it's a retry-able error (like thread indexing), don't clear token
          if (errorData?.retry && errorMsg.includes('not be indexed yet')) {
            console.log('[Chat Widget] ⏳ Thread not indexed yet, will retry on next poll')
            return // Continue polling, will retry
          }
          
          // If token is invalid or thread not found, clear it and stop polling
          if (res.status === 401 || errorMsg.includes('Invalid token') || (errorMsg.includes('Thread not found') && !errorData?.retry)) {
            console.error('[Chat Widget] 🚨 CRITICAL: Poll failed, clearing token:', errorMsg)
            chatTokenRef.current = ''
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('slackChatToken')
            }
            return
          }
          
          // For other errors, just log and continue polling
          return
        }
        
        const data = await res.json()
        console.log(`[Chat Widget] 📦 Poll response data:`, {
          success: data.success,
          messageCount: data.messages?.length || 0,
          cursor: data.cursor || 'none',
          error: data.error || 'none',
          warning: data.warning || 'none',
          messages: data.messages?.map((m: any) => ({ 
            id: m.id, 
            text: m.text?.substring(0, 50), 
            ts: m.ts 
          })) || [],
          fullResponse: data,
        })
        
        // If backend returned an error (even though success: true), log it
        if (data.error) {
          console.error(`[Chat Widget] ⚠️ Backend returned error:`, {
            error: data.error,
            warning: data.warning,
            message: 'This means the Slack API call failed. Check Vercel logs for details.',
          })
          
          // If it's a scope error, show it clearly
          if (data.error === 'missing_scope' || data.error === 'invalid_arguments') {
            console.error(`[Chat Widget] 🚨 CRITICAL: Bot missing channels:history scope!`)
            console.error(`[Chat Widget] 🚨 Fix: https://api.slack.com/apps → Your App → OAuth & Permissions → Add channels:history → Reinstall → Update token`)
          }
        }
        
        if (!data?.success) {
          const errorMsg = data?.error || 'Unknown error'
          
          console.error('[Chat Widget] ❌ Poll returned unsuccessful:', {
            success: data.success,
            error: errorMsg,
            details: data?.details,
            fullResponse: data,
          })
          
          // If it's a critical scope error, show it to the user once
          if (errorMsg.includes('CRITICAL') || (errorMsg.includes('missing') && errorMsg.includes('scope'))) {
            console.error('[Chat Widget] 🚨 CRITICAL SCOPE ERROR:', errorMsg)
            // Don't spam - only log once per session
            if (typeof window !== 'undefined' && !window.sessionStorage.getItem('scopeErrorShown')) {
              window.sessionStorage.setItem('scopeErrorShown', 'true')
            }
          }
          return
        }

        // Update cursor to latest message timestamp
        if (typeof data.cursor === 'string' && data.cursor !== pollCursorRef.current) {
          console.log(`[Chat Widget] 📍 Cursor updated: ${pollCursorRef.current || 'none'} → ${data.cursor}`)
          pollCursorRef.current = data.cursor
        } else if (data.cursor) {
          console.log(`[Chat Widget] 📍 Cursor unchanged: ${data.cursor}`)
        }

        const newMsgs = (data.messages || []) as Array<{ id: string; text: string; ts: string }>
        console.log(`[Chat Widget] 📨 Processing ${newMsgs.length} messages from poll`)
        
        if (newMsgs.length > 0) {
          console.log(`[Chat Widget] ✅ Received ${newMsgs.length} new agent messages:`, 
            newMsgs.map(m => ({ 
              id: m.id, 
              text: m.text?.substring(0, 50) + (m.text && m.text.length > 50 ? '...' : ''), 
              ts: m.ts,
              timestamp: new Date(parseFloat(m.ts) * 1000).toISOString(),
            }))
          )
          
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            console.log(`[Chat Widget] 📋 Current message IDs:`, Array.from(existingIds))
            
            const additions: Message[] = newMsgs
              .filter((m) => {
                const isNew = m.id && !existingIds.has(m.id)
                if (!isNew) {
                  console.log(`[Chat Widget] ⏭️ Skipping duplicate message: ${m.id}`)
                }
                return isNew
              })
              .map((m) => {
                const msg: Message = {
                  id: m.id,
                  text: m.text || '',
                  sender: 'agent',
                  timestamp: new Date(parseFloat(m.ts) * 1000),
                }
                console.log(`[Chat Widget] ➕ Adding message:`, {
                  id: msg.id,
                  text: msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : ''),
                  sender: msg.sender,
                  timestamp: msg.timestamp.toISOString(),
                })
                return msg
              })
            
            if (additions.length > 0) {
              console.log(`[Chat Widget] ✅ Adding ${additions.length} new messages to chat. Total messages will be: ${prev.length + additions.length}`)
              return [...prev, ...additions]
            } else {
              console.log(`[Chat Widget] ⚠️ No new messages to add (all were duplicates)`)
            }
            return prev
          })
        } else {
          console.log(`[Chat Widget] ℹ️ No new messages in this poll (messageCount: 0)`)
        }
      } catch (error) {
        console.error('[Chat Widget] ❌ Polling error:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          pollAttempt: pollAttempts,
        })
      }
    }

    // Start polling after a short delay to give thread time to be indexed
    const initialDelay = setTimeout(() => {
      if (!cancelled) poll()
    }, 2000)
    
    // Then poll every 3 seconds (increased from 2.5s to reduce load)
    const interval = window.setInterval(() => {
      if (!cancelled) poll()
    }, 3000)

    return () => {
      cancelled = true
      clearTimeout(initialDelay)
      window.clearInterval(interval)
    }

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [isOpen])

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setLeadInfo((prev) => ({ ...prev, [questionId]: answer }))
    
    // Show user's answer as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: answer,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    
    // Move to next question - use functional update to get latest state
    setQuestionStep((currentStep) => {
      const nextStep = currentStep + 1
      
      // Scroll to bottom after state update
      setTimeout(() => {
        scrollToBottom()
      }, 100)
      
      if (nextStep >= questions.length) {
        // All questions answered, now collect name and email
        setIsCollectingContactInfo(true)
        setTimeout(() => {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: 'Great! We just need your name and email to connect you with our team.',
            sender: 'bot',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
          setTimeout(() => scrollToBottom(), 100)
        }, 300)
      }
      
      return nextStep
    })
  }

  const handleContactInfoSubmit = async () => {
    // Validate name and email
    if (!nameValue.trim()) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Please enter your name.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }
    
    if (!emailValue.trim()) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Please enter your email address.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue.trim())) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Please enter a valid email address.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }
    
    // Save name and email to leadInfo
    setLeadInfo((prev) => ({ ...prev, name: nameValue.trim(), email: emailValue.trim() }))
    setIsCollectingContactInfo(false)
    
    // Show user's info as messages
    const nameMessage: Message = {
      id: Date.now().toString(),
      text: `Name: ${nameValue.trim()}`,
      sender: 'user',
      timestamp: new Date(),
    }
    const emailMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `Email: ${emailValue.trim()}`,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, nameMessage, emailMessage])
    
    // Ask for project details (optional)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Perfect! Can you tell us more about your project? (Optional - you can skip this and go straight to chatting)',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setTimeout(() => scrollToBottom(), 100)
    }, 300)
  }

  const handleSkipProjectDetails = async () => {
    setIsQuestionnaireComplete(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('slackChatQuestionnaireComplete', 'true')
    }
    
    // Automatically send a message to connect to agent
    const autoMessage = "Hi, I'm ready to discuss my project"
    const userMessage: Message = {
      id: Date.now().toString(),
      text: autoMessage,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)
    setIsConnecting(true)

      try {
        console.log('[Chat Widget] Auto-connecting after questionnaire completion:', {
          message: autoMessage,
          sessionId: sessionIdRef.current,
          leadInfo,
          hasName: !!leadInfo.name,
          hasEmail: !!leadInfo.email,
        })
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: autoMessage,
            timestamp: userMessage.timestamp.toISOString(),
            sessionId: sessionIdRef.current,
            pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            token: chatTokenRef.current || undefined,
            leadInfo: !chatTokenRef.current ? leadInfo : undefined, // Send lead info with first message (includes name, email, project info)
          }),
        })

      const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }))
      
      console.log('[Chat Widget] Auto-connect API response:', {
        ok: response.ok,
        status: response.status,
        success: data?.success,
        error: data?.error,
        hasToken: !!data?.token,
        threadTs: data?.threadTs,
      })
      
      if (response.ok && data?.success) {
        const newToken = data?.token
        const threadTs = data?.threadTs
        if (typeof newToken === 'string' && typeof window !== 'undefined') {
          chatTokenRef.current = newToken
          window.localStorage.setItem('slackChatToken', newToken)
        }
        if (typeof threadTs === 'string') {
          console.log('[Chat Widget] Thread created, starting polling from thread:', threadTs)
          pollCursorRef.current = ''
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "✅ Perfect! We have your project information. Someone from our team will connect with you shortly. Please keep this chat open.",
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const errorText = data?.error || 'Failed to connect'
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
      console.error('Chat auto-connect error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Network error: ${error instanceof Error ? error.message : 'Failed to connect'}. Please try again or contact us at +1-516-603-7838.`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
      setIsConnecting(false)
    }
  }

  const sendMessage = async () => {
    // If we're collecting contact info, handle that first
    if (isCollectingContactInfo) {
      handleContactInfoSubmit()
      return
    }
    
    // If questionnaire is not complete and we're on the project details step
    if (!isQuestionnaireComplete && !isCollectingContactInfo && questionStep >= questions.length) {
      const projectDetails = inputValue.trim()
      // Ensure we have name and email (should already be set, but include them to be safe)
      const updatedLeadInfo = { 
        ...leadInfo, 
        ...(projectDetails ? { projectDetails } : {})
      }
      
      if (projectDetails) {
        setLeadInfo(updatedLeadInfo)
      }
      setIsQuestionnaireComplete(true)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('slackChatQuestionnaireComplete', 'true')
      }
      
      // Show user's project details or indicate skipped
      const userMessage: Message = {
        id: Date.now().toString(),
        text: projectDetails || 'Skipped',
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      
      // Automatically send a message to connect to agent
      const autoMessage = projectDetails || "Hi, I'm ready to discuss my project"
      setIsSending(true)
      setIsConnecting(true)

      try {
        console.log('[Chat Widget] Auto-connecting after project details:', {
          message: autoMessage,
          sessionId: sessionIdRef.current,
          leadInfo: updatedLeadInfo,
          hasName: !!updatedLeadInfo.name,
          hasEmail: !!updatedLeadInfo.email,
        })
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: autoMessage,
            timestamp: userMessage.timestamp.toISOString(),
            sessionId: sessionIdRef.current,
            pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            token: chatTokenRef.current || undefined,
            leadInfo: !chatTokenRef.current ? updatedLeadInfo : undefined, // Includes name, email, and all project info
          }),
        })

        const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }))
        
        console.log('[Chat Widget] Auto-connect API response:', {
          ok: response.ok,
          status: response.status,
          success: data?.success,
          error: data?.error,
          hasToken: !!data?.token,
          threadTs: data?.threadTs,
        })
        
        if (response.ok && data?.success) {
          const newToken = data?.token
          const threadTs = data?.threadTs
          if (typeof newToken === 'string' && typeof window !== 'undefined') {
            chatTokenRef.current = newToken
            window.localStorage.setItem('slackChatToken', newToken)
          }
          if (typeof threadTs === 'string') {
            console.log('[Chat Widget] Thread created, starting polling from thread:', threadTs)
            pollCursorRef.current = ''
          }

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "✅ Perfect! We have your project information. Someone from our team will connect with you shortly. Please keep this chat open.",
            sender: 'bot',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        } else {
          const errorText = data?.error || 'Failed to connect'
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
        console.error('Chat auto-connect error:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `❌ Network error: ${error instanceof Error ? error.message : 'Failed to connect'}. Please try again or contact us at +1-516-603-7838.`,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsSending(false)
        setIsConnecting(false)
      }
      return
    }
    
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
      console.log('[Chat Widget] Sending message to API:', {
        message: userMessage.text,
        sessionId: sessionIdRef.current,
        hasToken: !!chatTokenRef.current,
        leadInfo: isQuestionnaireComplete && !chatTokenRef.current ? leadInfo : undefined,
      })
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          timestamp: userMessage.timestamp.toISOString(),
          sessionId: sessionIdRef.current,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          token: chatTokenRef.current || undefined,
          leadInfo: isQuestionnaireComplete && !chatTokenRef.current ? leadInfo : undefined,
        }),
      })

      const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }))
      
      console.log('[Chat Widget] API response:', {
        ok: response.ok,
        status: response.status,
        success: data?.success,
        error: data?.error,
        hasToken: !!data?.token,
        threadTs: data?.threadTs,
      })
      
      if (response.ok && data?.success) {
        const newToken = data?.token
        const threadTs = data?.threadTs
        if (typeof newToken === 'string' && typeof window !== 'undefined') {
          chatTokenRef.current = newToken
          window.localStorage.setItem('slackChatToken', newToken)
        }
        if (typeof threadTs === 'string') {
          // Don't set cursor to threadTs - we want to see all messages in the thread
          // The cursor will be updated by the poll endpoint based on actual message timestamps
          // Setting it to threadTs would filter out the thread starter and early replies
          console.log('[Chat Widget] Thread created, starting polling from thread:', threadTs)
          // Clear cursor so we start fresh and get all messages
          pollCursorRef.current = ''
          
          // Note: Polling will start automatically via the useEffect
          // We add a small delay in the poll function itself for the first few attempts
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
                  
                  {/* Messages from conversation */}
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
                  
                  {/* Contact Info Collection */}
                  {isCollectingContactInfo && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '12px', maxWidth: '85%', width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                          Please provide your contact information:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Your Name"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            size="small"
                            required
                            placeholder="Enter your full name"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Your Email"
                            type="email"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            size="small"
                            required
                            placeholder="Enter your email address"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                              },
                            }}
                          />
                          <Box
                            onClick={handleContactInfoSubmit}
                            sx={{
                              p: 1.5,
                              borderRadius: '8px',
                              border: '1px solid #1E3A8A',
                              cursor: 'pointer',
                              backgroundColor: '#1E3A8A',
                              color: 'white',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: '#2563EB',
                                transform: 'translateY(-1px)',
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Continue →
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Questionnaire - Show current question with options (always at the end) */}
                  {!isQuestionnaireComplete && !isCollectingContactInfo && questionStep < questions.length && questions[questionStep] && (
                    <Box 
                      key={`question-${questionStep}`}
                      sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}
                    >
                      <Paper elevation={1} sx={{ p: 1.5, borderRadius: '12px', maxWidth: '85%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                          {questions[questionStep].question}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {questions[questionStep].options.map((option) => (
                            <Box
                              key={`${questionStep}-${option}`}
                              onClick={() => handleQuestionAnswer(questions[questionStep].id, option)}
                              sx={{
                                p: 1.5,
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: '#f0f0f0',
                                  borderColor: '#1E3A8A',
                                  transform: 'translateX(2px)',
                                },
                              }}
                            >
                              <Typography variant="body2">{option}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Box>
                  )}
                  
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
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {!isQuestionnaireComplete && !isCollectingContactInfo && questionStep >= questions.length && (
                    <Box sx={{ mb: 1 }}>
                      <Box
                        onClick={handleSkipProjectDetails}
                        sx={{
                          p: 1,
                          textAlign: 'center',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          cursor: 'pointer',
                          backgroundColor: '#f5f5f5',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#e0e0e0',
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                          Skip and start chatting →
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder={
                        !isQuestionnaireComplete && !isCollectingContactInfo && questionStep >= questions.length
                          ? "Tell us about your project (optional)..."
                          : "Type your message..."
                      }
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={
                        isSending || 
                        (!isQuestionnaireComplete && questionStep < questions.length) ||
                        isCollectingContactInfo
                      }
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
                      disabled={
                        (!inputValue.trim() && (!isQuestionnaireComplete && !isCollectingContactInfo && questionStep >= questions.length)) ||
                        isSending ||
                        (!isQuestionnaireComplete && questionStep < questions.length) ||
                        isCollectingContactInfo
                      }
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
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
