import { NextRequest, NextResponse } from 'next/server'
import {
  createSearchConsoleClient,
  listAccessibleGscSites,
  parseGscServiceAccount,
  rankGscSites,
  siteUrlCandidates,
} from '@/lib/gscClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

async function queryGsc(
  searchconsole: ReturnType<typeof createSearchConsoleClient>['searchconsole'],
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  const [timeSeriesRes, topQueriesRes, topPagesRes] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: { startDate, endDate, dimensions: ['date'], rowLimit: 5000 },
    }),
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 10 },
    }),
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 10 },
    }),
  ])
  return { timeSeriesRes, topQueriesRes, topPagesRes }
}

export async function GET(request: NextRequest) {
  const hasCredentials = !!(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  )

  if (!hasCredentials) {
    return NextResponse.json(
      {
        error: 'Missing GSC_SERVICE_ACCOUNT_JSON in Vercel env vars.',
        setupSteps: [
          'Google Cloud → enable Search Console API',
          'Create service account → download JSON',
          'Search Console → Users → add client_email to https://www.arfadevelopers.com',
          'Vercel env → redeploy',
        ],
        docs: 'seo-audit/GSC-SERVICE-ACCOUNT-SETUP.md',
      },
      { status: 503 }
    )
  }

  try {
    const url = new URL(request.url)
    const listOnly = url.searchParams.get('list') === 'sites'

    const { client_email, sites, ranked } = await listAccessibleGscSites()

    if (listOnly) {
      return NextResponse.json({
        serviceAccountEmail: client_email,
        accessibleSites: sites,
        recommendedSiteUrl: ranked[0]?.siteUrl || null,
      })
    }

    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '28', 10) || 28, 7), 90)
    const configuredSiteUrl =
      process.env.GSC_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.arfadevelopers.com/'

    const end = new Date()
    end.setDate(end.getDate() - 1)
    const start = new Date(end)
    start.setDate(end.getDate() - (days - 1))
    const startDate = toISODate(start)
    const endDate = toISODate(end)

    const { searchconsole } = createSearchConsoleClient()

    const tryUrls = [
      ...ranked.map((s) => s.siteUrl).filter(Boolean) as string[],
      ...siteUrlCandidates(configuredSiteUrl),
    ]
    const uniqueTry = Array.from(new Set(tryUrls))

    let matched: Awaited<ReturnType<typeof queryGsc>> & { siteUrl: string } | null = null
    const errors: string[] = []

    for (const candidate of uniqueTry) {
      try {
        const result = await queryGsc(searchconsole, candidate, startDate, endDate)
        matched = { siteUrl: candidate, ...result }
        break
      } catch (e: any) {
        errors.push(`${candidate}: ${e?.message || String(e)}`)
      }
    }

    if (!matched) {
      return NextResponse.json(
        {
          error: 'No Search Console property accessible for analytics queries.',
          hint:
            'In Google Search Console → Settings → Users and permissions → Add user → paste the serviceAccountEmail below with Full permission on property https://www.arfadevelopers.com (not only /sitemap.xml/).',
          setupSteps: [
            `Open: https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fwww.arfadevelopers.com%2F`,
            `Add user → paste: ${client_email}`,
            'Permission: Full (or Owner)',
            'Save → wait 2 minutes → click Refresh in admin',
          ],
          serviceAccountEmail: client_email,
          accessibleSites: sites,
          recommendedSiteUrl: ranked[0]?.siteUrl || null,
          triedSiteUrls: uniqueTry,
          details: errors,
          fixUrl:
            'https://search.google.com/search-console/users?resource_id=https%3A%2F%2Fwww.arfadevelopers.com%2F',
        },
        { status: 403 }
      )
    }

    const { siteUrl, timeSeriesRes, topQueriesRes, topPagesRes } = matched

    const timeSeries = (timeSeriesRes.data.rows || [])
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
      serviceAccountEmail: client_email,
      accessibleSites: sites,
      dateRange: { startDate, endDate, days },
      totals,
      timeSeries,
      topQueries,
      topPages,
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  } catch (error: any) {
    let client_email = ''
    try {
      client_email = parseGscServiceAccount().client_email
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      {
        error: error?.message || 'Failed to load Google Search Console data',
        serviceAccountEmail: client_email || undefined,
        hint:
          'Add service account email as a user on https://www.arfadevelopers.com in Search Console. Enable Search Console API in the same Google Cloud project as the JSON key.',
        diagnostic: 'GET /api/admin/gsc?list=sites',
      },
      { status: 500 }
    )
  }
}
