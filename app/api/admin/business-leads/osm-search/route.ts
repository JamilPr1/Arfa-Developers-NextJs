import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Params = {
  query: string
  city: string
  country?: string
  limit?: number
  generateNotes?: boolean
}

type StoredBusinessLead = {
  id: number
  businessName: string
  address?: string
  phone?: string
  website?: string
  email?: string
  city?: string
  state?: string
  countryCode?: string
  source: string
  createdAt: string
  contacted: boolean
  notes?: string
}

const FILE = 'business-leads.json'

function dedupeKey(l: any) {
  const name = (l.businessName || l.business_name || l.name || '').toLowerCase().trim()
  const phone = (l.phone || l.phoneNumber || l.contact_phone || l['contact:phone'] || '').toLowerCase().trim()
  const website = (l.website || l.url || l.contact_website || l['contact:website'] || '').toLowerCase().trim()
  const address = (l.address || '').toLowerCase().trim()
  return `${name}|${phone}|${website}|${address}`
}

async function geocodeCity(city: string, country?: string) {
  const q = [city, country].filter(Boolean).join(', ')
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
  const resp = await fetch(url, {
    headers: {
      // Nominatim requires a valid UA string
      'User-Agent': 'ArfaDevelopersCRM/1.0 (business-leads)',
    },
    cache: 'no-store',
  })
  if (!resp.ok) throw new Error(`Geocoding failed (HTTP ${resp.status})`)
  const json = (await resp.json()) as any[]
  if (!Array.isArray(json) || json.length === 0) throw new Error('City not found (geocoding returned no results)')
  const first = json[0]
  return {
    lat: parseFloat(first.lat),
    lon: parseFloat(first.lon),
  }
}

