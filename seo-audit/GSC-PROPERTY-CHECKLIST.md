# Google Search Console — Full site property checklist

Complete these steps once (≈10 minutes). The codebase already supports verification and sitemap ping.

## Step 1 — Add property

1. Open [Google Search Console](https://search.google.com/search-console)
2. **Add property** → **URL prefix**
3. Enter: **`https://www.arfadevelopers.com`**
4. Click **Continue**

## Step 2 — Verify ownership (pick one)

| Method | Action |
|--------|--------|
| **HTML file (recommended)** | Confirm this URL works: https://www.arfadevelopers.com/google42450b3a9821404c.html |
| **Google Analytics** | Use GA4 property `G-11WWSNSEL2` (already on site) |
| **Google Tag Manager** | Use container `GTM-WGSQ38FK` |

Click **Verify**.

## Step 3 — Submit sitemap

1. **Indexing → Sitemaps**
2. Enter: `sitemap.xml`
3. **Submit**

Expected: **46+ URLs** discovered (see https://www.arfadevelopers.com/sitemap.xml)

Auto-ping: every Vercel deploy runs `npm run seo:ping` via `postbuild`.

## Step 4 — Request indexing (priority URLs)

**Indexing → URL inspection** → paste each URL → **Request indexing**:

- https://www.arfadevelopers.com/project-rescue
- https://www.arfadevelopers.com/web-development-agency-usa
- https://www.arfadevelopers.com/free-audit
- https://www.arfadevelopers.com/blog/4
- https://www.arfadevelopers.com/blog/5

**Automated (optional):** after setting `GSC_SERVICE_ACCOUNT_JSON` in Vercel, run:

```bash
npm run seo:index
```

Requires **Indexing API** enabled in Google Cloud + service account as **Owner** in GSC.

## Step 5 — Vercel environment variables

In **Vercel → Project → Settings → Environment Variables** add:

| Name | Value |
|------|--------|
| `GSC_SERVICE_ACCOUNT_JSON` | Full JSON key from Google Cloud service account |
| `GSC_SITE_URL` | `https://www.arfadevelopers.com/` |

Redeploy. Test: `https://www.arfadevelopers.com/api/admin/gsc?days=28`

See [GSC-SERVICE-ACCOUNT-SETUP.md](./GSC-SERVICE-ACCOUNT-SETUP.md) for creating the service account.
