import { NextRequest, NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FILE = 'proposals.json'

export async function GET(_req: NextRequest, ctx: { params: { slug: string } }) {
  const slug = String(ctx?.params?.slug || '').trim()
  if (!slug) return new NextResponse('Not found', { status: 404 })

  // Supabase first
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PHASE !== 'phase-production-build' &&
    process.env.NEXT_PHASE !== 'phase-development-build'
  ) {
    try {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data, error } = await supabase.from('proposals').select('html,title').eq('slug', slug).single()
        if (!error && data?.html) {
          return new NextResponse(String(data.html), {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store',
              'X-Robots-Tag': 'noindex, nofollow',
            },
          })
        }
      }
    } catch {
      // fall through
    }
  }

  const proposals = await readDataFile<any>(FILE)
  const found = proposals.find((p: any) => String(p?.slug) === slug)
  if (!found?.html) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(String(found.html), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

