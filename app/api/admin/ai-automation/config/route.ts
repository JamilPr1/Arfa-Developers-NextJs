import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { requireAdminSecret } from '../_utils'

export const runtime = 'nodejs'

export type AiAutomationConfig = {
  id: number
  enabled: boolean
  minLeadScore: number
  keywords: string[]
  sources: {
    reddit: boolean
    x: boolean
    indieHackers: boolean
  }
  calendlyLink?: string
  updatedAt: string
}

const FILENAME = 'ai-automation-config.json'

async function readConfig(): Promise<AiAutomationConfig> {
  const arr = await readDataFile<AiAutomationConfig>(FILENAME)
  const cfg = arr?.[0]
  if (cfg) return cfg
  return {
    id: 1,
    enabled: true,
    minLeadScore: 70,
    keywords: [],
    sources: { reddit: true, x: true, indieHackers: true },
    calendlyLink: '',
    updatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const cfg = await readConfig()
  return NextResponse.json({ config: cfg })
}

export async function PUT(req: NextRequest) {
  try {
    requireAdminSecret(req)
    const body = (await req.json().catch(() => ({}))) as Partial<AiAutomationConfig>
    const current = await readConfig()
    const next: AiAutomationConfig = {
      ...current,
      ...body,
      id: 1,
      updatedAt: new Date().toISOString(),
      sources: {
        reddit: body?.sources?.reddit ?? current.sources.reddit,
        x: body?.sources?.x ?? current.sources.x,
        indieHackers: body?.sources?.indieHackers ?? current.sources.indieHackers,
      },
      keywords: Array.isArray(body?.keywords) ? body!.keywords.filter(Boolean).slice(0, 100) : current.keywords,
      minLeadScore: Number.isFinite(Number(body?.minLeadScore)) ? Number(body?.minLeadScore) : current.minLeadScore,
      enabled: typeof body?.enabled === 'boolean' ? body.enabled : current.enabled,
      calendlyLink: typeof body?.calendlyLink === 'string' ? body.calendlyLink : current.calendlyLink,
    }

    await writeDataFile(FILENAME, [next])
    return NextResponse.json({ ok: true, config: next })
  } catch (e: any) {
    const msg = e?.message || 'Failed to update config'
    const status = msg === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}

