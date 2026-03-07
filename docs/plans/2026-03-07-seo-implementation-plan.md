# SEO Programmatic Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add ~53 programmatic SEO landing pages and technical SEO improvements to maximize organic search traffic.

**Architecture:** New SSG routes (`/category/[slug]`, `/for/[audience]`, `/for/[audience]/[category]`, `/top/[category]`, `/alternatives/[slug]`) generated at build time from deal data + hardcoded SEO content in `src/data/seo-content.ts`. Each page has unique title, meta, intro text, FAQ, JSON-LD, and internal links. Existing routes untouched.

**Tech Stack:** Next.js 16 App Router (SSG with `generateStaticParams`), TypeScript, Tailwind CSS v4, existing components (DealCard, CategoryBadge, AudienceBadge).

**JSON-LD Note:** All pages use the existing codebase pattern: `JSON.stringify(data).replace(/</g, "\\u003c")` inside `dangerouslySetInnerHTML` for structured data. This is safe — content is controlled/hardcoded, not user input.

---

## Task 1: Create SEO content data file

**Files:**
- Create: `src/data/seo-content.ts`

Contains all hardcoded SEO content: CategorySEO (7 categories with intros + FAQs), AudienceSEO (3 audiences with intros + eligibility + FAQs), AlternativeSEO (~15 services with intros), and helper functions for cross-filter and top-N meta generation.

Types: `FAQ`, `CategorySEO`, `AudienceSEO`, `AlternativeSEO`.
Exports: `CATEGORY_SEO`, `AUDIENCE_SEO`, `ALTERNATIVES_SEO`, `getCrossFilterMeta()`, `getTopMeta()`.

See design doc for full content. File is ~300 lines of data.

**Commit:** `git commit -m "feat: add SEO content data for programmatic pages"`

---

## Task 2: Create category pages `/category/[slug]`

**Files:**
- Create: `src/app/category/[slug]/page.tsx`

**Pattern:** SSG with `generateStaticParams` from `CATEGORY_SEO`. Each page has:
- `generateMetadata` with unique title, description, canonical URL
- Breadcrumb: Home / {Category}
- H1 + intro text from `CATEGORY_SEO`
- Deal count + update date
- DealCard grid filtered by category
- FAQ section from `CATEGORY_SEO.faqs`
- Related categories links
- JSON-LD: ItemList + FAQPage + BreadcrumbList
- `revalidate = 300`

**Verify:** `npm run build` — 7 category pages in output.
**Commit:** `git commit -m "feat: add /category/[slug] programmatic SEO pages"`

---

## Task 3: Create audience pages `/for/[audience]`

**Files:**
- Create: `src/app/for/[audience]/page.tsx`

**Pattern:** SSG with `generateStaticParams` from `AUDIENCE_SEO`. Each page has:
- `generateMetadata` with unique title, description, canonical URL
- Breadcrumb: Home / {Audience Title}
- H1 + intro from `AUDIENCE_SEO`
- Eligibility card from `AUDIENCE_SEO.eligibility`
- Category breakdown pills linking to `/for/{audience}/{category}`
- DealCard grid filtered by audience
- FAQ section
- Other audiences links
- JSON-LD: ItemList + FAQPage + BreadcrumbList
- `revalidate = 300`

**Verify:** `npm run build` — 3 audience pages in output.
**Commit:** `git commit -m "feat: add /for/[audience] programmatic SEO pages"`

---

## Task 4: Create cross-filter pages `/for/[audience]/[category]`

**Files:**
- Create: `src/app/for/[audience]/[category]/page.tsx`

**Pattern:** SSG with `generateStaticParams` — all combos of `AUDIENCE_SEO × CATEGORY_SEO` (21 pages). Each page has:
- `generateMetadata` using `getCrossFilterMeta()` helper
- Breadcrumb: Home / {Audience} / {Category}
- H1: "Free {Category} Tools for {Audience}"
- Template-generated intro from `getCrossFilterMeta()`
- DealCard grid (both filters applied). Empty state links back to parent audience.
- Navigation: other categories for same audience + link to `/category/{cat}` and `/top/{cat}`
- JSON-LD: BreadcrumbList
- `revalidate = 300`

**Verify:** `npm run build` — 21 cross-filter pages.
**Commit:** `git commit -m "feat: add /for/[audience]/[category] cross-filter SEO pages"`

---

## Task 5: Create top-N pages `/top/[category]`

**Files:**
- Create: `src/app/top/[category]/page.tsx`

**Pattern:** SSG with `generateStaticParams` from `CATEGORY_SEO` (7 pages). Each page has:
- `generateMetadata` using `getTopMeta()` helper
- Breadcrumb: Home / {Category} / Top N
- H1: "Top N Best Free {Category} Tools"
- Numbered list (not DealCard grid): rank number badge, logo, name, value pill, full description, badges
- Sorting: featured first, then rest
- Links: numbered items link to `/deals/{slug}`, "View all" links to `/category/{cat}`
- Other top lists links
- JSON-LD: ItemList (with `itemListOrder: ItemListOrderDescending`) + BreadcrumbList
- `revalidate = 300`

