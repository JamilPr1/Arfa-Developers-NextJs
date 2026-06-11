# Next Steps — SEO & Keywords Improvement Plan

**Goal:** Increase organic clicks and qualified leads for USA web development + project rescue.  
**Horizon:** 90 days (3 phases)

---

## Phase 1 — Fix foundations (Week 1–2) 🔴

Do these before publishing new content.

| # | Task | Owner | Success metric |
|---|------|-------|----------------|
| 1.1 | **Fix `sitemap.xml` 500** on production — test `/sitemap.xml` after deploy | Dev | HTTP 200, valid XML in GSC Sitemaps |
| 1.2 | **Dynamic sitemap** — add all `/services/[slug]` + published `/blog/[id]` from Supabase/JSON; remove `noindex` legal URLs from sitemap | Dev | GSC “Discovered pages” increases |
| 1.3 | **Canonical consistency** — use `siteConfig.siteUrl` (`https://www.arfadevelopers.com`) for every page, especially `/services/*` | Dev | No mixed host in view-source |
| 1.4 | Add **`public/og-image.jpg`**, **favicon**, **logo** assets | Design/Dev | Social previews render correctly |
| 1.5 | Connect **GSC export** — fill §4 tables in audit report; baseline clicks/impressions | Marketing | Baseline documented |
| 1.6 | Submit sitemap in GSC; request indexing for top 5 money URLs | Marketing | “Indexed” on priority URLs |

### Priority URLs to request indexing (first)

1. `https://www.arfadevelopers.com/web-development-agency-usa`
2. `https://www.arfadevelopers.com/project-rescue`
3. `https://www.arfadevelopers.com/website-rescue`
4. `https://www.arfadevelopers.com/services/web-development`
5. `https://www.arfadevelopers.com/free-audit`

---

## Phase 2 — Keywords & on-page (Week 3–6) 🟡

| # | Task | Target keywords | Page |
|---|------|-----------------|------|
| 2.1 | Add **page-level metadata** to `/hire-talent`, `/hire-talent-form`, `/join-our-team` | hire web developers, join dev team | Those routes |
| 2.2 | Add **`FAQPage` JSON-LD** to `/faqs` (mirror `/project-rescue` pattern) | web development cost, project rescue FAQ | `/faqs` |
| 2.3 | **Homepage metadata** — split layout keywords; add dedicated metadata via small server wrapper or refactor hero to server component | brand + core offer only | `/` |
| 2.4 | Expand **project rescue** copy: H2s for “failed freelancer”, “half-built SaaS”, “agency handoff” | long-tail rescue | `/project-rescue` |
| 2.5 | **Internal links** — header: add Blog + Case Studies; homepage: prominent links to top 2 money pages | — | Header, `/` |
| 2.6 | Fix **blog/3** broken links — create posts or remove links | scalability, Next.js performance | `/blog/*` |
| 2.7 | Remove or justify **`aggregateRating`** in Organization schema | — | `StructuredData.tsx` |
| 2.8 | Remove **`SearchAction`** or build `/search` | — | `StructuredData.tsx` |
| 2.9 | Set **`/automation`** to `noindex` if not for public SEO | — | `/automation` |

### Title/meta A/B patterns (test in GSC after 4 weeks)

| Page | Current focus | Test variant idea |
|------|---------------|-------------------|
| `/project-rescue` | Project Rescue USA | “Failed Project? We Take Over & Ship in Weeks \| Arfa Developers” |
| `/web-development-agency-usa` | Web Development Agency USA | “Next.js & React Agency for US Startups \| Free Consultation” |
| `/free-audit` | Free audit | “Free Website & SEO Audit (24h Response) \| Arfa Developers” |

---

## Phase 3 — Content & authority (Week 7–12) 🟢

### Content calendar (suggested)

| Month | Topic | Target keyword | Links to |
|-------|-------|----------------|----------|
| 1 | How we rescued a half-built SaaS (playbook) | SaaS project rescue | `/project-rescue`, case study |
| 1 | Next.js performance checklist 2026 | next.js performance optimization | `/hire-nextjs-developers-usa` |
| 2 | Signs your freelancer project is failing | failed freelancer project | `/project-rescue`, `/free-audit` |
| 2 | Web development agency vs freelancer (US) | web development agency USA | `/web-development-agency-usa` |
| 3 | Technical SEO audit checklist for Next.js sites | technical SEO Next.js | `/services/technical-seo` |
| 3 | Ecommerce rescue: payment flow bugs | ecommerce website rescue | case study |

### Link building (lightweight)

- Publish case studies on LinkedIn with link to matching URL
- Guest post or partner mentions on dev tool blogs
- Add site to relevant directories (Clutch, GoodFirms) — match NAP with `siteConfig`

---

## Phase 4 — Measure & iterate (ongoing)

| Cadence | Action |
|---------|--------|
| Weekly | GSC: top queries + pages; note position changes |
| Monthly | Update audit §4 tables; adjust content calendar |
| Monthly | GA4: organic landing pages, conversion on `/contact` + `/free-audit` |
| Quarterly | Full technical crawl (Screaming Frog or Sitebulb) |

### KPI targets (set after GSC baseline)

| KPI | 90-day target (example — adjust after baseline) |
|-----|-----------------------------------------------|
| Organic clicks / month | +30% vs baseline |
| Indexed pages | 50+ (all services + blogs + landers) |
| Avg position (money keywords) | Improve by 5+ positions on 3 core terms |
| Organic leads | Track form submits from organic in GA4 |

---

## Quick reference: highest-value keywords → actions

| Keyword | Next action |
|---------|-------------|
| web development agency USA | Internal links from home + blog; consider Google Business Profile |
| project rescue / fix broken website | FAQ schema on `/website-rescue`; more case study CTAs |
| hire next.js developers USA | Add code samples / stack section; link from `/services/web-development` |
| free website audit | Run Google Ads to `/free-audit` while SEO ramps; optimize meta CTR |
| SEO services | Cross-link from blog technical posts; local proof if targeting US cities |

---

## Dev tickets (copy into GitHub issues)

```
[SEO-P0] Fix production sitemap.xml 500 error
[SEO-P0] Extend sitemap.ts with services + blog dynamic routes
[SEO-P0] Normalize canonical URLs to www.arfadevelopers.com
[SEO-P1] FAQPage schema on /faqs
[SEO-P1] Fix broken internal links in blog post id=3
[SEO-P1] Add metadata to hire-talent, hire-talent-form, join-our-team
[SEO-P2] Header nav: Blog + Case Studies
[SEO-P2] Add og-image.jpg and favicon to public/
[SEO-P2] Secure /api/admin/gsc with admin auth
```

---

**After completing Phase 1**, re-run GSC Performance export and update [KEYWORDS-AND-SEO-AUDIT-REPORT.md](./KEYWORDS-AND-SEO-AUDIT-REPORT.md) §4 with real click data.
