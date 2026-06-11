# Keyword → Page Map

Maps **target keywords** (from page metadata and business focus) to URLs. Use GSC exports to mark which are **actually ranking**.

**Legend:** 🎯 Primary money keyword · 🔗 Supporting · 📝 Content opportunity

---

## Tier 1 — Revenue & rescue (highest commercial intent)

| Priority | Target keyword / phrase | URL | In header nav | In footer SEO block | Sitemap |
|----------|-------------------------|-----|---------------|---------------------|---------|
| 🎯 | web development agency USA | `/web-development-agency-usa` | Yes | Yes | Yes |
| 🎯 | project rescue / rescue failed projects | `/project-rescue` | Yes | Yes | Yes |
| 🎯 | fix broken website / website rescue | `/website-rescue` | No | Yes (footer quick link) | Yes |
| 🎯 | custom software development USA | `/custom-software-development-usa` | No | Yes | Yes |
| 🎯 | hire next.js developers USA | `/hire-nextjs-developers-usa` | No | Yes | Yes |
| 🎯 | website maintenance support USA | `/website-maintenance-support-usa` | No | Yes | Yes |
| 🔗 | free website audit / free SEO audit | `/free-audit` | No | Yes | Yes |
| 🔗 | contact web developers / free consultation | `/contact` | Yes | Yes | Yes |

---

## Tier 2 — Service category (18 detail pages — **missing from sitemap**)

| Target keyword cluster | URL |
|------------------------|-----|
| web development services | `/services/web-development` |
| mobile app development | `/services/mobile-app-development` |
| ecommerce development | `/services/ecommerce-development` |
| SEO services | `/services/seo-services` |
| technical SEO | `/services/technical-seo` |
| local SEO | `/services/local-seo` |
| SEO audit services | `/services/seo-audit` |
| digital marketing | `/services/digital-marketing` |
| google ads management | `/services/google-ads-management` |
| content marketing | `/services/content-marketing` |
| website redesign | `/services/website-redesign` |
| landing pages | `/services/landing-pages` |
| performance optimization | `/services/performance-optimization` |
| cloud solutions | `/services/cloud-solutions` |
| enterprise solutions | `/services/enterprise-solutions` |
| security compliance | `/services/security-compliance` |
| data analytics | `/services/data-analytics` |
| email marketing | `/services/email-marketing` |

**Hub:** `/services` (indexed, in sitemap) — should link prominently to all slugs (header dropdown already does).

---

## Tier 3 — Trust, proof, and mid-funnel

| Keywords (from metadata) | URL |
|--------------------------|-----|
| web development case studies, project rescue case studies | `/case-studies` |
| SaaS project rescue USA | `/case-studies/project-rescue-usa-saas` |
| ecommerce rescue USA | `/case-studies/ecommerce-rescue-usa` |
| healthcare platform USA | `/case-studies/healthcare-platform-usa` |
| web development portfolio | `/portfolio` |
| client testimonials | `/testimonials` |
| web development pricing | `/pricing` |
| web development FAQs | `/faqs` |
| web development process | `/our-process` |
| about / project takeover | `/about` |

---

## Tier 4 — Content & topical authority (blog)

| Post | URL | Target theme |
|------|-----|--------------|
| 10 Best Practices for Modern Web Development | `/blog/1` | web development best practices |
| Scaling Your Application | `/blog/2` | application scalability |
| How to Scale Your Application (long-form) | `/blog/3` | scalability, backend, Next.js performance |

**Gap:** `/blog/3` links to **non-existent** posts (`/blog/build-scalable-mvp`, `/blog/nextjs-performance-optimization`, etc.) — hurts crawl quality and user trust.

**Missing from sitemap:** all `/blog/[id]` URLs.

---

## Tier 5 — Global / root layout keywords (homepage competes for all)

From `app/layout.tsx` metadata `keywords[]`:

- web development agency USA · custom web apps US · rescue failed projects · fix broken websites  
- react development · next.js development · node.js development · SaaS development · ecommerce development  
- enterprise software developers UK · web solutions Qatar · custom web apps Saudi Arabia  

**Risk:** Homepage is a **client component** (`app/page.tsx`) with **no page-level metadata override** — every `/` visit shares one generic title/description. US landing pages should own geo + service terms; homepage should focus on brand + core offer.

---

## Keywords to **add** (high intent, no dedicated page yet)

| Suggested keyword | Recommended action |
|-------------------|-------------------|
| next.js agency USA | Expand `/hire-nextjs-developers-usa` or new `/nextjs-development-agency-usa` |
| fix failed freelancer project | Add section + FAQ on `/project-rescue` |
| vercel next.js development | Blog post + link from USA pages |
| shopify / woocommerce rescue | Case study or `/website-rescue` subsection |
| MVP development USA | Landing page or blog cluster |
| web app rescue / SaaS rescue | Already partial on `/project-rescue` — add H2 + schema |

---

## Internal link equity (who gets the most links?)

| Page | Header | Footer quick | Footer services | Footer SEO |
|------|--------|--------------|-----------------|------------|
| `/web-development-agency-usa` | ✅ | — | — | ✅ |
| `/project-rescue` | ✅ | — | — | ✅ |
| `/services/*` (18) | ✅ dropdown | — | ✅ | — |
| `/blog` | ❌ | ✅ | — | — |
| `/case-studies` | ❌ | ✅ | — | — |
| `/free-audit` | ❌ | ✅ | — | — |
| Individual case studies | ❌ | ❌ | — | — |

**Recommendation:** Add **Blog**, **Case Studies**, and **Free Audit** to header (or mega-menu) to lift clicks on content URLs once they rank.
