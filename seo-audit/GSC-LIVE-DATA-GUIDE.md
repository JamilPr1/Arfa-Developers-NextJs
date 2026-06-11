# Google Search Console — Live Data Guide

Use this to replace placeholder tables in the audit with **actual** clicks and rankings.

## Option A: Google Search Console (recommended)

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select property: `https://www.arfadevelopers.com` (or domain property if configured).
3. **Performance** → set range to **Last 28 days**.
4. Export:
   - **Queries** tab → Export (CSV).
   - **Pages** tab → Export (CSV).
5. Sort by **Clicks** descending. Copy top 10 into the audit report.

### Metrics to track monthly

| Metric | Where | Goal |
|--------|-------|------|
| Total clicks | Performance overview | ↑ month over month |
| Total impressions | Performance overview | ↑ with new content |
| Average CTR | Performance overview | Improve titles/meta (target 2–5% on branded, 1–3% on head terms) |
| Average position | Performance overview | Move priority URLs into top 20, then top 10 |
| Top queries | Queries tab | Double down on winners; create pages for high-impression/low-CTR terms |
| Top pages | Pages tab | Internal link **to** these from header/blog; optimize underperformers |

## Option B: Built-in admin API

The project includes a read-only GSC integration:

- **Route:** `GET /api/admin/gsc?days=7|28|90`
- **Env vars (Vercel):** `GSC_SERVICE_ACCOUNT_JSON`, `GSC_SITE_URL`
- **UI:** `/admin` → Search Console tab

**Response fields:** `totals.clicks`, `totals.impressions`, `topQueries[]`, `topPages[]` (each with `query`/`page`, `clicks`, `impressions`, `ctr`, `position`).

### Example (after env is set)

```bash
curl "https://www.arfadevelopers.com/api/admin/gsc?days=28"
```

## Option C: Google Analytics 4

GA4 (measurement ID `G-11WWSNSEL2`) shows **on-site** behavior, not search rankings:

- **Reports → Engagement → Pages and screens** → top landing pages (sessions).
- **Reports → Acquisition → Traffic acquisition** → Organic Search → landing page.

Cross-reference: a page with high GSC impressions but low GA4 engagement needs better content/CTA; high GA4 organic sessions with low GSC clicks may be branded or direct misattribution.

## After you export

Update `KEYWORDS-AND-SEO-AUDIT-REPORT.md` §4 tables and re-prioritize `NEXT-STEPS-ACTION-PLAN.md` Phase 2 content tasks based on queries with:

- **High impressions, low CTR** → rewrite title + meta description.
- **Position 11–20** → add internal links + expand content (quick win).
- **Position 20+** → new supporting blog posts + FAQ schema.
