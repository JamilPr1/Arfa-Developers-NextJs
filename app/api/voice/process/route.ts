import { NextRequest, NextResponse } from 'next/server'
import {
  processWithOpenAI,
  processWithEngine,
  transcribeWithWhisper,
  CHAT_MODEL,
} from '@/lib/arfa/openai'
import { enrichResponseWithNavigation } from '@/lib/arfa/navigation'
import { rememberExchange } from '@/lib/arfa/brain'
import type { ChatMessage } from '@/lib/arfa/types'

/**
 * Voice process pipeline (local + Vercel):
 * 1) Optional Whisper transcription (whisper-1) if audio uploaded
 * 2) Recall from Arfa Brain (Redis on Vercel / JSON file locally)
 * 3) gpt-4o-mini (or OPENAI_CHAT_MODEL) with full site knowledge + brain memories
 * 4) Save successful Q&A back into brain for next time
 * 5) Client then calls /api/voice/speak (tts-1, voice=nova) for audio reply
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let transcript = ''
    let audioBlob: Blob | null = null
    let history: ChatMessage[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      transcript = (formData.get('transcript') as string) || ''
      const audio = formData.get('audio')
      if (audio instanceof Blob && audio.size > 0) audioBlob = audio
      const historyRaw = formData.get('history') as string
      if (historyRaw) {
        try {
          history = JSON.parse(historyRaw)
        } catch {
          history = []
        }
      }
    } else {
      const body = await request.json()
      transcript = body.transcript || ''
      history = body.history || []
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (apiKey && audioBlob && audioBlob.size > 400) {
      try {
        const whisperText = await transcribeWithWhisper(audioBlob, apiKey)
        if (whisperText.length > 1) transcript = whisperText
      } catch (e) {
        console.warn('Whisper fallback:', e)
      }
    }

    if (!transcript.trim()) {
      return NextResponse.json({ error: 'No speech detected' }, { status: 400 })
    }

    const cleaned = transcript.trim()
    let result

    if (apiKey) {
      try {
        result = await processWithOpenAI(cleaned, apiKey, history)
      } catch (e) {
        console.warn('OpenAI fallback to engine:', e)
        result = processWithEngine(cleaned)
        void rememberExchange(cleaned, result.text)
      }
    } else {
      result = processWithEngine(cleaned)
      void rememberExchange(cleaned, result.text)
    }

    result = enrichResponseWithNavigation(cleaned, result)
    return NextResponse.json({
      ...result,
      meta: {
        model: apiKey ? CHAT_MODEL : 'local-engine',
        brain: true,
      },
    })
  } catch (error) {
    console.error('Voice process error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
