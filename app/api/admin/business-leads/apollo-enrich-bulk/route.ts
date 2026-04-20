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

async function enrichOneLead(input: {
  apiKey: string
  lead: any
  revealPersonalEmails: boolean
}) {
  const website = input.lead.website ?? input.lead.url
  const domain = getDomain(website)
  if (!domain) return { ok: false, reason: 'no_domain' as const }

  const orgResp = await apolloFetch(
    `https://api.apollo.io/api/v1/organizations/enrich?domain=${encodeURIComponent(domain)}`,
    input.apiKey
  )
  const orgJson = orgResp.ok ? await orgResp.json().catch(() => ({})) : {}
  const org = orgJson?.organization || orgJson?.organizations?.[0] || orgJson?.data?.organization || orgJson || {}

  const titles = ['Owner', 'Founder', 'Co-Founder', 'CEO', 'President', 'Managing Director', 'Director', 'Operations Manager']
  const qs =
    `q_organization_domains_list[]=${encodeURIComponent(domain)}` +
    titles.map((t) => `&person_titles[]=${encodeURIComponent(t)}`).join('') +
    `&per_page=10`

  const peopleSearchResp = await apolloFetch(`https://api.apollo.io/api/v1/mixed_people/api_search?${qs}`, input.apiKey, {
    method: 'POST',
    body: JSON.stringify({}),
  })
  const peopleSearchJson = peopleSearchResp.ok ? await peopleSearchResp.json().catch(() => ({})) : {}
  const people = Array.isArray(peopleSearchJson?.people) ? peopleSearchJson.people : []

  let enrichedPeople: any[] = []
  const ids = people.map((p: any) => p?.id).filter(Boolean).slice(0, 10)
  if (ids.length > 0) {
    const bulkResp = await apolloFetch(
      `https://api.apollo.io/api/v1/people/bulk_match?reveal_personal_emails=${input.revealPersonalEmails ? 'true' : 'false'}&reveal_phone_number=false`,
      input.apiKey,
      {
        method: 'POST',
        body: JSON.stringify({ details: ids.map((pid: string) => ({ id: pid })) }),
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
  const existingNotes = (input.lead.notes || '').trim()
  const newNotes = existingNotes ? `${existingNotes}\n\n${apolloNotes}` : apolloNotes

  const updates: any = { notes: newNotes }
  if (!input.lead.email) {
    const bestEmail = mappedPeople.find((p: any) => typeof p.email === 'string' && p.email.includes('@'))?.email
    if (bestEmail) updates.email = bestEmail
  }

  return { ok: true, domain, updates, decisionMakersFound: mappedPeople.length }
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-import-secret') || ''
    const expected = process.env.LEADS_IMPORT_SECRET || ''
    if (!expected || secret !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apiKey = process.env.APOLLO_API_KEY || ''
    if (!apiKey) return NextResponse.json({ error: 'Missing APOLLO_API_KEY env var' }, { status: 500 })

    const body = (await req.json().catch(() => ({}))) as any
    const limit = Math.min(50, Math.max(1, Number(body?.limit || 10))) // keep safe by default (credits + rate limits)
    const onlyMissingEmail = body?.onlyMissingEmail !== false
    const revealPersonalEmails = body?.revealPersonalEmails !== false

    const useSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      process.env.NEXT_PHASE !== 'phase-development-build'

    // Load leads
    let storage: 'supabase' | 'file' = 'file'
    let leads: any[] = []
    let supabase: any = null

    if (useSupabase) {
      supabase = await getSupabaseClient()
      if (supabase) {
        let q = supabase.from('business_leads').select('*').order('created_at', { ascending: false }).limit(limit)
        if (onlyMissingEmail) q = q.is('email', null)
        const { data, error } = await q
        if (!error && Array.isArray(data) && data.length > 0) {
          leads = data
          storage = 'supabase'
        }
      }
    }

    if (leads.length === 0) {
      const all = await readDataFile<any>(FILE)
      leads = onlyMissingEmail ? all.filter((l: any) => !l?.email) : all
      leads = leads.slice(0, limit)
      storage = 'file'
    }

    let scanned = 0
    let updated = 0
    let skipped = 0
    const errors: Array<{ id?: number; error: string }> = []

    // Process sequentially to avoid rate limits
    for (const lead of leads) {
      scanned++
      if (!lead?.website && !lead?.url) {
        skipped++
        continue
      }
      try {
        const result = await enrichOneLead({ apiKey, lead, revealPersonalEmails })
        if (!result.ok) {
          skipped++
          continue
        }

        if (storage === 'supabase') {
          if (!supabase) {
            errors.push({ id: lead?.id, error: 'Supabase unavailable' })
            continue
          }
          const { error: upErr } = await supabase.from('business_leads').update(result.updates).eq('id', lead.id)
          if (!upErr) updated++
          else errors.push({ id: lead?.id, error: upErr.message || 'Update failed' })
        } else {
          // update fallback store
          const all = await readDataFile<any>(FILE)
          const idx = all.findIndex((l: any) => Number(l?.id) === Number(lead?.id))
          if (idx !== -1) {
            all[idx] = { ...all[idx], ...result.updates }
            await writeDataFile(FILE, all)
            updated++
          } else {
            skipped++
          }
        }
      } catch (e: any) {
        errors.push({ id: lead?.id, error: e?.message || 'Apollo enrich failed' })
      }
    }

    return NextResponse.json({ success: true, storage, scanned, updated, skipped, errors: errors.slice(0, 20) })
  } catch (e: any) {
    console.error('Apollo bulk enrich error:', e)
    return NextResponse.json({ error: e?.message || 'Apollo bulk enrichment failed' }, { status: 500 })
  }
}

