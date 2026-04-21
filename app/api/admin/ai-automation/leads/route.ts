import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireAdminSecret } from '../_utils'

export const runtime = 'nodejs'

export type AiLead = {
  id: string
  createdAt: string
  source: 'reddit' | 'x' | 'indiehackers'
  sourceUrl: string
  title: string
  text: string
  author?: string
  score: number
  matchedKeywords: string[]
  status: 'new' | 'dismissed' | 'contacted'
  draftResponse?: string
  notes?: string
  respondedAt?: string
}

const FILENAME = 'ai-leads.json'

async function readAll(): Promise<AiLead[]> {
  const data = await readDataFile<AiLead>(FILENAME)
  return Array.isArray(data) ? data : []
}

export async function GET() {
  const leads = await readAll()
  leads.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  return NextResponse.json({ leads })
}

export async function PATCH(req: NextRequest) {
  try {
    requireAdminSecret(req)
    const body = (await req.json().catch(() => ({}))) as Partial<AiLead> & { id?: string }
    const id = String(body?.id || '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const leads = await readAll()
    const idx = leads.findIndex((l) => l.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const prev = leads[idx]
    const next: AiLead = {
      ...prev,
      status: (body?.status as any) || prev.status,
      draftResponse: typeof body?.draftResponse === 'string' ? body.draftResponse : prev.draftResponse,
      notes: typeof body?.notes === 'string' ? body.notes : prev.notes,
      respondedAt: body?.status === 'contacted' ? new Date().toISOString() : prev.respondedAt,
    }

    leads[idx] = next
    await writeDataFile(FILENAME, leads)
    return NextResponse.json({ ok: true, lead: next })
  } catch (e: any) {
    const msg = e?.message || 'Failed'
    const status = msg === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

