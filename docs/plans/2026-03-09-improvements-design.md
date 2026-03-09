# StudentPerks Improvements Design

**Date:** 2026-03-09
**Scope:** SEO, UX/Conversion, Retention, Content improvements

## Batch 1 — SEO (Quick Wins)

### 1.1 FAQ Schema (JSON-LD FAQPage)

Pages `/category/[slug]`, `/for/[audience]`, `/alternatives/[slug]` already have `faqs` in `seo-content.ts`. Add JSON-LD `FAQPage` schema.

**Implementation:**
- Server component `FAQSchema.tsx` — accepts `faqs: {question, answer}[]`, renders `<script type="application/ld+json">`
- Insert into each SEO page alongside existing JSON-LD

### 1.2 lastmod in Sitemap

Add `lastModified` to all sitemap entries:
- Deal pages: `last_edited_time` from Notion API
- Blog posts: `date` from MDX frontmatter
- Static pages: build date (`new Date()`)

**Implementation:**
- Update `src/app/sitemap.ts` — add `lastModified` to each URL entry
- Add `updatedAt` field to Deal type in `notion.ts`

### 1.3 RSS Feed for Blog

Route handler at `src/app/blog/feed.xml/route.ts` — generates RSS 2.0 XML.

**Implementation:**
- `GET` route handler, reads posts via `getAllPosts()`, outputs XML
- Add `<link rel="alternate" type="application/rss+xml">` in root layout
- Add RSS link in blog page and footer

---

## Batch 2 — UX/Conversion

### 2.1 Save for Later (Bookmarks)

Heart icon on each deal card. Saves slug to `localStorage` key `saved-deals`.

**Implementation:**
- Hook `useSavedDeals()` — get/toggle/check from localStorage
- Heart icon in top-right corner of `DealCard.tsx` (next to value pill)
- In `DealsGrid.tsx` — filter button "Saved (N)" alongside audience filters
- Scale pulse animation on save

### 2.2 Deal Statuses: Verified/Expired

Notion: new field `Status` (select: `verified` | `expired` | empty).

**Implementation:**
- Add `status?: "verified" | "expired"` to Deal type
- Green "Verified" badge (checkmark) / red "Expired" badge (cross) on card and detail page
- Banner "This deal may have expired" on deal page if expired
- In `DealsGrid.tsx` — hide expired by default (show via toggle)
- Fallback: if field missing in Notion → `undefined`, show nothing

### 2.3 Claim Counter ("X people claimed")

Deterministic pseudo-count based on slug hash + localStorage increment on claim click.

**Implementation:**
- Hook `useClaimCount(slug)` — reads/increments localStorage
- Display "247 people claimed this" on deal page and card
- Starting number: hash of slug → number 50-500 (deterministic)
- Increment on "Claim this perk" click (once per slug per browser)

---

## Batch 3 — Retention

### 3.1 Web Push Notifications

Service worker for push notifications about new deals.

**Implementation:**
- `public/sw.js` — service worker with `push` event listener + offline cache
- API route `POST /api/push-subscribe` — saves subscription to Notion
- Component `PushNotification.tsx` — subscribe button, `Notification.requestPermission()` + `PushManager.subscribe()`
- VAPID keys in env vars
- Phase 1: SW registration + offline fallback + subscription UI. Server-side push sending later.

### 3.2 Country/Region Filter

Some deals are region-specific.

**Implementation:**
- Notion: new field `Regions` (multi_select: `Global`, `US`, `EU`, `UK`, `Asia`, etc.)
- Add `regions?: string[]` to Deal type
- In `DealsGrid.tsx`: dropdown filter "Region" with auto-detect via `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Deals without `regions` treated as Global
- Fallback: empty field → show to everyone

### 3.3 Search Analytics

Log search queries to understand demand.

**Implementation:**
- API route `POST /api/search-log` — accepts `{ query, results_count, timestamp }`
- In `DealsGrid.tsx` — debounced POST on search (500ms delay)
- Storage: Notion database "Search Logs" (Query, Count, Date)
- Dashboard: view data in Notion directly (no custom UI)

---

## Batch 4 — Content

### 4.1 Seasonal Landing Pages

Programmatic SEO pages for seasonal events at `/seasonal/[slug]`.

**Implementation:**
- `src/data/seo-content.ts` — new `SEASONAL_SEO` array:
  - `back-to-school-2026` — best deals for school start (Aug-Sep)
  - `black-friday-2026` — all discounts
  - `new-year-2027` — new year picks
- `src/app/seasonal/[slug]/page.tsx` — hero, filtered deals, FAQ, JSON-LD
- Deal filtering: by tags/categories relevant to season (defined in config)
- Add to sitemap

### 4.2 YouTube Video Embeds

Embed YouTube videos on deal pages and in MDX articles.

**Implementation:**
- Notion: new field `Video` (url) — YouTube link
- Add `video?: string` to Deal type
- Component `YouTubeEmbed.tsx` — lite-youtube-embed approach (thumbnail first, iframe on click)
- Deal page: "How to claim" section with video if available
- MDX: export `<YouTube id="..." />` component for articles
- No auto-video — only when field is filled

---

## Files to Create/Modify

### New files:
- `src/components/FAQSchema.tsx`
- `src/app/blog/feed.xml/route.ts`
- `src/hooks/useSavedDeals.ts`
- `src/hooks/useClaimCount.ts`
- `src/components/SaveButton.tsx`
- `src/components/DealStatusBadge.tsx`
- `src/components/ClaimCounter.tsx`
- `src/components/PushNotification.tsx`
- `src/components/YouTubeEmbed.tsx`
- `src/app/api/push-subscribe/route.ts`
- `src/app/api/search-log/route.ts`
- `src/app/seasonal/[slug]/page.tsx`
- `public/sw.js`

### Modified files:
- `src/data/deals.ts` — add `status`, `regions`, `video`, `updatedAt` to Deal type
- `src/data/seo-content.ts` — add `SEASONAL_SEO`
- `src/lib/notion.ts` — parse new Notion fields
- `src/lib/deals.ts` — handle new fields in fallback
- `src/app/sitemap.ts` — add lastmod, seasonal URLs
- `src/app/layout.tsx` — RSS link tag, SW registration
- `src/components/DealCard.tsx` — save button, status badge, claim count
- `src/app/deals/[slug]/page.tsx` — video embed, claim counter, expired banner
- `src/components/DealsGrid.tsx` — saved filter, region filter, search logging
- `src/app/category/[slug]/page.tsx` — FAQ schema
- `src/app/for/[audience]/page.tsx` — FAQ schema
- `src/app/alternatives/[slug]/page.tsx` — FAQ schema
- `src/app/blog/page.tsx` — RSS link
- `src/lib/blog.ts` — export post dates for sitemap
