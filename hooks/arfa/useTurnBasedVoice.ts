'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getVoiceProvider } from '@/lib/arfa/voice-provider'

const END_OF_TURN_MS = 1000

interface UseTurnBasedVoiceOptions {
  listening: boolean
  stream: React.MutableRefObject<MediaStream | null>
  onUtterance: (transcript: string, audioBlob: Blob | null) => void
  onInterim?: (transcript: string) => void
  setOnSpeechStart: (cb: (() => void) | null) => void
  setOnSpeechEnd: (cb: (() => void) | null) => void
}

export function useTurnBasedVoice({
  listening,
  stream,
  onUtterance,
  onInterim,
  setOnSpeechStart,
  setOnSpeechEnd,
}: UseTurnBasedVoiceOptions) {
  const [liveTranscript, setLiveTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)

  const providerRef = useRef(getVoiceProvider())
  const listeningRef = useRef(listening)
  const onUtteranceRef = useRef(onUtterance)
  const onInterimRef = useRef(onInterim)
  const transcriptRef = useRef('')
  const interimRef = useRef('')
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const flushingRef = useRef(false)
  const shouldRestartRef = useRef(false)
  const hasContentRef = useRef(false)

  listeningRef.current = listening
  onUtteranceRef.current = onUtterance
  onInterimRef.current = onInterim

  const clearEndTimer = () => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current)
      endTimerRef.current = null
    }
  }

  const updateDisplay = useCallback(() => {
    const display = `${transcriptRef.current} ${interimRef.current}`.trim()
    setLiveTranscript(display)
    onInterimRef.current?.(display)
    if (display.length > 1) hasContentRef.current = true
  }, [])

  const resetTurn = useCallback(() => {
    clearEndTimer()
    transcriptRef.current = ''
    interimRef.current = ''
    hasContentRef.current = false
    setLiveTranscript('')
    onInterimRef.current?.('')
    chunksRef.current = []
  }, [])

  const startRecording = useCallback(() => {
    const mediaStream = stream.current
    if (!mediaStream || recorderRef.current?.state === 'recording') return

    if (!recorderRef.current) {
      chunksRef.current = []
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      const recorder = new MediaRecorder(mediaStream, { mimeType })
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorderRef.current = recorder
      recorder.start(100)
    }
  }, [stream])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        recorderRef.current = null
        resolve(chunksRef.current.length ? new Blob(chunksRef.current, { type: 'audio/webm' }) : null)
        return
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        chunksRef.current = []
        recorderRef.current = null
        resolve(blob.size > 400 ? blob : null)
      }
      recorder.stop()
    })
  }, [])

  const flushTurn = useCallback(async () => {
    if (flushingRef.current || !listeningRef.current) return
    clearEndTimer()
    const text = `${transcriptRef.current} ${interimRef.current}`.trim()
    const hadContent = hasContentRef.current || text.length > 1
    if (!hadContent) {
      resetTurn()
      return
    }
    flushingRef.current = true
    const audioBlob = await stopRecording()
    resetTurn()
    try {
      await onUtteranceRef.current(text, audioBlob)
    } finally {
      flushingRef.current = false
    }
  }, [resetTurn, stopRecording])

  const scheduleEndOfTurn = useCallback(() => {
    clearEndTimer()
    endTimerRef.current = setTimeout(() => {
      if (listeningRef.current && (hasContentRef.current || transcriptRef.current || interimRef.current)) {
        flushTurn()
      }
    }, END_OF_TURN_MS)
  }, [flushTurn])

  const handleSpeechStart = useCallback(() => {
    if (!listeningRef.current || flushingRef.current) return
    startRecording()
  }, [startRecording])

  const handleSpeechEnd = useCallback(() => {
    if (!listeningRef.current || flushingRef.current) return
    scheduleEndOfTurn()
  }, [scheduleEndOfTurn])

  const stopRecognition = useCallback(() => {
    shouldRestartRef.current = false
    clearEndTimer()
    providerRef.current.abortListening?.()
    providerRef.current.stopListening()
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    recorderRef.current = null
    setIsListening(false)
  }, [])

  const startRecognition = useCallback(() => {
    shouldRestartRef.current = true
    setIsListening(true)
    resetTurn()
    startRecording()

    const listen = () => {
      if (!shouldRestartRef.current || !listeningRef.current) return
      providerRef.current.startListening({
        continuous: true,
        interimResults: true,
        lang: 'en-US',
        onResult: ({ transcript, isFinal }) => {
          if (!listeningRef.current || flushingRef.current || !transcript) return
          startRecording()
          hasContentRef.current = true
          if (isFinal) {
            transcriptRef.current = `${transcriptRef.current} ${transcript}`.trim()
            interimRef.current = ''
          } else {
            interimRef.current = transcript
          }
          updateDisplay()
          scheduleEndOfTurn()
        },
        onError: (err) => {
          if (err !== 'no-speech' && err !== 'aborted') console.warn('Speech recognition:', err)
        },
        onEnd: () => {
          if (shouldRestartRef.current && listeningRef.current) setTimeout(listen, 150)
          else setIsListening(false)
        },
      })
    }
    listen()
  }, [resetTurn, startRecording, updateDisplay, scheduleEndOfTurn])

  useEffect(() => {
    setOnSpeechStart(handleSpeechStart)
    setOnSpeechEnd(handleSpeechEnd)
    return () => {
      setOnSpeechStart(null)
      setOnSpeechEnd(null)
    }
  }, [setOnSpeechStart, setOnSpeechEnd, handleSpeechStart, handleSpeechEnd])

  useEffect(() => {
    if (listening) startRecognition()
    else {
      stopRecognition()
      resetTurn()
    }
    return () => stopRecognition()
  }, [listening]) // eslint-disable-line react-hooks/exhaustive-deps

  return { isListening, liveTranscript }
}