async function overpassSearch(lat: number, lon: number, query: string, limit: number) {
  // Search within ~15km radius for common business POIs.
  // We fetch tagged nodes/ways/relations and then trim client-side.
  const radius = 25000
  const q = query.toLowerCase()
  const tokens = q
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 6)

  const tokenRegex = tokens.length > 0 ? tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') : ''

  // Keyword → OSM tag mapping for better results (e.g., plumbers)
  const keywordToTagFilters: Array<{ test: RegExp; filters: string[] }> = [
    { test: /\bplumb(er|ing)?\b/i, filters: ['nwr["craft"="plumber"]', 'nwr["shop"="plumber"]', 'nwr["office"="plumber"]'] },
    { test: /\belectric(ian|al)?\b/i, filters: ['nwr["craft"="electrician"]', 'nwr["shop"="electrical"]', 'nwr["office"="electrician"]'] },
    { test: /\bhvac\b|\bheating\b|\bair\s*conditioning\b/i, filters: ['nwr["craft"="hvac"]', 'nwr["shop"="hvac"]', 'nwr["office"="hvac"]'] },
    { test: /\broof(ing|er)?\b/i, filters: ['nwr["craft"="roofer"]', 'nwr["shop"="roofer"]', 'nwr["office"="roofer"]'] },
    { test: /\bdentist\b|\bdental\b/i, filters: ['nwr["amenity"="dentist"]'] },
    { test: /\blaw(y|yer)?\b|\battorney\b/i, filters: ['nwr["office"="lawyer"]'] },
    { test: /\breal\s*estate\b/i, filters: ['nwr["office"="estate_agent"]'] },
    { test: /\brestaurant\b/i, filters: ['nwr["amenity"="restaurant"]'] },
  ]

  const mapped = keywordToTagFilters.find((m) => m.test.test(query))
  const mappedFilters = mapped?.filters || []

  // Pass 1: try matching tokens in name (best relevance)
  const overpassQL = `
    [out:json][timeout:25];
    (
      ${tokenRegex ? `nwr["name"~"${tokenRegex}",i](around:${radius},${lat},${lon});` : ''}
    );
    out tags center ${Math.min(500, Math.max(50, limit * 8))};
  `

  // Pass 1b: mapped tags for service keywords (plumber, electrician, etc.)
  const overpassMappedQL = mappedFilters.length
    ? `
    [out:json][timeout:25];
    (
      ${mappedFilters.map((f) => `${f}(around:${radius},${lat},${lon});`).join('\n      ')}
    );
    out tags center ${Math.min(500, Math.max(50, limit * 8))};
  `
    : ''

  // Pass 2 fallback: pull common business POIs if name match returns none
  const overpassFallbackQL = `
    [out:json][timeout:25];
    (
      nwr["office"](around:${radius},${lat},${lon});
      nwr["shop"](around:${radius},${lat},${lon});
      nwr["amenity"](around:${radius},${lat},${lon});
      nwr["craft"](around:${radius},${lat},${lon});
    );
    out tags center ${Math.min(500, Math.max(50, limit * 8))};
  `

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.nchc.org.tw/api/interpreter',
  ]

  let lastErr: any = null
  for (const endpoint of endpoints) {
    try {
      const doFetch = async (ql: string) =>
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Accept: 'application/json',
            // Some instances reject without a UA
            'User-Agent': 'ArfaDevelopersCRM/1.0 (business-leads)',
          },
          body: `data=${encodeURIComponent(ql)}`,
          cache: 'no-store',
        })

      // Prefer mapped query when available, then token name query
      let resp = overpassMappedQL ? await doFetch(overpassMappedQL) : await doFetch(overpassQL)

      if (!resp.ok) {
        // 429/503 are common when overloaded; try next mirror
        const text = await resp.text().catch(() => '')
        const retryable = [406, 429, 500, 502, 503, 504].includes(resp.status)
        const msg = `Overpass failed (HTTP ${resp.status}) at ${endpoint}${text ? `: ${text.slice(0, 200)}` : ''}`
        if (retryable) {
          lastErr = new Error(msg)
          continue
        }
        throw new Error(msg)
      }

      let json = (await resp.json()) as any
      let elements = Array.isArray(json?.elements) ? json.elements : []

      // If mapped query returned nothing, try token query before fallback
      if (elements.length === 0 && overpassMappedQL) {
        resp = await doFetch(overpassQL)
        if (resp.ok) {
          json = (await resp.json()) as any
          elements = Array.isArray(json?.elements) ? json.elements : []
        }
      }

      // If token-match query returned nothing, try fallback query on same mirror
      if (elements.length === 0) {
        resp = await doFetch(overpassFallbackQL)
        if (resp.ok) {
          json = (await resp.json()) as any
          elements = Array.isArray(json?.elements) ? json.elements : []
        }
      }

      // Filter/scoring by tokens (if provided); otherwise accept entries with a name
      const scored = elements
        .map((el: any) => {
          const tags = el.tags || {}
          const name = String(tags.name || '').trim()
          const hay = `${name} ${tags.shop || ''} ${tags.office || ''} ${tags.amenity || ''} ${tags.craft || ''}`.toLowerCase()
          const score =
            tokens.length === 0
              ? (name ? 1 : 0)
              : tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0) + (name ? 1 : 0)
          return { el, tags, name, score }
        })
        .filter((x: any) => x.name && x.score > 0)
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
        .slice(0, limit)

      return scored.map((x: any) => {
        const t = x.tags
        const address = [
          t['addr:housenumber'],
          t['addr:street'],
          t['addr:city'],
          t['addr:state'],
          t['addr:postcode'],
          t['addr:country'],
        ]
          .filter(Boolean)
          .join(' ')
          .trim()

        return {
          businessName: x.name,
          address: address || undefined,
          phone: t.phone || t['contact:phone'] || undefined,
          website: t.website || t['contact:website'] || undefined,
          email: t.email || t['contact:email'] || undefined,
          city: t['addr:city'] || undefined,
          state: t['addr:state'] || undefined,
        }
      })
    } catch (err: any) {
      lastErr = err
      continue
    }
  }

  throw lastErr || new Error('Overpass failed (all endpoints)')
}

