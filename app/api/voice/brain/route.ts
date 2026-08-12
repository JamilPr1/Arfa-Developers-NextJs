import { NextResponse } from 'next/server'
import { loadBrain } from '@/lib/arfa/brain'
import { getAllPagesKnowledge } from '@/lib/arfa/pages-knowledge'
import { CHAT_MODEL } from '@/lib/arfa/openai'

/** Debug/status endpoint for Arfa brain + knowledge coverage (local + Vercel). */
export async function GET() {
  const memories = await loadBrain()
  const pages = getAllPagesKnowledge()

  return NextResponse.json({
    ok: true,
    models: {
      chat: process.env.OPENAI_API_KEY ? CHAT_MODEL : 'local-engine (no OPENAI_API_KEY)',
      stt: 'whisper-1',
      tts: `tts-1 / ${process.env.OPENAI_TTS_VOICE || 'nova'}`,
    },
    storage: {
      redis: !!(
        (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
        (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
      ),
      fileFallback: 'lib/data/arfa-brain.json',
    },
    brain: {
      memories: memories.length,
      top: memories
        .slice()
        .sort((a, b) => b.hitCount - a.hitCount)
        .slice(0, 10)
        .map((m) => ({
          question: m.question,
          hitCount: m.hitCount,
          updatedAt: m.updatedAt,
        })),
    },
    pages: {
      count: pages.length,
      paths: pages.map((p) => p.path),
    },
  })
}
