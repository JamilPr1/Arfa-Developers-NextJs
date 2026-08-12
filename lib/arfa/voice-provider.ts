export interface SpeechRecognitionResult {
  transcript: string
  isFinal: boolean
}

export interface SpeakOptions {
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  rate?: number
  pitch?: number
  volume?: number
}

export interface VoiceProvider {
  isSupported(): boolean
  startListening(options?: {
    continuous?: boolean
    interimResults?: boolean
    lang?: string
    onResult?: (result: SpeechRecognitionResult) => void
    onError?: (error: string) => void
    onEnd?: () => void
  }): void
  stopListening(): void
  abortListening(): void
  speak(text: string, options?: SpeakOptions): void
  stopSpeaking(): void
  isSpeaking(): boolean
}

class WebSpeechProvider implements VoiceProvider {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionCtor =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognitionCtor) {
        this.recognition = new SpeechRecognitionCtor()
      }
      this.synthesis = window.speechSynthesis
    }
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }

  startListening(
    options: {
      continuous?: boolean
      interimResults?: boolean
      lang?: string
      onResult?: (result: SpeechRecognitionResult) => void
      onError?: (error: string) => void
      onEnd?: () => void
    } = {}
  ): void {
    if (!this.recognition) return

    const { continuous = true, interimResults = true, lang = 'en-US', onResult, onError, onEnd } = options

    this.recognition.continuous = continuous
    this.recognition.interimResults = interimResults
    this.recognition.lang = lang

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      let isFinal = false
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
        if (event.results[i].isFinal) isFinal = true
      }
      onResult?.({ transcript: transcript.trim(), isFinal })
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        onError?.(event.error)
      }
    }

    this.recognition.onend = () => onEnd?.()

    try {
      this.recognition.start()
    } catch {
      // already started
    }
  }

  stopListening(): void {
    this.recognition?.stop()
  }

  abortListening(): void {
    try {
      this.recognition?.abort()
    } catch {
      this.recognition?.stop()
    }
  }

  speak(text: string, options: SpeakOptions = {}): void {
    if (!this.synthesis || !text.trim()) return

    const doSpeak = () => {
      this.synthesis!.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate ?? 1
      utterance.pitch = options.pitch ?? 1.05
      utterance.volume = options.volume ?? 1

      const voices = this.synthesis!.getVoices()
      const preferred =
        voices.find((v) => /samantha|zira|jenny|aria|female|google uk english female/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'))
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => options.onStart?.()
      utterance.onend = () => options.onEnd?.()
      utterance.onerror = () => {
        options.onError?.('speech-synthesis-error')
        options.onEnd?.()
      }
      this.synthesis!.speak(utterance)
    }

    const voices = this.synthesis.getVoices()
    if (voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.synthesis!.onvoiceschanged = null
        doSpeak()
      }
    } else {
      doSpeak()
    }
  }

  stopSpeaking(): void {
    this.synthesis?.cancel()
  }

  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false
  }
}

class HybridVoiceProvider implements VoiceProvider {
  private webSpeech = new WebSpeechProvider()
  private currentAudio: HTMLAudioElement | null = null
  private speaking = false

  isSupported(): boolean {
    return this.webSpeech.isSupported()
  }

  startListening(options = {}): void {
    this.webSpeech.startListening(options)
  }

  stopListening(): void {
    this.webSpeech.stopListening()
  }

  abortListening(): void {
    this.webSpeech.abortListening()
  }

  speak(text: string, options: SpeakOptions = {}): void {
    if (!text.trim()) return
    this.stopSpeaking()
    this.speakWithOpenAI(text, options)
  }

  private async speakWithOpenAI(text: string, options: SpeakOptions) {
    try {
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('OpenAI TTS unavailable')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      this.currentAudio = audio
      this.speaking = true

      audio.onplay = () => options.onStart?.()
      audio.onended = () => {
        URL.revokeObjectURL(url)
        this.currentAudio = null
        this.speaking = false
        options.onEnd?.()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        this.currentAudio = null
        this.speaking = false
        this.webSpeech.speak(text, options)
      }
      await audio.play()
    } catch {
      this.webSpeech.speak(text, options)
    }
  }

  stopSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.src = ''
      this.currentAudio = null
    }
    this.speaking = false
    this.webSpeech.stopSpeaking()
  }

  isSpeaking(): boolean {
    return this.speaking || this.webSpeech.isSpeaking()
  }
}

let providerInstance: VoiceProvider | null = null

export function getVoiceProvider(): VoiceProvider {
  if (!providerInstance) {
    providerInstance = new HybridVoiceProvider()
  }
  return providerInstance
}
