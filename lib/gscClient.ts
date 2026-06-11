import { google } from 'googleapis'

export type GscSiteEntry = {
  siteUrl?: string | null
  permissionLevel?: string | null
}

export function parseGscServiceAccount(): { client_email: string; private_key: string } {
  const raw =
    process.env.GSC_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    ''

  if (!raw) {
    throw new Error('Missing GSC_SERVICE_ACCOUNT_JSON')
  }

  let jsonText = raw.trim()
  if (!jsonText.startsWith('{')) {
    try {
      jsonText = Buffer.from(jsonText, 'base64').toString('utf8')
    } catch {
      /* ignore */
    }
  }

  const parsed = JSON.parse(jsonText)
  if (!parsed?.client_email || !parsed?.private_key) {
    throw new Error('Invalid service account JSON. Must include client_email and private_key.')
  }

  return {
    client_email: String(parsed.client_email),
    private_key: String(parsed.private_key).replace(/\\n/g, '\n'),
  }
}

export function createSearchConsoleClient() {
  const { client_email, private_key } = parseGscServiceAccount()
  const auth = new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  return {
    client_email,
    searchconsole: google.searchconsole({ version: 'v1', auth }),
  }
}

/** Rank GSC properties: prefer full www site over /sitemap.xml/ prefix. */
export function rankGscSites(sites: GscSiteEntry[], host = 'arfadevelopers.com'): GscSiteEntry[] {
  const score = (entry: GscSiteEntry) => {
    const u = entry.siteUrl || ''
    if (!u.toLowerCase().includes(host)) return -1000
    let s = 0
    if (u === 'https://www.arfadevelopers.com/') s += 1000
    if (u === 'https://www.arfadevelopers.com') s += 900
    if (u.startsWith('sc-domain:arfadevelopers.com')) s += 800
    if (u.includes('www.')) s += 50
    if (u.includes('/sitemap.xml')) s -= 500
    if (u.endsWith('/')) s += 5
    return s
  }
  return [...sites].sort((a, b) => score(b) - score(a))
}

export async function listAccessibleGscSites() {
  const { client_email, searchconsole } = createSearchConsoleClient()
  const res = await searchconsole.sites.list()
  const sites = (res.data.siteEntry || []) as GscSiteEntry[]
  return { client_email, sites, ranked: rankGscSites(sites) }
}

export function siteUrlCandidates(configured?: string): string[] {
  const defaults = ['https://www.arfadevelopers.com/', 'https://www.arfadevelopers.com']
  const raw = (configured || '').trim()
  const candidates = new Set<string>(defaults)
  if (raw) {
    candidates.add(raw)
    const noSlash = raw.replace(/\/$/, '')
    candidates.add(noSlash)
    candidates.add(`${noSlash}/`)
  }
  return Array.from(candidates)
}
