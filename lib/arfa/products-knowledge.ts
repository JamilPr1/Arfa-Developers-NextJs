import productsData from '@/lib/data/products.json'

export interface ProductKnowledgeEntry {
  name: string
  slug: string
  url: string
  category: string
  price: string
  shortDescription: string
  description: string
  features: string[]
  benefits: string[]
  ctaText: string
}

type RawProduct = {
  name: string
  slug: string
  category: string
  price: number
  currency: string
  priceDisplay?: string
  shortDescription: string
  description: string
  features: string[]
  benefits?: string[]
  ctaText: string
  published: boolean
  sortOrder?: number
}

/** Client-safe product knowledge — imports JSON (no Node fs). */
export function getProductsKnowledge(): ProductKnowledgeEntry[] {
  const products = productsData as RawProduct[]

  return products
    .filter((p) => p.published)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      url: `/products/${p.slug}`,
      category: p.category,
      price:
        p.priceDisplay ||
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: p.currency || 'USD',
          minimumFractionDigits: 0,
        }).format(p.price),
      shortDescription: p.shortDescription,
      description: p.description,
      features: p.features || [],
      benefits: p.benefits || [],
      ctaText: p.ctaText,
    }))
}

export function findProductByQuery(query: string): ProductKnowledgeEntry | undefined {
  const lower = query.toLowerCase()
  const products = getProductsKnowledge()

  return products.find((p) => {
    const slugWords = p.slug.replace(/-/g, ' ')
    return (
      lower.includes(p.slug) ||
      lower.includes(slugWords) ||
      lower.includes(p.name.toLowerCase()) ||
      p.name
        .toLowerCase()
        .split(/\s+/)
        .every((word) => word.length > 2 && lower.includes(word))
    )
  })
}

export function formatProductListForVoice(): string {
  const products = getProductsKnowledge()
  if (!products.length) return 'Visit /products for our software catalog.'

  return products
    .map((p) => `${p.name} (${p.price}) — ${p.shortDescription} Details at ${p.url}`)
    .join('\n')
}
