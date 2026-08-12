import { NextResponse } from 'next/server'
import { readDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('sortOrder', { ascending: true })

          if (!error && products) {
            const response = NextResponse.json(products)
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            return response
          }
        }
      } catch {
        // fallback
      }
    }

    const products = await readDataFile('products.json')
    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
