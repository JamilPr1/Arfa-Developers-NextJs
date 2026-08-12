import { NextRequest, NextResponse } from 'next/server'

const TTS_VOICE = process.env.OPENAI_TTS_VOICE || 'nova'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'TTS not configured' }, { status: 503 })
    }

    const { text } = await request.json()
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: TTS_VOICE,
        input: text.slice(0, 4096),
        response_format: 'mp3',
        speed: 1.0,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'TTS failed' }, { status: 502 })
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'TTS error' }, { status: 500 })
  }
}
