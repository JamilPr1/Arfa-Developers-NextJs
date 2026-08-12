import { readDataFile } from './dataUtils'
import { getSupabaseClient } from './supabase'

export interface Product {
  id: number
  name: string
  slug: string
  shortDescription: string
  description: string
  image: string
  imageFit?: 'cover' | 'contain'
  gallery?: { src: string; caption: string }[]
  price: number
  currency: string
  priceDisplay?: string
  features: string[]
  benefits?: string[]
  category: string
  ctaText: string
  ctaLink: string
  demoLink?: string
  sortOrder: number
  published: boolean
  createdAt?: string
  updatedAt?: string
}

async function fetchFromSupabase(publishedOnly: boolean): Promise<Product[] | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build'
  ) {
    return null
  }

  try {
    const supabase = await getSupabaseClient()
    if (!supabase) return null

    let query = supabase.from('products').select('*').order('sortOrder', { ascending: true })
    if (publishedOnly) query = query.eq('published', true)

    const { data, error } = await query
    if (!error && data) return data as Product[]
  } catch {
    // fallback
  }
  return null
}

export async function getProducts(publishedOnly = true): Promise<Product[]> {
  const supabaseProducts = await fetchFromSupabase(publishedOnly)
  if (supabaseProducts) return supabaseProducts

  const products = await readDataFile<Product>('products.json')
  const filtered = publishedOnly ? products.filter((p) => p.published) : products
  return [...filtered].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts(false)
  const product = products.find((p) => p.slug === slug && p.published)
  return product || null
}

export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts(false)
  return products.find((p) => p.id === id) || null
}

export function formatProductPrice(product: Product): string {
  if (product.priceDisplay) return product.priceDisplay
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
    minimumFractionDigits: 0,
  }).format(product.price)
}
