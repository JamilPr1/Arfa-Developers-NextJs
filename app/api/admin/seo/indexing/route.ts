import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { listAccessibleGscSites, parseGscServiceAccount } from '@/lib/gscClient'

export const dynamic = 'force-dynamic'

const PRIORITY_URLS = [
  'https://www.arfadevelopers.com/project-rescue',
  'https://www.arfadevelopers.com/web-development-agency-usa',
  'https://www.arfadevelopers.com/free-audit',
  'https://www.arfadevelopers.com/website-rescue',
  'https://www.arfadevelopers.com/services/web-development',
  'https://www.arfadevelopers.com/blog/4',
  'https://www.arfadevelopers.com/blog/5',
]

export async function POST() {
  try {
    const { client_email, private_key } = parseGscServiceAccount()
    const { sites, ranked } = await listAccessibleGscSites()
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    })
    const indexing = google.indexing({ version: 'v3', auth })

    const results: { url: string; status: string; error?: string }[] = []
    for (const url of PRIORITY_URLS) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: { url, type: 'URL_UPDATED' },
        })
        results.push({ url, status: 'ok' })
      } catch (e: any) {
        results.push({ url, status: 'error', error: e?.message || String(e) })
      }
    }

    return NextResponse.json({
      serviceAccountEmail: client_email,
      accessibleSites: sites,
      gscPropertyUsed: ranked[0]?.siteUrl || null,
      results,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || 'Indexing request failed',
        hint:
          'Enable Indexing API in Google Cloud. Service account must be Owner on https://www.arfadevelopers.com in Search Console.',
      },
      { status: 500 }
    )
  }
}
