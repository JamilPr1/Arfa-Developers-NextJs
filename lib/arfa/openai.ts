import { buildKnowledgePrompt } from './knowledge-base'
import { processArfaQuery } from './engine'
import { formatBrainForPrompt, recallFromBrain, rememberExchange } from './brain'
import { getValidNavigationPaths } from './pages-knowledge'
import type { ArfaResponse, ChatMessage } from './types'

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini'

export function buildArfaSystemPrompt(brainContext = ''): string {
  const paths = getValidNavigationPaths().join(', ')

  return `You are Arfa, the friendly AI voice assistant on arfadevelopers.com — the website of Arfa Developers, a US web development agency.

You answer questions about the company, services, pricing, project rescue, portfolio, products, and how to get started.
Use ONLY the KNOWLEDGE BASE and LEARNED MEMORY below. Be conversational, warm, and concise (2-3 sentences for voice).

STRICT RULES:
1. Facts about services, pricing, pages, and company MUST come from the knowledge base or learned memory only.
2. NEVER invent discounts, guarantees, timelines, or capabilities not in the knowledge base.
3. Prefer LEARNED MEMORY answers when they clearly match the user's question (they are prior verified Q&A).
4. For unknown specifics say: "I don't have that exact information. I can connect you with our team for a free consultation."
5. When the user wants to contact, get a quote, or schedule a consultation, append:
   ACTION: {"type":"open_contact"}
6. When the user asks about a specific page or service, append:
   ACTION: {"type":"navigate","url":"/path"}
   Valid paths include: ${paths}
7. When the user asks about software products, use the "products" array. Give name, price, short description, and 2-3 key features. Navigate to /products or /products/[slug].
8. Keep responses short — this is a voice conversation.

${brainContext ? `LEARNED MEMORY (prior user questions — reuse when relevant):\n${brainContext}\n` : ''}
KNOWLEDGE BASE:
${buildKnowledgePrompt()}`
}

export function parseActionFromResponse(text: string): {
  cleanText: string
  action?: ArfaResponse['action']
} {
  const actionMatch = text.match(/ACTION:\s*(\{.*\})\s*$/m)
  if (!actionMatch) return { cleanText: text.trim() }

  try {
    const action = JSON.parse(actionMatch[1]) as ArfaResponse['action']
    const cleanText = text.replace(/\s*ACTION:\s*\{.*\}\s*$/m, '').trim()
    return { cleanText, action }
  } catch {
    return { cleanText: text.trim() }
  }
}

export async function processWithOpenAI(
  transcript: string,
  apiKey: string,
  history: ChatMessage[] = []
): Promise<ArfaResponse> {
  const recentHistory = history.slice(-8).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const recalled = await recallFromBrain(transcript)
  const brainContext = formatBrainForPrompt(recalled)

  // Strong local match: return remembered answer directly (fast + consistent)
  if (recalled[0] && recalled[0].score >= 80) {
    await rememberExchange(transcript, recalled[0].memory.answer)
    return {
      text: recalled[0].memory.answer,
      intent: 'brain_recall',
      action: { type: 'none' },
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.4,
      max_tokens: 300,
      messages: [
        { role: 'system', content: buildArfaSystemPrompt(brainContext) },
        ...recentHistory,
        { role: 'user', content: transcript },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI error: ${response.status} ${err}`)
  }

  const data = await response.json()
  const rawText = data.choices?.[0]?.message?.content || ''
  const { cleanText, action } = parseActionFromResponse(rawText)

  const text =
    cleanText ||
    "I'm not sure about that. Would you like me to connect you with our team for a free consultation?"

  // Persist for next time (non-blocking)
  void rememberExchange(transcript, text)

  return {
    text,
    intent: recalled.length ? 'openai_with_brain' : 'openai',
    action: action || { type: 'none' },
  }
}

export async function transcribeWithWhisper(audioBlob: Blob, apiKey: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'en')
  formData.append(
    'prompt',
    'Arfa Developers, web development, project rescue, Next.js, React, pricing, consultation, products, HRM, CRM'
  )

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })

  if (!response.ok) throw new Error(`Whisper error: ${response.status}`)

  const data = await response.json()
  return (data.text || '').trim()
}

export function processWithEngine(transcript: string): ArfaResponse {
  return processArfaQuery(transcript)
}

export { CHAT_MODEL }
