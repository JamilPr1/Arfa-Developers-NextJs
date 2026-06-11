# Keywords & SEO Audit Report

**Property:** https://www.arfadevelopers.com  
**Business focus:** US web development agency, project rescue, custom web apps (Next.js/React)  
**Audit date:** June 11, 2026  
**Method:** Codebase review, `robots.txt` live check, metadata/structured-data audit, internal link map

---

## Executive summary

| Area | Score | Summary |
|------|-------|---------|
| Technical foundation | ⚠️ Medium | `robots.txt` OK; **production `sitemap.xml` returned HTTP 500** during audit; 21+ URLs missing from sitemap |
| On-page SEO | ✅ Good | Most marketing pages have title, description, canonical, Open Graph |
| Keyword targeting | ✅ Good | Strong USA landing pages + rescue positioning; homepage/metadata overlap |
| Content depth | ⚠️ Medium | Only 3 blog posts; one post has many broken internal links |
| Structured data | ⚠️ Medium | Global Organization/Service; gaps on FAQs, empty portfolio schema |
| Indexing / visibility | 🔴 Weak signal | `site:arfadevelopers.com` returned no results in spot check — verify in GSC Indexing report |
| Measurement | ✅ Improving | GA4 `G-11WWSNSEL2`, GTM, CookieHub added; GSC API available in admin when env configured |

**Top 3 blockers before growth work:**

1. Fix **sitemap.xml** (500 error) and add **all indexable URLs** (services + blogs).
2. Unify **canonical host** to `https://www.arfadevelopers.com` everywhere.
3. Pull **live GSC data** and optimize pages with impressions but low clicks (see [GSC-LIVE-DATA-GUIDE.md](./GSC-LIVE-DATA-GUIDE.md)).

---

## 1. Site inventory

### Indexable pages (46+)

- **28 URLs** in `app/sitemap.ts` (static list)
- **18** `/services/[slug]` pages (NOT in sitemap)
- **3** `/blog/[id]` posts (NOT in sitemap)
- **`/automation`** — public, no metadata, not in sitemap (consider `noindex` if internal)

### Blocked correctly

- `/admin`, `/admin/reset`, `/api/*` — `robots.ts`

### Legal pages

- Privacy, Terms, Refund: `noindex` in metadata but **still listed in sitemap** (conflicting signal).

---

## 2. Technical SEO findings

### Critical

| Issue | Impact | Evidence |
|-------|--------|----------|
| **Sitemap HTTP 500** | Google may not discover new/updated URLs | `https://www.arfadevelopers.com/sitemap.xml` → 500 (audit check) |
| **Incomplete sitemap** | 18 service pages + blogs not submitted | `app/sitemap.ts` static array only |
| **www vs non-www canonicals** | Split signals, diluted rankings | Service pages use `https://arfadevelopers.com/...` (no www) in some `generateMetadata` paths; USA pages use `www` |

### High

| Issue | Impact |
|-------|--------|
| Homepage is `'use client'` | Cannot export page metadata; competes with all root `keywords[]` |
| Missing assets in repo | `favicon.ico`, `og-image.jpg`, `logo.png` referenced but not in `public/` |
| `WebSite` schema `SearchAction` → `/search` | Broken rich-result target; page does not exist |
| `/faqs` — 10 Q&As, no `FAQPage` schema | Misses FAQ rich results |
| Portfolio `ItemList` schema empty | Invalid/weak structured data |
| Hardcoded `aggregateRating` (5★ / 50 reviews) | Policy risk if not backed by visible reviews |
| Blog `/blog/3` dead internal links | Crawl waste, poor UX |

### Medium

| Issue | Impact |
|-------|--------|
| All sitemap `lastModified` = build time | Unreliable crawl prioritization |
| Uniform `priority: 0.7` | No differentiation for money pages |
| GSC API route unauthenticated | Data leak if credentials exist on production |
| Header omits Blog, Case Studies, Pricing | Lower internal PageRank to content URLs |

### Working well

- Root layout: robots meta, OG, Twitter cards, canonical default
- Per-page metadata on most landing pages
- `BreadcrumbList` on many routes
- GSC verification file: `public/google42450b3a9821404c.html`
- CookieHub + analytics stack in place

---

## 3. Keyword strategy (codebase-derived)

### Primary clusters (money keywords)

1. **Project rescue** — fix broken sites, failed builds, takeover  
   - Pages: `/project-rescue`, `/website-rescue`, `/about`, case studies  
   - Meta keywords: rescue failed projects, fix broken websites, project takeover  

2. **US agency / dev hire** — geo-qualified commercial terms  
   - Pages: `/web-development-agency-usa`, `/custom-software-development-usa`, `/hire-nextjs-developers-usa`, `/website-maintenance-support-usa`  

3. **Service expansion** — SEO, ads, ecommerce, enterprise  
   - Hub: `/services` + 18 detail pages  

