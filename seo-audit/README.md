# SEO & Keywords Audit — Arfa Developers

**Site:** https://www.arfadevelopers.com  
**Audit date:** June 11, 2026  
**Scope:** Technical SEO, keyword mapping, internal link equity, and growth priorities

## Contents

| File | Purpose |
|------|---------|
| [KEYWORDS-AND-SEO-AUDIT-REPORT.md](./KEYWORDS-AND-SEO-AUDIT-REPORT.md) | Full audit: findings, keyword tiers, page inventory, technical issues |
| [NEXT-STEPS-ACTION-PLAN.md](./NEXT-STEPS-ACTION-PLAN.md) | Prioritized 90-day roadmap (what to do next) |
| [KEYWORD-PAGE-MAP.md](./KEYWORD-PAGE-MAP.md) | Target keywords mapped to URLs and content gaps |
| [GSC-LIVE-DATA-GUIDE.md](./GSC-LIVE-DATA-GUIDE.md) | How to pull real clicks, impressions, and top queries from Search Console |

## How to refresh with live ranking data

1. **Google Search Console** → Performance (last 28 days) → export Queries + Pages.
2. **Admin dashboard** (if configured): `/admin` → **Search Console** tab (`/api/admin/gsc?days=28`).
3. Paste top 10 queries and pages into the tables in `KEYWORDS-AND-SEO-AUDIT-REPORT.md` §4.

> **Note:** This audit was built from the codebase, live `robots.txt`, and production checks. GSC API credentials were not available in the local environment, so click/ranking tables use **strategic targets** until you attach live exports.
