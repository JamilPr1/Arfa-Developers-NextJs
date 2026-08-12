import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { insertDataToSupabase } from '@/lib/supabaseDataUtils'
import type { Product } from '@/lib/productsData'

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
            .eq('published', true)
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

    const products = await readDataFile<Product>('products.json')
    const published = products
      .filter((p) => p.published)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    const response = NextResponse.json(published)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()

    const newProduct = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const created = await insertDataToSupabase('products', newProduct)
        return NextResponse.json(created, { status: 201 })
      } catch {
        // fallback
      }
    }

    const products = await readDataFile<Product>('products.json')
    const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id || 0)) : 0
    const productWithId = { ...newProduct, id: maxId + 1 }

    products.push(productWithId)
    await writeDataFile('products.json', products)
    return NextResponse.json(productWithId, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
