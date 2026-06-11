import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseServiceAccount(): { client_email: string; private_key: string } {
  const raw =
    process.env.GSC_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    ''

  if (!raw) {
    throw new Error(
      'Missing service account JSON. Set GSC_SERVICE_ACCOUNT_JSON (recommended) or GOOGLE_SERVICE_ACCOUNT_JSON in Vercel env vars.'
    )
  }

  let jsonText = raw.trim()

  // Support base64-encoded JSON
  if (!jsonText.startsWith('{')) {
    try {
      jsonText = Buffer.from(jsonText, 'base64').toString('utf8')
    } catch {
      // ignore, will fail JSON.parse below
    }
  }

  const parsed = JSON.parse(jsonText)
  if (!parsed?.client_email || !parsed?.private_key) {
    throw new Error('Invalid service account JSON. Must include client_email and private_key.')
  }

  // Fix escaped newlines
  const private_key = String(parsed.private_key).replace(/\\n/g, '\n')

  return {
    client_email: String(parsed.client_email),
    private_key,
  }
}

function toISODate(d: Date): string {
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10)
}

export async function GET(request: NextRequest) {
  const hasCredentials = !!(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  )

  if (!hasCredentials) {
    return NextResponse.json(
      {
        error:
          'Missing service account JSON. Set GSC_SERVICE_ACCOUNT_JSON (recommended) or GOOGLE_SERVICE_ACCOUNT_JSON in Vercel env vars.',
        hint:
          'Ensure service account JSON env var is set and the service account email is added as an owner/user to your Search Console property.',
        setupSteps: [
          'Google Cloud → enable Google Search Console API',
          'Create a service account → download JSON key → copy client_email',
          'Search Console → Settings → Users → add that client_email (view access)',
          'Vercel → Environment Variables → GSC_SERVICE_ACCOUNT_JSON + GSC_SITE_URL → redeploy',
        ],
        docs: 'seo-audit/GSC-SERVICE-ACCOUNT-SETUP.md',
      },
      { status: 503 }
    )
  }

  try {
    const url = new URL(request.url)
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '28', 10) || 28, 7), 90)

    const siteUrl =
      process.env.GSC_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.arfadevelopers.com/'

    const end = new Date()
    // GSC data can lag; use yesterday to be safe
    end.setDate(end.getDate() - 1)
    const start = new Date(end)
    start.setDate(end.getDate() - (days - 1))

    const { client_email, private_key } = parseServiceAccount()

    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })

    const searchconsole = google.searchconsole({ version: 'v1', auth })

    const [timeSeriesRes, topQueriesRes, topPagesRes] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toISODate(start),
          endDate: toISODate(end),
          dimensions: ['date'],
          rowLimit: 5000,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toISODate(start),
          endDate: toISODate(end),
          dimensions: ['query'],
          rowLimit: 10,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toISODate(start),
          endDate: toISODate(end),
          dimensions: ['page'],
          rowLimit: 10,
        },
      }),
    ])

    const timeSeriesRaw = timeSeriesRes.data.rows || []
    const timeSeries = timeSeriesRaw
      .map((r) => ({
        date: r.keys?.[0] || '',
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
      }))
      .filter((p) => !!p.date)
      .sort((a, b) => a.date.localeCompare(b.date))

    const totals = timeSeries.reduce(
      (acc, d) => {
        acc.clicks += d.clicks
        acc.impressions += d.impressions
        return acc
      },
      { clicks: 0, impressions: 0 }
    )

    const topQueries = (topQueriesRes.data.rows || []).map((r) => ({
      query: r.keys?.[0] || '',
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: r.position || 0,
    }))

    const topPages = (topPagesRes.data.rows || []).map((r) => ({
      page: r.keys?.[0] || '',
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: r.position || 0,
    }))

    const response = NextResponse.json({
      siteUrl,
      dateRange: { startDate: toISODate(start), endDate: toISODate(end), days },
      totals,
      timeSeries,
      topQueries,
      topPages,
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error: any) {
    console.error('❌ GSC API error:', error?.message || error)
    return NextResponse.json(
      {
        error: error?.message || 'Failed to load Google Search Console data',
        hint:
          'Ensure service account JSON env var is set and the service account email is added as an owner/user to your Search Console property.',
      },
      { status: 500 }
    )
  }
}

