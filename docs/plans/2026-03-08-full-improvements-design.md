# StudentPerks Full Improvements Design

**Date:** 2026-03-08
**Scope:** B (системный рефакторинг) + C (новые фичи)
**Estimated sessions:** 7-10

---

## Section 1: Security & Stability

### API Route Hardening (`/api/submit-deal`, `/api/subscribe`)
- Origin header validation (only `studentperks.dev`)
- Field length limits: name ≤100, url ≤500, description ≤2000
- Category/audiences validation against allowed values from `src/data/deals.ts`
- Duplicate detection on submit — check URL in Notion before creating

### Error Boundary
- `ErrorBoundary` component wrapping `{children}` in `layout.tsx`
- Fallback UI: "Something went wrong" + "Refresh page" button

### Notion Data Validation
- Zod schema for `Deal` in `src/lib/notion.ts`
- Invalid entries are logged and skipped (don't break the entire fetch)

### Caching
- `React.cache()` wrapper for `getDeals()` — deduplication within a single render
- `next/unstable_cache` with tag `"deals"` + TTL 300s — server cache between requests
- Webhook route `POST /api/revalidate` → `revalidateTag("deals")` for instant Notion updates

---

## Section 2: Performance & DealsGrid Refactor

### Split DealsGrid (323 lines → 4 components)
- `FilterBar` — search, category, audience, value, sort. `React.memo` to avoid re-render on page change
- `DealsList` — card rendering with `stagger-grid`. `React.memo` by filtered deals array
- `PaginationControls` — page navigation with aria attributes
- `DealsGrid` — remains orchestrator: holds state, passes props

### Shared Card Component
- `DealCardCompact` — replaces duplicated rendering in `StackBuilder`, `DealFinder`, and simplified cards in SEO pages
- `DealCard` remains for catalog (with compare checkbox, rating)

### Memoization
- `useMemo` for filtering (depends on deals, search, category, audience, value, sort)
- `useMemo` for `getPageNumbers()` (depends on page, totalPages)
- Debounce 300ms on search — new hook `useDebounce(value, delay)` in `src/lib/hooks.ts`

### Image Optimization
- `loading="lazy"` on `<Image>` in cards (below fold)
- `priority={true}` only for featured deals on homepage

### Dead Code Removal
- Remove unused `import { Client } from "@notionhq/client"` and `const notion = new Client(...)` from `notion.ts`

---

## Section 3: SEO & Accessibility

### Dynamic OG Images
- Route `src/app/api/og/route.tsx` using `@vercel/og` (ImageResponse)
- Generates image with deal name, category, value pill, logo
- Connected in `generateMetadata()` on `/deals/[slug]` — `openGraph.images: [{ url: '/api/og?slug=...' }]`

### Accessibility
- Skip-link in `Header` — hidden link `#main-content`, visible on Tab focus
- `<main id="main-content">` in layout
- Filters: `role="group"` + `aria-label="Filter by category"`, `aria-pressed` on active buttons
- Pagination: `aria-label="Page navigation"`, `aria-current="page"` on current page
- Decorative SVG icons: `aria-hidden="true"`

### Structured Data
- `CollectionPage` JSON-LD on `/deals` with `itemListElement` for visible deals
- `FAQPage` JSON-LD on SEO pages (`/category/*`, `/for/*`) — FAQ data already exists in `seo-content.ts`

### Meta Tags
- Verify canonical URL on all programmatic SEO pages (`/top/*`, `/for/*/[category]`)

---

## Section 4: UX Improvements

### Mobile Filters
- `MobileFilterDrawer` — bottom sheet/drawer, triggered by "Filters (N)" button where N = active filter count
- Desktop: unchanged inline layout
- Breakpoint: `md` (768px) — below shows button, above shows inline

### Empty State
- Icon + text + "Clear all filters" button that resets URL params
- If search has no results — suggest similar categories

### Loading States
- `opacity-50 transition-opacity` on card grid during filter changes
- `DealCardSkeleton` on page change in pagination

### Deal Comparison
- Highlight differing fields (category, audiences, value) with contrasting background
- Shared fields — normal background

### Submit Form Feedback
- Toast/inline message after successful submission ("Thanks! We'll review in 48 hours")
- Inline error on duplicate URL ("This deal already exists in the catalog")

---

## Section 5: New Features

### Deal Click Tracking
- Vercel Analytics custom events — `track('deal_click', { slug, category, audience })`
- On "Get Deal" CTA in `/deals/[slug]` and on card click in catalog
- No extra dependencies — `@vercel/analytics` already installed

### Deal Export
- "Export" button in `FilterBar` next to sort
- Exports current filtered list to CSV (name, category, value, url)
- Client-side generation via `Blob` + `URL.createObjectURL` — no API route needed

### Category Subscription
- Category checkboxes in `NewsletterForm` (Dev, AI, Cloud...)
- Passed to `/api/subscribe` as `categories[]`
- Saved to Notion (new multi_select `Categories` field in subscriptions)

### Advanced Filters
- Multi-audience selection (AND logic — show deals available to all selected audiences)
- "Popular" sort based on ratings from localStorage (client-side)
- "Recently added" filter — last 30 days (needs `created_time` from Notion)

### Homepage Personalization
- Cookie `sp_prefs` — remembers last viewed categories and audience
- "Recommended for you" section on homepage — 4 deals from preferred categories
- No PII, categories only. Cookie httpOnly=false (client access), SameSite=Strict
