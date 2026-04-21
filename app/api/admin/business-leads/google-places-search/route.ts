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

async function googleSearchText(apiKey: string, textQuery: string, limit: number) {
  const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      // Keep the mask minimal; details are fetched in step 2
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: Math.min(20, Math.max(1, limit)),
    }),
    cache: 'no-store',
  })

  const text = await resp.text().catch(() => '')
  let json: any = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = {}
  }

  if (!resp.ok) {
    throw new Error(json?.error?.message || json?.message || `Google Places search failed (HTTP ${resp.status})`)
  }

  const places = Array.isArray(json?.places) ? json.places : []
  return places
}

async function googlePlaceDetails(apiKey: string, placeId: string) {
  const resp = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,websiteUri,internationalPhoneNumber,nationalPhoneNumber,googleMapsUri,businessStatus,types,primaryType,primaryTypeDisplayName,rating,userRatingCount,priceLevel,location,plusCode',
    },
    cache: 'no-store',
  })

  const text = await resp.text().catch(() => '')
  let json: any = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = {}
  }

  if (!resp.ok) {
    throw new Error(json?.error?.message || json?.message || `Google Places details failed (HTTP ${resp.status})`)
  }

  return json
}

function googleMetaNotes(place: any) {
  const lines: string[] = []
  lines.push('---')
  lines.push(`Google Places (${new Date().toISOString()})`)
  if (place?.id) lines.push(`Place ID: ${place.id}`)
  if (place?.googleMapsUri) lines.push(`Maps: ${place.googleMapsUri}`)
  if (place?.businessStatus) lines.push(`Status: ${place.businessStatus}`)
  if (typeof place?.rating === 'number') {
    lines.push(`Rating: ${place.rating}${typeof place?.userRatingCount === 'number' ? ` (${place.userRatingCount} reviews)` : ''}`)
  }
  if (place?.primaryTypeDisplayName?.text) lines.push(`Category: ${place.primaryTypeDisplayName.text}`)
  else if (place?.primaryType) lines.push(`Category: ${place.primaryType}`)
  const types = Array.isArray(place?.types) ? place.types.slice(0, 6).join(', ') : ''
  if (types) lines.push(`Types: ${types}`)
  if (place?.location?.latitude && place?.location?.longitude) {
    lines.push(`Lat/Lng: ${place.location.latitude}, ${place.location.longitude}`)
  }
  lines.push('---')
  return lines.join('\n')
}

function placeToLead(place: any, city: string, country: string): Omit<StoredBusinessLead, 'id' | 'createdAt' | 'contacted'> {
  const name = place?.displayName?.text || place?.displayName || place?.name || 'Unknown'
  const address = place?.formattedAddress
  const phone = place?.internationalPhoneNumber || place?.nationalPhoneNumber
  const website = place?.websiteUri || undefined
  return {
    businessName: String(name),
    address: typeof address === 'string' ? address : undefined,
    phone: typeof phone === 'string' ? phone : undefined,
    website: typeof website === 'string' ? website : undefined,
    email: undefined,
    city,
    state: undefined,
    countryCode: country ? country.toLowerCase().slice(0, 2) : undefined,
    source: 'google',
    notes: googleMetaNotes(place),
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ''
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) env var in Vercel' },
        { status: 500 }
      )
    }

    const body = (await req.json()) as Params
    const query = (body?.query || '').trim()
    const city = (body?.city || '').trim()
    const country = (body?.country || '').trim()
    const limit = Math.min(50, Math.max(1, Number(body?.limit || 20)))
    const generateNotes = !!body?.generateNotes

    if (!query || !city) return NextResponse.json({ error: 'Missing query or city' }, { status: 400 })

    const textQuery = `${query} in ${city}${country ? `, ${country}` : ''}`
    const found = await googleSearchText(apiKey, textQuery, Math.min(limit, 20))

    // For richer data (website/phone), fetch place details for up to limit
    const placeIds = found.map((p: any) => p?.id).filter(Boolean).slice(0, limit)
    const detailedPlaces: any[] = []
    for (const pid of placeIds) {
      try {
        detailedPlaces.push(await googlePlaceDetails(apiKey, pid))
      } catch {
        // ignore single-place failures
      }
    }

    const results = detailedPlaces.length ? detailedPlaces : found

    const existing = await readDataFile<any>(FILE)
    const maxId = existing.length > 0 ? Math.max(...existing.map((l: any) => l.id || 0)) : 0
    const existingKeys = new Set(existing.map(dedupeKey))

    let nextId = maxId + 1
    const now = new Date().toISOString()
    const inserted: StoredBusinessLead[] = []

    for (const p of results) {
      const base = placeToLead(p, city, country)
      const lead: StoredBusinessLead = {
        id: nextId,
        ...base,
        createdAt: now,
        contacted: false,
      }
      const key = dedupeKey(lead)
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      inserted.push(lead)
      nextId++
    }

    // Optional AI notes (same approach as OSM)
    if (generateNotes) {
      const apiKeyOpenAI = process.env.OPENAI_API_KEY || ''
      const template = (lead: StoredBusinessLead) => {
        const biz = lead.businessName
        const loc = [lead.city, lead.state, lead.countryCode?.toUpperCase()].filter(Boolean).join(', ')
        return [
          `Business: ${biz}${loc ? ` (${loc})` : ''}`,
          '',
          `What they likely do: Found via Google Places query "${query}".`,
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
        if (!apiKeyOpenAI) return template(lead)
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
            Authorization: `Bearer ${apiKeyOpenAI}`,
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

    const merged = [...inserted, ...existing]
    await writeDataFile(FILE, merged)

    return NextResponse.json({ success: true, inserted: inserted.length, totalFetched: results.length, fetchSource: 'google' })
  } catch (e: any) {
    console.error('Google Places search error:', e)
    return NextResponse.json({ error: e?.message || 'Google Places search failed' }, { status: 500 })
  }
}

