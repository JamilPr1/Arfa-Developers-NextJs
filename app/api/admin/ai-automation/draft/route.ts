import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSecret } from '../_utils'
import type { AiLead } from '../leads/route'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export const runtime = 'nodejs'

const LEADS_FILENAME = 'ai-leads.json'

async function readLeads(): Promise<AiLead[]> {
  const data = await readDataFile<AiLead>(LEADS_FILENAME)
  return Array.isArray(data) ? data : []
}

export async function POST(req: NextRequest) {
  try {
    requireAdminSecret(req)
    const { id } = (await req.json().catch(() => ({}))) as { id?: string }
    const leadId = String(id || '')
    if (!leadId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const leads = await readLeads()
    const idx = leads.findIndex((l) => l.id === leadId)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const lead = leads[idx]

    const calendly = process.env.CALENDLY_LINK || ''
    const apiKey = process.env.ANTHROPIC_API_KEY || ''
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'

    let draft = ''

    if (apiKey) {
      const prompt = `You are an SDR for a software/AI automation agency.

Write a short, friendly outreach message replying to this lead. Keep it under 90 words.
Be specific about what you'd build, ask 1 question, and include a CTA to book a call.
If a Calendly link is provided, include it.

Lead source: ${lead.source}
Lead title: ${lead.title}
Lead text: ${lead.text}
Matched keywords: ${(lead.matchedKeywords || []).join(', ')}
Calendly: ${calendly || '(none)'}
`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 250,
          temperature: 0.5,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const json: any = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json?.error?.message || json?.message || 'Anthropic request failed')
      }

      draft =
        json?.content?.map?.((c: any) => (c?.type === 'text' ? c.text : '')).join('') ||
        json?.content?.[0]?.text ||
        ''
    } else {
      // Fallback (no AI key) — still useful during setup.
      const tail = calendly ? `\n\nWant me to share a quick plan? Book here: ${calendly}` : ''
      draft = `Hey! Saw your post about "${lead.title}". If you’re trying to move fast, we can build an automation + landing flow that captures leads, scores them, and replies instantly.\n\nWhat’s your #1 goal this week—more inbound or faster follow-ups?${tail}`
    }

    const cleaned = String(draft || '').trim()
    leads[idx] = { ...lead, draftResponse: cleaned }
    await writeDataFile(LEADS_FILENAME, leads)

    return NextResponse.json({ ok: true, draft: cleaned, lead: leads[idx] })
  } catch (e: any) {
    const msg = e?.message || 'Failed'
    const status = msg === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

