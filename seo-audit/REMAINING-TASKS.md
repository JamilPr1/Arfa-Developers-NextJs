# Remaining SEO & growth tasks

**Updated:** June 11, 2026  
**You completed:** Full-site GSC property, sitemap submit, URL indexing requests, Vercel `GSC_SERVICE_ACCOUNT_JSON` + redeploy.

---

## Done (codebase + your manual steps)

- [x] GA4, GTM, CookieHub live
- [x] Sitemap 48 URLs (services + blogs 1–5)
- [x] SEO keywords, FAQ schema, homepage metadata, internal links
- [x] Blog posts 4 & 5 published
- [x] Facebook UTM sharing in footer + blog
- [x] GSC verification files
- [x] You: GSC property `https://www.arfadevelopers.com`
- [x] You: Sitemap submitted + priority URL indexing requested
- [x] You: Vercel service account JSON + redeploy

---

## Do now (this week)

| # | Task | How |
|---|------|-----|
| 1 | **Confirm GSC API works** | Open `/admin` → Search Console tab, or `GET /api/admin/gsc?days=28`. If error: add service account **email** as **Owner** on `https://www.arfadevelopers.com` (not only the `/sitemap.xml/` property). |
| 2 | **Run Indexing API** | After deploy: `POST https://www.arfadevelopers.com/api/admin/seo/indexing` (or `npm run seo:index` locally with env). |
| 3 | **GA4 key events** | Admin → Events → mark `generate_lead`, `form_submission`, `calendly_click`, `whatsapp_click` as **Key events**. |
| 4 | **Share on Facebook** | Use links in [SOCIAL-UTM-LINKS.md](./SOCIAL-UTM-LINKS.md) — post blog/4 and project-rescue. |
| 5 | **Wait for GSC data** | Performance report fills in **3–7 days** after indexing; then update [PERFORMANCE-AUDIT-JUNE-2026.md](./PERFORMANCE-AUDIT-JUNE-2026.md) §4 with real queries. |

---

## Dev / design backlog

| # | Task | Priority |
|---|------|----------|
| 1 | Add `public/og-image.jpg` (1200×630) + `favicon.ico` + `logo.png` | High — social previews & schema |
| 2 | Canonical `www` sweep on remaining pages (some OG URLs still non-www) | Medium |
| 3 | Fix `/blog/3` internal links to dead slugs → point to `/blog/4`, `/blog/5`, `/project-rescue` | Medium |
| 4 | `/automation` → `noindex` | Done in code — deploy to apply |

---

## Content (ongoing — 2 posts/month)

| When | Topic | URL target |
|------|-------|------------|
| Next | Signs your freelancer project is failing | `/project-rescue` |
| Next | Web development agency vs freelancer (US) | `/web-development-agency-usa` |
| Month 2 | Technical SEO for Next.js sites | `/services/technical-seo` |
| Month 2 | Ecommerce rescue case angle | `/case-studies/ecommerce-rescue-usa` |

---

## Off-site (leads + authority)

- Google Business Profile (if local US presence)
- Clutch / GoodFirms listing — same NAP as website
- LinkedIn posts linking to UTM URLs
- Monthly: export GSC Queries + GA4 organic landing pages

---

## Success metrics (check weekly)

| Metric | Where |
|--------|--------|
| Indexed pages | GSC → Pages |
| Organic clicks | GSC → Performance |
| Top queries | GSC → Queries |
| Leads | GA4 → Key events |
| Facebook traffic | GA4 → `utm_source=facebook` |
