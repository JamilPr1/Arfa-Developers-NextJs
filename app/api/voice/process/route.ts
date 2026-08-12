import { NextRequest, NextResponse } from 'next/server'
import {
  processWithOpenAI,
  processWithEngine,
  transcribeWithWhisper,
} from '@/lib/arfa/openai'
import { enrichResponseWithNavigation } from '@/lib/arfa/navigation'
import type { ChatMessage } from '@/lib/arfa/types'

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
      }
    } else {
      result = processWithEngine(cleaned)
    }

    result = enrichResponseWithNavigation(cleaned, result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Voice process error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