**Verify:** `npm run build` — 7 top pages.
**Commit:** `git commit -m "feat: add /top/[category] ranked SEO pages"`

---

## Task 6: Create alternatives pages `/alternatives/[slug]`

**Files:**
- Create: `src/app/alternatives/[slug]/page.tsx`

**Pattern:** SSG with `generateStaticParams` from `ALTERNATIVES_SEO` (~15 pages). Each page has:
- `generateMetadata` with unique title, description, canonical
- Breadcrumb: Home / {Category} / Alternatives to {Name}
- H1: "Best Free Alternatives to {Name}"
- Intro from `ALTERNATIVES_SEO`
- DealCard grid: same category deals, excluding the service itself
- Other alternatives links
- JSON-LD: ItemList + BreadcrumbList
- `revalidate = 300`

**Verify:** `npm run build` — ~15 alternatives pages.
**Commit:** `git commit -m "feat: add /alternatives/[slug] SEO pages"`

---

## Task 7: Update sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

**Changes:**
- Import `CATEGORY_SEO`, `AUDIENCE_SEO`, `ALTERNATIVES_SEO` from `@/data/seo-content`
- Remove old `categories` and `audiences` arrays and their query-parameter URL generation
- Add category pages (`/category/{slug}`, priority 0.8)
- Add audience pages (`/for/{slug}`, priority 0.8)
- Add cross-filter pages (`/for/{aud}/{cat}`, priority 0.7)
- Add top pages (`/top/{cat}`, priority 0.7)
- Add alternatives pages (`/alternatives/{slug}`, priority 0.7)

**Verify:** `npm run build`, then check `/sitemap.xml` — no `?category=` or `?audience=` URLs, all new routes present.
**Commit:** `git commit -m "feat: update sitemap with programmatic SEO routes, remove query-param URLs"`

---

## Task 8: Update internal links on homepage

**Files:**
- Modify: `src/app/page.tsx`

**Changes:**
1. Audience card hrefs: `/deals?audience=students` → `/for/students` (same for startups, opensource)
2. Category card hrefs: `` `/deals?category=${cat}` `` → `` `/category/${cat.toLowerCase()}` ``
3. H1 noscript fallback: after `<RotatingWord />` add `<noscript><span className="text-orange-500">developers.</span></noscript>` so SSR HTML has a keyword

**Verify:** `npm run dev` — check links and view-source for noscript content.
**Commit:** `git commit -m "feat: update home page links to new SEO routes, fix h1 noscript fallback"`

---

## Task 9: Update deal detail page internal links

**Files:**
- Modify: `src/app/deals/[slug]/page.tsx`

**Changes:**
1. Wrap `CategoryBadge` in `<Link href={/category/${deal.category.toLowerCase()}}>`
2. Wrap each `AudienceBadge` in `<Link href={/for/${audience}}>`
3. Add breadcrumb category level: Deals / {Category} / {Deal Name}
4. Update BreadcrumbList JSON-LD to include category level
5. After related deals section, add "Top {Category} deals →" link to `/top/{category}`

**Verify:** `npm run dev` — badges are clickable, breadcrumb includes category.
**Commit:** `git commit -m "feat: add internal links from deal pages to category/audience SEO pages"`

---

## Task 10: Add noindex to client-side pages + intro text to /deals

**Files:**
- Modify: `src/app/discover/page.tsx` — add `robots: { index: false, follow: true }` to metadata
- Modify: `src/app/stack/page.tsx` — add `robots: { index: false, follow: true }` to metadata
- Modify: `src/app/deals/page.tsx` — add SEO intro paragraph below heading

**Intro text for /deals:**
"Browse our complete collection of free developer tools, cloud credits, and pro plans for students, startups, and open source projects. Every deal is verified with step-by-step claim instructions."

**Verify:** `npm run build` — succeeds.
**Commit:** `git commit -m "feat: noindex client-side pages, add SEO intro to /deals"`

---

## Task 11: Full build verification

**Step 1:** `npm run build` — all ~225+ pages build (172 existing + ~53 new).
**Step 2:** `npm run lint` — no errors.
**Step 3:** `npm run dev` — spot-check in browser:
- `/category/cloud` — intro, deals, FAQ, JSON-LD in view-source
- `/for/students` — eligibility, category pills, deals
- `/for/students/cloud` — cross-filter works
- `/top/dev` — numbered list
- `/alternatives/aws` — alternatives grid
- `/sitemap.xml` — all new URLs, no query-param URLs
- Home page — links go to new routes
- Deal page — badges link to category/audience pages

**Step 4:** Final commit if fixes needed: `git commit -m "feat: complete programmatic SEO — 53 new landing pages"`
