/**
 * SEO bootstrap: ping search engines with sitemap + optional Google Indexing API.
 *
 * Usage:
 *   node scripts/seo-submit.js              # ping sitemap only
 *   node scripts/seo-submit.js --index      # ping + request indexing (needs GSC_SERVICE_ACCOUNT_JSON)
 *
 * Service account must be Owner in Search Console and Indexing API enabled in Google Cloud.
 */

const https = require('https')
const { google } = require('googleapis')

const SITE_URL = process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arfadevelopers.com'
const SITEMAP_URL = `${SITE_URL.replace(/\/$/, '')}/sitemap.xml`

const PRIORITY_PATHS = [
  '/project-rescue',
  '/web-development-agency-usa',
  '/free-audit',
  '/',
  '/blog/4',
  '/blog/5',
]

function parseServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
  if (!raw) return null
  let jsonText = raw.trim()
  if (!jsonText.startsWith('{')) {
    try {
      jsonText = Buffer.from(jsonText, 'base64').toString('utf8')
    } catch {
      /* ignore */
    }
  }
  const parsed = JSON.parse(jsonText)
  const private_key = String(parsed.private_key).replace(/\\n/g, '\n')
  return { client_email: parsed.client_email, private_key }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body }))
      })
      .on('error', reject)
  })
}

async function pingSitemap() {
  const pings = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  ]
  for (const pingUrl of pings) {
    try {
      const res = await httpGet(pingUrl)
      console.log(`✅ Ping ${pingUrl.split('?')[0]} → HTTP ${res.status}`)
    } catch (e) {
      console.warn(`⚠️ Ping failed: ${pingUrl}`, e.message)
    }
  }
}

async function requestIndexing(urls) {
  const creds = parseServiceAccount()
  if (!creds) {
    console.log('\n⏭️  Skipping Indexing API — set GSC_SERVICE_ACCOUNT_JSON to enable.')
    console.log('   See seo-audit/GSC-SERVICE-ACCOUNT-SETUP.md')
    return
  }

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  const indexing = google.indexing({ version: 'v3', auth })

  for (const path of urls) {
    const url = path.startsWith('http') ? path : `${SITE_URL.replace(/\/$/, '')}${path}`
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      })
      console.log(`✅ Indexing requested: ${url}`)
    } catch (e) {
      console.warn(`⚠️ Indexing failed for ${url}:`, e.message || e)
    }
  }
}

async function main() {
  const doIndex = process.argv.includes('--index')

  console.log(`\n📍 Site: ${SITE_URL}`)
  console.log(`📄 Sitemap: ${SITEMAP_URL}\n`)

  await pingSitemap()

  if (doIndex) {
    console.log('\n📨 Requesting Google Indexing API updates...\n')
    await requestIndexing(PRIORITY_PATHS)
  } else {
    console.log('\n💡 Run with --index to request indexing (requires service account JSON).\n')
  }

  console.log('📋 Manual GSC steps (one-time):')
  console.log('   1. Add property https://www.arfadevelopers.com')
  console.log('   2. Verify via google42450b3a9821404c.html or Analytics')
  console.log('   3. Sitemaps → submit sitemap.xml')
  console.log('   4. URL Inspection → Request indexing for priority pages\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
