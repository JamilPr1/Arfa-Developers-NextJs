'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const FFT_SIZE = 512
const SMOOTHING = 0.85
const SPEECH_ON_FRAMES = 5
const SPEECH_OFF_FRAMES = 18

export function useAudioAnalyzer() {
  const [audioLevel, setAudioLevel] = useState(0)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const noiseFloorRef = useRef(0.008)
  const speechOnFramesRef = useRef(0)
  const speechOffFramesRef = useRef(0)
  const speakingRef = useRef(false)
  const onSpeechStartRef = useRef<(() => void) | null>(null)
  const onSpeechEndRef = useRef<(() => void) | null>(null)

  const setOnSpeechStart = useCallback((cb: (() => void) | null) => {
    onSpeechStartRef.current = cb
  }, [])

  const setOnSpeechEnd = useCallback((cb: (() => void) | null) => {
    onSpeechEndRef.current = cb
  }, [])

  const analyze = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return

    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)

    let sum = 0
    const startBin = Math.floor(300 / (44100 / FFT_SIZE))
    const endBin = Math.floor(3400 / (44100 / FFT_SIZE))
    for (let i = startBin; i < endBin; i++) sum += data[i]
    const avg = sum / (endBin - startBin) / 255
    const level = Math.min(1, avg * 3)

    setAudioLevel((prev) => prev * SMOOTHING + level * (1 - SMOOTHING))

    if (level < noiseFloorRef.current * 1.5) {
      noiseFloorRef.current = noiseFloorRef.current * 0.97 + level * 0.03
    }

    const threshold = Math.max(0.022, noiseFloorRef.current * 2.5)
    const isSpeech = level > threshold

    if (isSpeech) {
      speechOnFramesRef.current += 1
      speechOffFramesRef.current = 0
    } else {
      speechOffFramesRef.current += 1
      if (speechOffFramesRef.current > SPEECH_OFF_FRAMES) speechOnFramesRef.current = 0
    }

    const nowSpeaking = speechOnFramesRef.current >= SPEECH_ON_FRAMES
    setIsUserSpeaking(nowSpeaking)

    if (nowSpeaking && !speakingRef.current) {
      speakingRef.current = true
      onSpeechStartRef.current?.()
    } else if (!nowSpeaking && speakingRef.current && speechOffFramesRef.current >= SPEECH_OFF_FRAMES) {
      speakingRef.current = false
      onSpeechEndRef.current?.()
    }

    rafRef.current = requestAnimationFrame(analyze)
  }, [])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })

      streamRef.current = stream
      const ctx = new AudioContext()
      await ctx.resume()
      contextRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = 0.82
      source.connect(analyser)
      analyserRef.current = analyser

      speechOnFramesRef.current = 0
      speechOffFramesRef.current = 0
      speakingRef.current = false
      noiseFloorRef.current = 0.008

      setHasPermission(true)
      setError(null)
      rafRef.current = requestAnimationFrame(analyze)
      return stream
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied'
      setError(msg)
      throw err
    }
  }, [analyze])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    contextRef.current?.close()
    streamRef.current = null
    contextRef.current = null
    analyserRef.current = null
    speakingRef.current = false
    setHasPermission(false)
    setAudioLevel(0)
    setIsUserSpeaking(false)
  }, [])

  useEffect(() => () => stop(), [stop])

  return {
    audioLevel,
    isUserSpeaking,
    hasPermission,
    error,
    stream: streamRef,
    start,
    stop,
    setOnSpeechStart,
    setOnSpeechEnd,
  }
}
