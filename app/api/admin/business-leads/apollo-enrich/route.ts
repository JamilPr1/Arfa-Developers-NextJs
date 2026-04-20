import { NextRequest, NextResponse } from 'next/server'
import { readDataFile, writeDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FILE = 'business-leads.json'

function getDomain(website?: string): string | null {
  if (!website) return null
  try {
    const raw = website.trim()
    const url = raw.startsWith('http') ? new URL(raw) : new URL(`https://${raw}`)
    return url.hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0]?.toLowerCase() || null
  }
}

function formatApolloNotes(input: {
  domain: string
  org?: any
  people?: Array<{ name?: string; title?: string; email?: string; linkedin_url?: string }>
}) {
  const lines: string[] = []
  lines.push('---')
  lines.push(`Apollo Enrichment (${new Date().toISOString()})`)
  lines.push(`Domain: ${input.domain}`)
  if (input.org?.name) lines.push(`Company: ${input.org.name}`)
  if (input.org?.industry) lines.push(`Industry: ${input.org.industry}`)
  if (input.org?.employee_count) lines.push(`Employees: ${input.org.employee_count}`)
  if (input.org?.estimated_num_employees) lines.push(`Employees (est): ${input.org.estimated_num_employees}`)
  lines.push('')
  lines.push('Decision makers / senior roles:')
  const people = Array.isArray(input.people) ? input.people : []
  if (people.length === 0) {
    lines.push('- (none returned)')
  } else {
    for (const p of people.slice(0, 10)) {
      const bits = [
        p.name || 'Unknown',
        p.title ? `— ${p.title}` : '',
        p.email ? `— ${p.email}` : '',
        p.linkedin_url ? `— ${p.linkedin_url}` : '',
      ].filter(Boolean)
      lines.push(`- ${bits.join(' ')}`)
    }
  }
  lines.push('---')
  return lines.join('\n')
}

async function apolloFetch(url: string, apiKey: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-api-key': apiKey,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apiKey = process.env.APOLLO_API_KEY || ''
    if (!apiKey) return NextResponse.json({ error: 'Missing APOLLO_API_KEY env var' }, { status: 500 })

    const body = (await req.json().catch(() => ({}))) as any
    const id = Number(body?.id || 0)
    const revealPersonalEmails = body?.revealPersonalEmails !== false
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Load lead from Supabase first, fall back to file/Redis store
    let storage: 'supabase' | 'file' = 'file'
    let lead: any = null

    const useSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'

    if (useSupabase) {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data } = await supabase.from('business_leads').select('*').eq('id', id).single()
        if (data) {
          lead = data
          storage = 'supabase'
        }
      }
    }

    if (!lead) {
      const leads = await readDataFile<any>(FILE)
      lead = leads.find((l: any) => Number(l?.id) === id) || null
      storage = 'file'
    }

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const website = lead.website ?? lead.url
    const domain = getDomain(website)
    if (!domain) return NextResponse.json({ error: 'Lead has no website/domain to enrich' }, { status: 400 })

    // 1) Organization enrich
    const orgResp = await apolloFetch(`https://api.apollo.io/api/v1/organizations/enrich?domain=${encodeURIComponent(domain)}`, apiKey)
    const orgJson = orgResp.ok ? await orgResp.json().catch(() => ({})) : {}
    const org = orgJson?.organization || orgJson?.organizations?.[0] || orgJson?.data?.organization || orgJson || {}

    // 2) People search for senior roles at domain
    const titles = [
      'Owner',
      'Founder',
      'Co-Founder',
      'CEO',
      'President',
      'Managing Director',
      'Director',
      'Operations Manager',
    ]
    const qs =
      `q_organization_domains_list[]=${encodeURIComponent(domain)}` +
      titles.map((t) => `&person_titles[]=${encodeURIComponent(t)}`).join('') +
      `&per_page=10`

    const peopleSearchResp = await apolloFetch(`https://api.apollo.io/api/v1/mixed_people/api_search?${qs}`, apiKey, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const peopleSearchJson = peopleSearchResp.ok ? await peopleSearchResp.json().catch(() => ({})) : {}
    const people = Array.isArray(peopleSearchJson?.people) ? peopleSearchJson.people : []

    // 3) Enrich people (emails) in bulk (max 10)
    let enrichedPeople: any[] = []
    const ids = people.map((p: any) => p?.id).filter(Boolean).slice(0, 10)
    if (ids.length > 0) {
      const bulkResp = await apolloFetch(
        `https://api.apollo.io/api/v1/people/bulk_match?reveal_personal_emails=${revealPersonalEmails ? 'true' : 'false'}&reveal_phone_number=false`,
        apiKey,
        {
          method: 'POST',
          body: JSON.stringify({
            details: ids.map((pid: string) => ({ id: pid })),
          }),
        }
      )
      const bulkJson = bulkResp.ok ? await bulkResp.json().catch(() => ({})) : {}
      enrichedPeople = Array.isArray(bulkJson?.people) ? bulkJson.people : Array.isArray(bulkJson?.persons) ? bulkJson.persons : []
    }

    const mappedPeople = (enrichedPeople.length ? enrichedPeople : people)
      .map((p: any) => ({
        name: [p?.first_name, p?.last_name].filter(Boolean).join(' ') || p?.name,
        title: p?.title || p?.headline,
        email: p?.email,
        linkedin_url: p?.linkedin_url,
      }))
      .filter((p: any) => p.name || p.title || p.email)

    const apolloNotes = formatApolloNotes({ domain, org, people: mappedPeople })
    const existingNotes = (lead.notes || '').trim()
    const newNotes = existingNotes ? `${existingNotes}\n\n${apolloNotes}` : apolloNotes

    const updates: any = { notes: newNotes }
    // If lead email is missing, set it to the best available decision-maker email
    if (!lead.email) {
      const bestEmail = mappedPeople.find((p: any) => typeof p.email === 'string' && p.email.includes('@'))?.email
      if (bestEmail) updates.email = bestEmail
    }

    if (storage === 'supabase') {
      const supabase = await getSupabaseClient()
      if (!supabase) return NextResponse.json({ error: 'Supabase not available' }, { status: 500 })
      const { data, error } = await supabase.from('business_leads').update(updates).eq('id', id).select('*').single()
      if (error) return NextResponse.json({ error: error.message || 'Apollo update failed' }, { status: 500 })
      return NextResponse.json({
        success: true,
        storage,
        updated: true,
        domain,
        organization: { name: org?.name, industry: org?.industry, primary_domain: org?.primary_domain },
        decisionMakersFound: mappedPeople.length,
        lead: data,
      })
    }

    const leads = await readDataFile<any>(FILE)
    const idx = leads.findIndex((l: any) => Number(l?.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Lead not found in storage' }, { status: 404 })
    leads[idx] = { ...leads[idx], ...updates }
    await writeDataFile(FILE, leads)

    return NextResponse.json({
      success: true,
      storage,
      updated: true,
      domain,
      organization: { name: org?.name, industry: org?.industry, primary_domain: org?.primary_domain },
      decisionMakersFound: mappedPeople.length,
      lead: leads[idx],
    })
  } catch (e: any) {
    console.error('Apollo enrich error:', e)
    return NextResponse.json({ error: e?.message || 'Apollo enrichment failed' }, { status: 500 })
  }
}

