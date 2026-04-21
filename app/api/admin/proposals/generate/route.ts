import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type BusinessLead = {
  id: number
  businessName: string
  address?: string
  phone?: string
  website?: string
  email?: string
  city?: string
  state?: string
  countryCode?: string
  notes?: string
}

type Proposal = {
  id: number
  leadId?: number
  businessName?: string
  slug: string
  title: string
  html: string
  createdAt: string
  updatedAt: string
}

const LEADS_FILE = 'business-leads.json'
const PROPOSALS_FILE = 'proposals.json'

function normalizeLead(row: any): BusinessLead {
  return {
    id: row?.id,
    businessName: row?.businessName ?? row?.name ?? row?.title ?? '',
    address: row?.address,
    phone: row?.phone ?? row?.phoneNumber,
    website: row?.website ?? row?.url,
    email: row?.email,
    city: row?.city,
    state: row?.state ?? row?.state_county,
    countryCode: row?.countryCode ?? row?.country_code,
    notes: row?.notes,
  }
}

function makeSlug() {
  return crypto.randomBytes(9).toString('base64url')
}

function wrapHtmlIfNeeded(html: string) {
  const h = (html || '').trim()
  if (!h) return ''
  if (/<html[\s>]/i.test(h)) return h
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n<title>Proposal</title>\n</head>\n<body>\n${h}\n</body>\n</html>`
}

async function generateHtmlWithOpenAI(input: {
  lead: BusinessLead
  goal: string
}) {
  const apiKey = process.env.OPENAI_API_KEY || ''
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')

  const lead = input.lead
  const biz = lead.businessName
  const location = [lead.city, lead.state, lead.countryCode?.toUpperCase()].filter(Boolean).join(', ')

  const prompt = [
    'You are a senior web designer and copywriter for a modern software agency.',
    'Generate a complete, modern, responsive ONE-PAGE WEBSITE as pure HTML with inline CSS (and minimal inline JS only if necessary).',
    'Return ONLY the HTML (starting with <!doctype html>).',
    '',
    'Constraints:',
    '- Modern clean design, great spacing, strong typography, mobile-first responsive',
    '- Must include: hero, services, social proof section, FAQs, contact CTA',
    '- Use the business details below; do NOT invent a real address if missing; you can omit fields gracefully.',
    '- The pitch is: “We noticed you may not have a modern website. Here is a demo redesign + offer a free audit.”',
    '- Include a sticky top bar with business name and CTA button.',
    '- Contact CTA should include mailto/tel links if provided.',
    '- Use a tasteful color scheme, no external assets required (no images needed).',
    '',
    `Business name: ${biz}`,
    `Location: ${location || 'N/A'}`,
    `Address: ${lead.address || 'N/A'}`,
    `Phone: ${lead.phone || 'N/A'}`,
    `Email: ${lead.email || 'N/A'}`,
    `Current website (if any): ${lead.website || 'N/A'}`,
    '',
    `Additional notes (optional): ${lead.notes ? lead.notes.slice(0, 1200) : 'N/A'}`,
    '',
    `Goal: ${input.goal}`,
  ].join('\n')

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You generate beautiful responsive HTML landing pages.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  })

  const json = await resp.json().catch(() => null)
  const text = json?.choices?.[0]?.message?.content
  if (!resp.ok) throw new Error(json?.error?.message || 'OpenAI request failed')
  if (typeof text !== 'string' || text.trim().length < 200) throw new Error('OpenAI returned empty/short HTML')
  return wrapHtmlIfNeeded(text)
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as any
    const leadId = Number(body?.leadId || 0)
    const goal = String(body?.goal || 'Create a modern one-page website demo proposal.').trim()
    if (!leadId) return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })

    // Load lead (Supabase first, then fallback store)
    let lead: BusinessLead | null = null
    const useSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'

    if (useSupabase) {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data } = await supabase.from('business_leads').select('*').eq('id', leadId).single()
        if (data) lead = normalizeLead(data)
      }
    }
    if (!lead) {
      const leads = await readDataFile<any>(LEADS_FILE)
      const found = leads.find((l: any) => Number(l?.id) === leadId)
      if (found) lead = normalizeLead(found)
    }
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const html = await generateHtmlWithOpenAI({ lead, goal })
    const slug = makeSlug()
    const now = new Date().toISOString()
    const title = `${lead.businessName || 'Proposal'} — Website Demo`

    // Save proposal
    if (useSupabase) {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data, error } = await supabase
          .from('proposals')
          .insert({
            leadId,
            businessName: lead.businessName,
            slug,
            title,
            html,
            created_at: now,
            updated_at: now,
          })
          .select('*')
          .single()
        if (!error && data) {
          const p = data as any
          return NextResponse.json({
            success: true,
            proposal: {
              id: p.id,
              leadId: p.leadId ?? p.lead_id,
              businessName: p.businessName ?? p.business_name,
              slug: p.slug,
              title: p.title,
              html: p.html,
              createdAt: p.createdAt ?? p.created_at ?? now,
              updatedAt: p.updatedAt ?? p.updated_at ?? now,
            } satisfies Proposal,
            urlPath: `/p/${slug}`,
          })
        }
      }
    }

    const existing = await readDataFile<any>(PROPOSALS_FILE)
    const maxId = existing.length > 0 ? Math.max(...existing.map((l: any) => l.id || 0)) : 0
    const proposal: Proposal = {
      id: maxId + 1,
      leadId,
      businessName: lead.businessName,
      slug,
      title,
      html,
      createdAt: now,
      updatedAt: now,
    }
    await writeDataFile(PROPOSALS_FILE, [proposal, ...existing])

    return NextResponse.json({ success: true, proposal, urlPath: `/p/${slug}` })
  } catch (e: any) {
    console.error('Proposal generate error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to generate proposal' }, { status: 500 })
  }
}

