# SEO & Organic Traffic Strategy — Design Doc

**Date:** 2026-03-07
**Goal:** Maximize organic search traffic for studentperks.dev through programmatic SEO pages and technical improvements.
**Approach:** Programmatic page generation from deal data (Approach A) with auto-generated content elements (C).

---

## 1. New Programmatic Routes

### 1.1 Category pages — `/category/[slug]`

7 pages: cloud, dev, ai, design, learning, saas, entertainment

Each page:
- Title: "Free {Category} Tools for Students & Startups 2026 | StudentPerks"
- H1: "Free {Category} Tools & Credits"
- Hardcoded intro (2-3 sentences with keywords)
- Deal list (DealCard grid)
- Stats: deal count, total value
- FAQ block: 3-4 questions per category (hardcoded)
- Related categories — internal links
- JSON-LD: ItemList + FAQPage + BreadcrumbList

### 1.2 Audience pages — `/for/[audience]`

3 pages: students, startups, opensource

Each page:
- Title: "153 Free Developer Tools for Students 2026 | StudentPerks"
- Intro about the specific audience
- Deals filtered by audience
- Category breakdown within audience
- Audience-specific FAQ ("Do I need a .edu email?", etc.)
- JSON-LD: ItemList + FAQPage + BreadcrumbList

### 1.3 Cross-filter pages — `/for/[audience]/[category]`

21 pages (3 audiences x 7 categories): /for/students/cloud, /for/startups/ai, etc.

Each page:
- Title: "Free AI Tools for Startups 2026 | StudentPerks"
- Deals matching both filters
- Template-generated intro: "Discover {count} free {category} tools available for {audience}..."
- Links up to parent audience and category pages

### 1.4 Top-N pages — `/top/[category]`

7 pages: /top/cloud, /top/dev, etc.

Each page:
- Title: "Top 10 Best Free Cloud Tools for Developers 2026"
- Numbered list of top deals (featured first, then by value)
- Brief description per deal
- Targets "best free X tools" queries

### 1.5 Alternatives pages — `/alternatives/[slug]`

~15-20 pages for popular services: /alternatives/aws, /alternatives/github-copilot, /alternatives/vercel

Each page:
- Title: "Best Free Alternatives to AWS for Students 2026"
- Deals from same category, excluding the service itself
- Comparison-style layout
- Targets "[service] alternatives free" queries

**Total: ~53-58 new indexable pages.**

---

## 2. Technical SEO Improvements

### 2.1 JSON-LD Schema

- FAQPage on all programmatic pages (FAQ rich snippets)
- ItemList with numbering on /top/[category] pages (featured snippets)
- BreadcrumbList on all new pages (Home > Category > Cloud, Home > For Students > AI)

### 2.2 Internal Linking Mesh

Each deal page (/deals/[slug]) gets:
- Link to its category (/category/cloud)
- Links to its audiences (/for/students)
- "See also" to top-N page of its category

Each programmatic page links to:
- All deals listed on it
- Related categories/audiences
- Parent/sibling pages

### 2.3 Meta Tags

All new pages get:
- Unique `<title>` (max 60 chars, target keyword)
- Unique `<meta description>` (max 155 chars)
- Canonical URL
- Open Graph title/description

### 2.4 Sitemap Update

Remove from sitemap:
- /deals?category=Dev and other query-parameter URLs
- /deals?audience=students and other query-parameter URLs

Add to sitemap:
- All new programmatic routes (priority 0.7-0.8, weekly)

### 2.5 Existing Pages Fixes

- **Home:** Add noscript fallback for RotatingWord so h1 has keywords in SSR HTML
- **/deals page:** Add text intro block with keywords
- **/discover and /stack:** Add `<meta name="robots" content="noindex">` (client-side, no content for bots)

---

## 3. Content for Programmatic Pages

### 3.1 Data Structure

New file: `src/data/seo-content.ts`

Contains hardcoded content per category, audience, and alternatives page:
- Intro text (2-3 sentences)
- FAQ (3-4 Q&A pairs)
- Meta title/description

### 3.2 Content Generation Strategy

- **Categories & audiences (10 pages):** Hand-written intros + FAQs
- **Cross-filters (21 pages):** Template-generated from data
- **Top-N (7 pages):** Template intro + auto-numbered list from deals
- **Alternatives (15-20 pages):** Short intro per service + auto layout

### 3.3 Dynamic Elements

Each programmatic page auto-generates:
- Deal count and total value ("23 deals worth $150K+")
- Top-3 deal names in intro ("including GitHub Copilot, JetBrains, and Vercel")
- Last updated date ("Updated March 2026")

---

## 4. Redirects & Compatibility

- Old query-parameter URLs (/deals?category=X) continue to work client-side
- Remove query URLs from sitemap (replaced by new routes)
- Update internal links on home page: audience cards -> /for/[audience], category cards -> /category/[slug]
- Update deal page badges to link to new category/audience URLs
- Old URLs don't break, they just stop being canonical

---

## 5. New File Structure

```
src/app/
  category/[slug]/page.tsx
  for/[audience]/page.tsx
  for/[audience]/[category]/page.tsx
  top/[category]/page.tsx
  alternatives/[slug]/page.tsx
src/data/
  seo-content.ts
```

---

## 6. Out of Scope

- No changes to Notion CMS or data flow
- No breaking existing URLs (/deals, /deals/[slug], /blog/*)
- No manual blog posts
- No design/UI changes (reuse existing components)