export async function POST(req: NextRequest) {
  try {
    // Protect this admin tool (same secret used by imports)
    const secret = req.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as Params
    const query = (body?.query || '').trim()
    const city = (body?.city || '').trim()
    const country = (body?.country || '').trim()
    const limit = Math.min(50, Math.max(1, Number(body?.limit || 20)))
    const generateNotes = !!body?.generateNotes

    if (!query || !city) {
      return NextResponse.json({ error: 'Missing query or city' }, { status: 400 })
    }

    const { lat, lon } = await geocodeCity(city, country)
    const results = await overpassSearch(lat, lon, query, limit)

    const existing = await readDataFile<any>(FILE)
    const maxId = existing.length > 0 ? Math.max(...existing.map((l: any) => l.id || 0)) : 0
    const existingKeys = new Set(existing.map(dedupeKey))

    let nextId = maxId + 1
    const now = new Date().toISOString()
    const inserted: StoredBusinessLead[] = []

    for (const r of results) {
      const lead: StoredBusinessLead = {
        id: nextId,
        businessName: r.businessName,
        address: r.address,
        phone: r.phone,
        website: r.website,
        email: r.email,
        city: r.city || city,
        state: r.state,
        countryCode: country ? country.toLowerCase().slice(0, 2) : undefined,
        source: 'osm',
        createdAt: now,
        contacted: false,
      }
      const key = dedupeKey(lead)
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      inserted.push(lead)
      nextId++
    }

    const merged = [...inserted, ...existing]

    // Website enrichment: try to extract missing phone/email from website pages
    const enrichFromWebsite = async (lead: StoredBusinessLead) => {
      if (!lead.website) return lead
      if (lead.email && lead.phone) return lead

      const raw = lead.website.trim()
      const base = raw.startsWith('http') ? raw : `https://${raw}`
      const baseNoTrail = base.replace(/\/+$/, '')
      const candidates = [
        baseNoTrail,
        `${baseNoTrail}/contact`,
        `${baseNoTrail}/contact-us`,
        `${baseNoTrail}/about`,
        `${baseNoTrail}/about-us`,
        `${baseNoTrail}/privacy`,
      ]

      const extract = (html: string) => {
        const mailto = html.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)?.[1]
        const email = mailto || html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
        const tel = html.match(/tel:([^"'>\s]+)/i)?.[1]
        const phone = tel ? tel.replace(/[^\d+]/g, '') : html.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[1]?.trim()
        return { email, phone }
      }

      for (const url of candidates) {
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'ArfaDevelopersCRM/1.0 (business-leads)' },
          cache: 'no-store',
        }).catch(() => null as any)
        if (!resp || !resp.ok) continue
        const html = await resp.text().catch(() => '')
        if (!html) continue
        const { email, phone } = extract(html)
        if (!lead.email && email) lead.email = email
        if (!lead.phone && phone) lead.phone = phone
        if (lead.email && lead.phone) break
      }

      return lead
    }

    // limit enrichment work
    const maxEnrich = 15
    const toEnrich = inserted.filter((l) => l.website).slice(0, maxEnrich)
    for (const l of toEnrich) {
      try {
        await enrichFromWebsite(l)
      } catch {
        // ignore
      }
    }

    // Optional AI notes generation (best-effort; does not block saving leads)
    if (generateNotes) {
      const apiKey = process.env.OPENAI_API_KEY || ''

      const template = (lead: StoredBusinessLead) => {
        const biz = lead.businessName
        const loc = [lead.city, lead.state, lead.countryCode?.toUpperCase()].filter(Boolean).join(', ')
        return [
          `Business: ${biz}${loc ? ` (${loc})` : ''}`,
          '',
          `What they likely do: Based on the query "${query}", this business may offer related services.`,
          '',
          'Likely pain points:',
          '- Weak/old website or not ranking on Google',
          '- Slow site / poor mobile UX',
          '- Low conversions (no clear offer, forms, tracking)',
          '',
          'What Arfa Developers can offer:',
          '- Website redesign or new conversion-focused site (Next.js)',
          '- Technical SEO + speed optimization + tracking',
          '- Ongoing maintenance & support',
          '',
          'Outreach angle:',
          `- Offer a free audit + quick wins tailored to "${query}".`,
        ].join('\n')
      }

      const genOne = async (lead: StoredBusinessLead) => {
        if (!apiKey) return template(lead)
        const prompt = [
          'You are a B2B sales assistant for a software development agency.',
          'Write concise, actionable notes for outreach.',
          'Return ONLY plain text with sections:',
          '1) What they do',
          '2) Likely pain points',
          '3) What we can offer',
          '4) A 2-sentence outreach opener',
          '',
          `Business: ${lead.businessName}`,
          `Location: ${[lead.city, lead.state, lead.countryCode].filter(Boolean).join(', ')}`,
          `Search query used to find them: ${query}`,
          `Address: ${lead.address || ''}`,
          `Website: ${lead.website || ''}`,
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
              { role: 'system', content: 'You write short B2B lead research notes.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
          }),
        })
        if (!resp.ok) return template(lead)
        const json = await resp.json().catch(() => null)
        const text = json?.choices?.[0]?.message?.content
        return typeof text === 'string' && text.trim().length > 0 ? text.trim() : template(lead)
      }

      const maxToGenerate = 20
      const toGen = inserted.slice(0, maxToGenerate)
      for (const l of toGen) {
        try {
          l.notes = await genOne(l)
        } catch {
          l.notes = template(l)
        }
      }
    }

    await writeDataFile(FILE, merged)

    return NextResponse.json({ success: true, inserted: inserted.length, totalFetched: results.length })
  } catch (e: any) {
    console.error('OSM search error:', e)
    return NextResponse.json({ error: e?.message || 'OSM search failed' }, { status: 500 })
  }
}

