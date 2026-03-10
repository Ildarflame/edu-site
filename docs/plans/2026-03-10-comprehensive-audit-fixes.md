# Comprehensive Audit Fixes — Implementation Plan

> **For Claude:** Execute all 4 streams in parallel using agents.

**Goal:** Fix all issues found by 4-agent audit (SEO, Code, UX, Features)

**Architecture:** 4 parallel workstreams, each independent (no cross-file conflicts)

---

## Stream 1: Security & Critical Fixes

**Owner:** agent-security

**Files:**
- Create: `src/app/robots.ts`
- Fix: `src/app/api/revalidate/route.ts` — remove extra arg from revalidateTag
- Fix: `src/app/api/subscribe/route.ts` — add input validation + fix rate limiter leak
- Fix: `src/app/api/search-log/route.ts` — cap query length
- Fix: `src/app/api/deals/route.ts` — remove redundant revalidate export

**Tasks:**
1. Create `robots.ts` with proper rules (allow /, disallow /api/ /_next/, sitemap ref)
2. Fix `revalidateTag("deals", "max")` → `revalidateTag("deals")`
3. Add validation to subscribe API: whitelist frequency values, cap interests array length, sanitize strings
4. Add eviction to rate limiter Map (delete entries older than TTL on each request)
5. Cap search-log query to 200 chars
6. Remove redundant `export const revalidate = 300` from `/api/deals/route.ts`

---

## Stream 2: JSON-LD XSS Fix + SEO Meta

**Owner:** agent-seo

**Files to fix (add `.replace(/</g, "\\u003c")`):**
- `src/app/seasonal/[slug]/page.tsx`
- `src/app/tag/[slug]/page.tsx`
- `src/app/student-discount/[tool]/page.tsx`
- `src/app/vs/[slug]/page.tsx`
- `src/app/top/[category]/page.tsx`
- `src/app/alternatives/[slug]/page.tsx`
- `src/app/best/[slug]/page.tsx`
- `src/app/compare/[slug]/page.tsx` (verify — may already have it)
- `src/app/student-discount/page.tsx`
- `src/app/free-tools-for-students/JsonLd.tsx`
- `src/app/for/[audience]/[category]/page.tsx`

**SEO meta fixes:**
- Add canonical to `/blog` (`src/app/blog/page.tsx`)
- Add canonical to `/about` (`src/app/about/page.tsx`)
- Add OG tags to `/vs/[slug]` and `/university/[slug]`
- Add JSON-LD to `/university/[slug]` (ItemList + BreadcrumbList)
- Add JSON-LD to `/savings-calculator/page.tsx` (WebApplication)
- Add JSON-LD to `/this-week/page.tsx` (CollectionPage)
- Shorten titles on pages exceeding 60 chars: /deals, /student-discount, /free-tools-for-students, /university, /savings-calculator, /blog, /about

---

## Stream 3: Code Quality & Performance

**Owner:** agent-code

**Files:**
- `src/components/DealCard.tsx` — wrap in memo()
- `src/components/DealRating.tsx` — fix stale closure in handlers
- `src/components/DealVoting.tsx` — verify same pattern isn't there
- `src/components/SaveButton.tsx` — fix setTimeout cleanup on unmount
- `src/components/PushNotification.tsx` — disable if no VAPID key (show nothing)
- `src/components/Header.tsx` — add aria-expanded, aria-haspopup
- `src/components/DealCard.tsx` — replace title with aria-label on compare button

---

## Stream 4: UX & Navigation Improvements

**Owner:** agent-ux

**Files:**
- `src/components/Footer.tsx` — add missing audience pages + 3 remaining categories
- `src/components/Header.tsx` — mobile menu grouping with section labels (only mobile part)
- `src/app/deals/[slug]/page.tsx` — add newsletter capture after related deals
- `src/app/student-discount/page.tsx` — add client-side search filter

---

## Verification

After all streams complete:
1. `npm run lint`
2. `npm run build` — must succeed with 511+ pages
3. Commit and push
