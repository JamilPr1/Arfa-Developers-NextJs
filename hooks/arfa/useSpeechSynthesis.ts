'use client'

import { useCallback, useRef, useState } from 'react'
import { getVoiceProvider } from '@/lib/arfa/voice-provider'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const providerRef = useRef(getVoiceProvider())

  const speak = useCallback((text: string, onEnd?: () => void) => {
    setIsSpeaking(true)
    providerRef.current.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false)
        onEnd?.()
      },
      onError: () => setIsSpeaking(false),
    })
  }, [])

  const stop = useCallback(() => {
    providerRef.current.stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return { isSpeaking, speak, stop }
}
