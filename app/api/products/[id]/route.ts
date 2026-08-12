import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { deleteDataFromSupabase, updateDataInSupabase } from '@/lib/supabaseDataUtils'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/lib/productsData'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const supabase = await getSupabaseClient()
        if (supabase) {
          const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

          if (!error && product) return NextResponse.json(product)
        }
      } catch {
        // fallback
      }
    }

    const products = await readDataFile<Product>('products.json')
    const product = products.find((p) => p.id === productId)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    const updatedProduct = await request.json()

    const updatesWithTimestamp = {
      ...updatedProduct,
      id: productId,
      updatedAt: new Date().toISOString(),
    }

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        const updated = await updateDataInSupabase('products', productId, updatesWithTimestamp)
        return NextResponse.json(updated)
      } catch (supabaseError: unknown) {
        if (supabaseError instanceof Error && supabaseError.message?.includes('not found')) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }
      }
    }

    const products = await readDataFile<Product>('products.json')
    const index = products.findIndex((p) => p.id === productId)
    if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    products[index] = { ...products[index], ...updatesWithTimestamp }
    await writeDataFile('products.json', products)
    return NextResponse.json(products[index])
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'
    ) {
      try {
        await deleteDataFromSupabase('products', productId)
        try {
          revalidatePath('/products')
          revalidatePath('/api/products')
          revalidatePath('/api/admin/products')
        } catch {
          // ignore
        }
        return NextResponse.json({ success: true })
      } catch (supabaseError: unknown) {
        if (supabaseError instanceof Error && supabaseError.message?.includes('not found')) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }
      }
    }

    const products = await readDataFile<Product>('products.json')
    const filtered = products.filter((p) => p.id !== productId)
    if (products.length === filtered.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await writeDataFile('products.json', filtered)
    try {
      revalidatePath('/products')
      revalidatePath('/api/products')
      revalidatePath('/api/admin/products')
    } catch {
      // ignore
    }
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
