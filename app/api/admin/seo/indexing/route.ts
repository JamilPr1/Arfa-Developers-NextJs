import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

const PRIORITY_URLS = [
  'https://www.arfadevelopers.com/project-rescue',
  'https://www.arfadevelopers.com/web-development-agency-usa',
  'https://www.arfadevelopers.com/free-audit',
  'https://www.arfadevelopers.com/blog/4',
  'https://www.arfadevelopers.com/blog/5',
]

function parseServiceAccount(): { client_email: string; private_key: string } {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
  if (!raw) throw new Error('Missing GSC_SERVICE_ACCOUNT_JSON')
  let jsonText = raw.trim()
  if (!jsonText.startsWith('{')) {
    jsonText = Buffer.from(jsonText, 'base64').toString('utf8')
  }
  const parsed = JSON.parse(jsonText)
  return {
    client_email: String(parsed.client_email),
    private_key: String(parsed.private_key).replace(/\\n/g, '\n'),
  }
}

export async function POST() {
  try {
    const { client_email, private_key } = parseServiceAccount()
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
