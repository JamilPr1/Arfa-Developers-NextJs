'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { processArfaQuery } from '@/lib/arfa/engine'
import { enrichResponseWithNavigation } from '@/lib/arfa/navigation'
import { generateId } from '@/lib/arfa/utils'
import type { ArfaResponse, TranscriptMessage } from '@/lib/arfa/types'
import { useAudioAnalyzer } from './useAudioAnalyzer'
import { useTurnBasedVoice } from './useTurnBasedVoice'
import { useSpeechSynthesis } from './useSpeechSynthesis'

export type ArfaVoiceState = 'idle' | 'ready' | 'listening' | 'processing' | 'speaking'

const ARFA_GREETING =
  "Hi! I'm Arfa, your AI assistant. Ask me about our web development services, pricing, project rescue, or how to get started."

/** Prevents mic from picking up residual TTS / echo right after stop */
const LISTEN_COOLDOWN_MS = 800

export function useArfa() {
  const router = useRouter()
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [voiceState, setVoiceState] = useState<ArfaVoiceState>('ready')
  const [liveCaption, setLiveCaption] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [listenReady, setListenReady] = useState(true)
  const hasGreeted = useRef(false)
  const processingRef = useRef(false)
  const messagesRef = useRef<TranscriptMessage[]>([])
  /** Invalidates in-flight process/speak when user stops or closes */
  const turnIdRef = useRef(0)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  messagesRef.current = messages

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis()
  const {
    audioLevel,
    isUserSpeaking,
    hasPermission,
    error: micError,
    stream,
    start: startMic,
    stop: stopMic,
    setOnSpeechStart,
    setOnSpeechEnd,
  } = useAudioAnalyzer()

  const blockListening = useCallback((ms = LISTEN_COOLDOWN_MS) => {
    setListenReady(false)
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    cooldownTimerRef.current = setTimeout(() => {
      setListenReady(true)
      cooldownTimerRef.current = null
    }, ms)
  }, [])

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [])

  const isListeningMode =
    voiceState === 'listening' && !isMuted && hasPermission && listenReady

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => {
      const next = [...prev, { id: generateId(), role, content, timestamp: new Date() }]
      messagesRef.current = next
      return next
    })
  }, [])

  const executeAction = useCallback(
    (response: ArfaResponse) => {
      switch (response.action.type) {
        case 'navigate':
          if (response.action.payload?.url) {
            const url = response.action.payload.url
            // Slight delay so speech can start, then open the page in this tab
            window.setTimeout(() => {
              if (url.startsWith('http')) {
                window.open(url, '_blank')
              } else {
                router.push(url)
              }
            }, 350)
          }
          break
        case 'open_contact':
          window.setTimeout(() => router.push('/contact'), 350)
          break
        default:
          break
      }
    },
    [router]
  )

  const cancelActiveTurn = useCallback(() => {
    turnIdRef.current += 1
    processingRef.current = false
    stopSpeaking()
  }, [stopSpeaking])

  const processUtterance = useCallback(
    async (transcript: string, audioBlob: Blob | null) => {
      if (processingRef.current) return
      if (!transcript.trim() && !audioBlob) return

      const turnId = ++turnIdRef.current
      processingRef.current = true
      setVoiceState('processing')
      setLiveCaption('')

      let response: ArfaResponse

      try {
        const formData = new FormData()
        formData.append('transcript', transcript.trim())
        if (audioBlob) formData.append('audio', audioBlob, 'audio.webm')
        formData.append(
          'history',
          JSON.stringify(messagesRef.current.slice(-8).map((m) => ({ role: m.role, content: m.content })))
        )

        const res = await fetch('/api/voice/process', { method: 'POST', body: formData })
        if (res.ok) {
          response = await res.json()
        } else {
          response = enrichResponseWithNavigation(transcript, processArfaQuery(transcript || 'hello'))
        }
      } catch {
        response = enrichResponseWithNavigation(transcript, processArfaQuery(transcript || 'hello'))
      }

      // User stopped while waiting for the model — do not speak
      if (turnId !== turnIdRef.current) {
        processingRef.current = false
        return
      }

      if (transcript.trim()) addMessage('user', transcript.trim())
      addMessage('assistant', response.text)
      setVoiceState('speaking')
      executeAction(response)

      speak(response.text, () => {
        if (turnId !== turnIdRef.current) {
          processingRef.current = false
          return
        }
        processingRef.current = false
        blockListening()
        setVoiceState('listening')
      })
    },
    [addMessage, speak, executeAction, blockListening]
  )

  const { liveTranscript } = useTurnBasedVoice({
    listening: isListeningMode,
    stream,
    onUtterance: processUtterance,
    onInterim: setLiveCaption,
    setOnSpeechStart,
    setOnSpeechEnd,
  })

  const activate = useCallback(async () => {
    try {
      setIsMuted(false)
      setListenReady(true)
      await startMic()
      setVoiceState('listening')
      if (!hasGreeted.current) {
        hasGreeted.current = true
        addMessage('assistant', ARFA_GREETING)
      }
    } catch {
      setVoiceState('ready')
    }
  }, [startMic, addMessage])

  const deactivate = useCallback(() => {
    cancelActiveTurn()
    stopMic()
    setVoiceState('ready')
    setLiveCaption('')
    setIsMuted(false)
    setListenReady(true)
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current)
      cooldownTimerRef.current = null
    }
  }, [cancelActiveTurn, stopMic])

  const toggleMute = useCallback(() => setIsMuted((m) => !m), [])

  const handleOrbClick = useCallback(async () => {
    if (!hasPermission || voiceState === 'ready') {
      await activate()
    } else if (isMuted) {
      setIsMuted(false)
      setVoiceState('listening')
    } else if (voiceState === 'speaking' || voiceState === 'processing') {
      // Stop current reply — invalidate in-flight TTS so a second voice can't start
      cancelActiveTurn()
      blockListening()
      setVoiceState('listening')
    }
  }, [hasPermission, voiceState, isMuted, activate, cancelActiveTurn, blockListening])

  return {
    messages,
    voiceState,
    isActive: hasPermission && voiceState !== 'ready',
    isSpeaking,
    isUserSpeaking: isUserSpeaking && isListeningMode,
    isMuted,
    audioLevel,
    hasPermission,
    micError,
    liveCaption: voiceState === 'listening' ? liveCaption || liveTranscript : liveCaption,
    activate,
    deactivate,
    toggleMute,
    handleOrbClick,
  }
}
