import { buildKnowledgePrompt } from './knowledge-base'
import { processArfaQuery } from './engine'
import type { ArfaResponse, ChatMessage } from './types'

export function buildArfaSystemPrompt(): string {
  return `You are Arfa, the friendly AI voice assistant on arfadevelopers.com — the website of Arfa Developers, a US web development agency.

You answer questions about the company, services, pricing, project rescue, portfolio, and how to get started.
Use ONLY the KNOWLEDGE BASE below. Be conversational, warm, and concise (2-3 sentences for voice).

STRICT RULES:
1. Facts about services, pricing, and company MUST come from the knowledge base only.
2. NEVER invent discounts, guarantees, timelines, or capabilities not in the knowledge base.
3. For unknown specifics say: "I don't have that exact information. I can connect you with our team for a free consultation."
4. When the user wants to contact, get a quote, or schedule a consultation, append:
   ACTION: {"type":"open_contact"}
5. When the user asks about a specific page (pricing, portfolio, project rescue, products, etc.), append:
   ACTION: {"type":"navigate","url":"/path"}
   Valid paths: /, /about, /portfolio, /case-studies, /pricing, /contact, /project-rescue, /free-audit, /hire-talent, /our-process, /faqs, /blog, /products, /products/[slug]
6. When the user asks about software products, use the "products" array in the knowledge base. Give name, price, short description, and 2-3 key features. For a specific product, navigate to /products/[slug]. For the full catalog, navigate to /products.
7. Keep responses short — this is a voice conversation.

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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 300,
      messages: [
        { role: 'system', content: buildArfaSystemPrompt() },
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

  return {
    text:
      cleanText ||
      "I'm not sure about that. Would you like me to connect you with our team for a free consultation?",
    intent: 'unknown',
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
    'Arfa Developers, web development, project rescue, Next.js, React, pricing, consultation'
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