4. **Conversion** — audit, pricing, contact  
   - `/free-audit`, `/pricing`, `/contact`  

### Secondary / informational

- Blog: best practices, scalability (thin catalog vs. competitors)
- FAQs, process, testimonials — support trust, long-tail snippets

### Keyword cannibalization risk

| Term | Competing URLs |
|------|----------------|
| project rescue | `/`, `/project-rescue`, `/website-rescue`, `/about`, case studies |
| web development agency USA | `/`, `/web-development-agency-usa` |
| web development services | `/`, `/services`, `/services/web-development` |

**Fix:** Homepage = brand + overview; landing pages = specific H1 + canonical intent; cross-link with descriptive anchors.

---

## 4. Ranking keywords & highly clicked pages

> **Live GSC data was not available** in this audit environment (no `GSC_SERVICE_ACCOUNT_JSON` locally). Tables below: **(A)** strategic priority from site architecture, **(B)** placeholders for your GSC export.

### 4A. Pages most likely to earn clicks (when ranking)

Ranked by commercial intent + internal link prominence:

| Rank | URL | Why it matters | Primary keyword target |
|------|-----|----------------|------------------------|
| 1 | `/web-development-agency-usa` | Header nav + footer SEO block | web development agency USA |
| 2 | `/project-rescue` | Header nav + footer SEO block | project rescue USA |
| 3 | `/contact` | Header CTA path | free consultation web developers |
| 4 | `/free-audit` | Footer, lead magnet | free website audit |
| 5 | `/services/web-development` | Header dropdown + footer services | web development services |
| 6 | `/website-rescue` | Footer quick links | website rescue / fix broken website |
| 7 | `/custom-software-development-usa` | Footer SEO block | custom software development USA |
| 8 | `/hire-nextjs-developers-usa` | Footer SEO block | hire next.js developers |
| 9 | `/case-studies/project-rescue-usa-saas` | Proof for rescue niche | SaaS project rescue case study |
| 10 | `/services/seo-services` | Footer services column | SEO services |

### 4B. Top queries — **paste from GSC**

| Query | Clicks | Impressions | CTR | Avg position | Recommended page to strengthen |
|-------|--------|-------------|-----|--------------|--------------------------------|
| _export from GSC_ | | | | | |
| | | | | | |
| | | | | | |

### 4C. Top pages by clicks — **paste from GSC**

| Page URL | Clicks | Impressions | CTR | Avg position | Action |
|----------|--------|-------------|-----|--------------|--------|
| _export from GSC_ | | | | | |
| | | | | | |

### 4D. Quick wins (typical patterns — validate with GSC)

Once you have data, prioritize rows where:

- **Position 4–15** + impressions > 100 → improve title/meta, add 300–500 words, internal links from header/footer.
- **CTR < 2%** with impressions > 50 → rewrite meta description with CTA (“Free consultation”, “Rescue in 2 weeks”).
- **High clicks on `/`** but low on USA landers → add above-fold links to `/web-development-agency-usa` and `/project-rescue`.

---

## 5. On-page checklist (sample: money pages)

| Page | Title unique | Meta desc | Canonical www | OG | H1 aligned | FAQ schema |
|------|--------------|-----------|---------------|-----|------------|------------|
| `/web-development-agency-usa` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/project-rescue` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (page has FAQPage) |
| `/website-rescue` | ✅ | ✅ | check | ✅ | ✅ | ❌ |
| `/services/web-development` | ✅ | ✅ | ⚠️ non-www | ✅ | ✅ | ❌ |
| `/faqs` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ missing FAQPage |
| `/` (home) | ⚠️ root only | ⚠️ root only | ✅ root | ✅ | ✅ | — |

---

## 6. Content & E-E-A-T gaps

| Gap | Recommendation |
|-----|----------------|
| Thin blog (3 posts) | Publish 2 posts/month: rescue stories, Next.js tips, SEO for dev agencies |
| Broken blog internal links | Fix `/blog/3` links or create stub posts |
| Case studies not in header | Link from homepage + project-rescue page |
| No visible review widget matching schema | Add testimonials schema or remove aggregateRating |
| Missing OG image in repo | Add 1200×630 `public/og-image.jpg` |

---

## 7. Competitor positioning (qualitative)

Without paid rank trackers, focus on **differentiation keywords** where a niche agency can win:

- “project rescue” + “failed freelancer project”
- “take over half-built app” / “abandoned codebase”
- “Next.js agency USA” (smaller volume, higher intent)

Avoid head-to-head on generic “web development company” until domain authority grows.

---

## Related files

- [KEYWORD-PAGE-MAP.md](./KEYWORD-PAGE-MAP.md) — full keyword-to-URL matrix  
- [NEXT-STEPS-ACTION-PLAN.md](./NEXT-STEPS-ACTION-PLAN.md) — prioritized implementation  
- [GSC-LIVE-DATA-GUIDE.md](./GSC-LIVE-DATA-GUIDE.md) — refresh clicks & rankings
