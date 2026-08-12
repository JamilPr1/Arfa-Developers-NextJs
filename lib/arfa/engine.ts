import { WEBSITE_KNOWLEDGE } from './knowledge-base'
import { findProductByQuery, formatProductListForVoice, getProductsKnowledge } from './products-knowledge'
import type { ArfaResponse } from './types'

const FALLBACK =
  "I don't have that information. Would you like me to connect you with our team for a free consultation?"

function includesAny(text: string, words: string[]): boolean {
  const lower = text.toLowerCase()
  return words.some((w) => lower.includes(w))
}

export function processArfaQuery(transcript: string): ArfaResponse {
  const lower = transcript.toLowerCase().trim()
  const { company, pricing, services } = WEBSITE_KNOWLEDGE

  if (!lower || includesAny(lower, ['hello', 'hi', 'hey', 'start', 'help'])) {
    return {
      text: `Hi! I'm Arfa, your AI assistant for ${company.name}. I can tell you about our web development services, pricing, project rescue, or help you get in touch. What would you like to know?`,
      intent: 'greeting',
      action: { type: 'none' },
    }
  }

  if (includesAny(lower, ['contact', 'reach', 'email', 'phone', 'call', 'consultation', 'quote', 'get started'])) {
    return {
      text: `You can reach us at ${company.contact.email} or ${company.contact.phone}. I'd be happy to connect you with our team for a free consultation.`,
      intent: 'contact',
      action: { type: 'open_contact', payload: { url: '/contact' } },
    }
  }

  if (includesAny(lower, ['price', 'pricing', 'cost', 'how much', 'budget', 'package'])) {
    const ranges = pricing.map((p) => `${p.name}: ${p.range}`).join('. ')
    return {
      text: `Our pricing is transparent with no hidden costs. ${ranges}. Would you like to see our full pricing page?`,
      intent: 'pricing',
      action: { type: 'navigate', payload: { url: '/pricing' } },
    }
  }

  if (includesAny(lower, ['rescue', 'failed', 'abandoned', 'broken', 'freelancer', 'takeover', 'fix my project'])) {
    return {
      text: `Project rescue is one of our specialties. We've successfully rescued over 200 abandoned or poorly built projects. We assess, fix, and rebuild — often delivering working solutions in days. Want to learn more?`,
      intent: 'project_rescue',
      action: { type: 'navigate', payload: { url: '/project-rescue' } },
    }
  }

  if (includesAny(lower, ['portfolio', 'work', 'projects', 'case stud'])) {
    return {
      text: 'You can browse our portfolio and case studies to see projects we have delivered. I can take you there now.',
      intent: 'portfolio',
      action: { type: 'navigate', payload: { url: '/portfolio' } },
    }
  }

  if (includesAny(lower, ['service', 'what do you do', 'what you offer', 'capabilities'])) {
    const list = services.slice(0, 4).map((s) => s.name).join(', ')
    return {
      text: `We offer ${list}, and more. We're a US-focused agency specializing in custom web apps and project rescue. What area interests you most?`,
      intent: 'services',
      action: { type: 'none' },
    }
  }

  if (includesAny(lower, ['about', 'who are you', 'company', 'team'])) {
    return {
      text: company.about,
      intent: 'about',
      action: { type: 'navigate', payload: { url: '/about' } },
    }
  }

  if (includesAny(lower, ['next.js', 'nextjs', 'react', 'technology', 'tech stack'])) {
    return {
      text: 'We build with React, Next.js, Node.js, React Native, and Flutter. We also work with AWS, Azure, and GCP for cloud infrastructure.',
      intent: 'tech',
      action: { type: 'none' },
    }
  }

  if (includesAny(lower, ['location', 'where', 'based', 'usa', 'pakistan'])) {
    return {
      text: `We're based in ${company.locations} and ${company.serving.toLowerCase()}, with a focus on US businesses.`,
      intent: 'location',
      action: { type: 'none' },
    }
  }

  if (includesAny(lower, ['product', 'software', 'catalog', 'what do you sell', 'what do you build'])) {
    const products = getProductsKnowledge()
    if (products.length === 0) {
      return {
        text: 'We build software products for businesses. Visit our products page for the full catalog.',
        intent: 'products',
        action: { type: 'navigate', payload: { url: '/products' } },
      }
    }

    const matched = findProductByQuery(lower)
    if (matched) {
      const features = matched.features.slice(0, 3).join(', ')
      return {
        text: `${matched.name} is ${matched.price}. ${matched.shortDescription} Key features include ${features}. I can take you to the full product page.`,
        intent: 'product_detail',
        action: { type: 'navigate', payload: { url: matched.url } },
      }
    }

    const names = products.slice(0, 6).map((p) => p.name).join(', ')
    return {
      text: `We offer ${products.length} software products including ${names}, and more. I can take you to our products page to compare features and pricing.`,
      intent: 'products',
      action: { type: 'navigate', payload: { url: '/products' } },
    }
  }

  // Match individual product names even without the word "product"
  const productMatch = findProductByQuery(lower)
  if (productMatch) {
    const features = productMatch.features.slice(0, 3).join(', ')
    return {
      text: `${productMatch.name} is ${productMatch.price}. ${productMatch.shortDescription} Key features: ${features}.`,
      intent: 'product_detail',
      action: { type: 'navigate', payload: { url: productMatch.url } },
    }
  }

  return {
    text: FALLBACK,
    intent: 'unknown',
    action: { type: 'open_contact', payload: { url: '/contact' } },
  }
}
