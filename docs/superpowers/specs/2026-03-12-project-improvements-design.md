# StudentPerks — Project Improvements Design

**Date:** 2026-03-12
**Status:** Approved
**Priority:** Conversion + Content Quality
**Approach:** Quick wins first, then foundational improvements (parallel)

---

## Context

StudentPerks (www.studentperks.dev) is a Next.js 16 student deals directory with 150+ deals and 515+ prerendered pages. The site is early-stage: GSC shows 1 click in 3 months, ~50 visitors/week mostly direct. The SEO foundation is strong; the priority now is making existing pages more valuable and driving retention.

**Identified problems:**
- Deal pages are thin — not enough reason to stay
- No retention — users visit once and don't return
- Interactive tools don't deliver enough value
- Homepage doesn't clearly communicate the value proposition

---

## Section 1 — Quick Wins (1–2 weeks)

### 1.1 Deal Pages — Visual Redesign (`/deals/[slug]`)

**Note:** Related deals are already fetched server-side (`getDealsByCategory`). This is a **visual redesign only** — no new data fetching needed.

- Visual "How to get it" block — large numbered steps with icons, not plain text
- Related deals section: redesign the existing UI — make cards more prominent, show value pill on each
- Sticky CTA button on mobile (currently lost on scroll)
- "Verified" badge with last-checked date (see Section 3.2 on `updatedAt` repurposing)

### 1.2 Homepage

- Rewrite hero copy to address a concrete pain point:
  *"150+ free tools for students. Save $500K+ in software costs."*
- Simplify layout: hero → top-6 deals → categories → newsletter (remove redundant sections)
- Add social proof: *"2,400+ students have already saved deals"* (powered by existing claim counter)

### 1.3 Email Capture — New `useDealViewCount` Hook

**Deliverable:** Build `src/hooks/useDealViewCount.ts` using `useSyncExternalStore` pattern (same as `useSavedDeals.ts`). Tracks **distinct** deal slugs viewed, stored in localStorage key `sp_deal_view_count` as a `string[]` (array of slugs).

- Hook signature: `useDealViewCount(slug: string)` — call on mount of deal page client component
- Only adds slug if not already in array (distinct pages only — revisiting same deal doesn't count)
- Show popup when `array.length >= 3`, dismissed permanently (localStorage flag `sp_popup_dismissed`)
- Offer: *"Get new deals once a week"* — single email field, submit to existing `/api/subscribe`
- Show popup once per user lifetime (check flag before rendering)

### 1.4 Deals Catalog (`/deals`)

- Make `value` pill larger and more prominent on deal cards — it's the primary hook
- Improve empty state when filters return no results: add *"Try removing some filters"* with a reset button

---

## Section 2 — Foundational Improvements (2–4 weeks)

### 2.1 Onboarding Flow (First-Time Visitors)

Inline 2-step widget in the hero on first visit (not a modal):
1. *"Are you a student, startup, or open source project?"* → single select → maps to `Audience`
2. *"What tools do you use?"* → single select from: Dev / AI / Cloud / Design / SaaS → maps to `Category`

**Decision on multi-category:** Onboarding outputs a **single audience + single category** to remain compatible with existing `DealsGrid` props (`initialCategory?: Category`, `initialAudience?: Audience`). Multi-category selection is out of scope for v1.

**Implementation:**
- New `useOnboarding` hook (`useSyncExternalStore`, localStorage key `sp_onboarding`)
- State shape: `{ audience: Audience | null, category: Category | null, completed: boolean }`
- Pass `audience` and `category` to `DealsGrid` as `initialAudience` / `initialCategory`
- Skip option always visible; completed state persists across visits

### 2.2 Deal Card Redesign

**Scheduled Week 3** (after onboarding design is finalized, to avoid rework).

Current: logo + name + tagline + value pill
New layout:
- Value pill: larger, top-right, first thing the eye sees
- Audience badge (Students / Startups / OS) always visible (not hover-only)
- On hover: reveal first step of claiming the deal
- Goal: user understands the value in 2 seconds without clicking

### 2.3 Retention Loop

**Weekly digest:** Add email signup on `/this-week` specifically for weekly deal updates. Separate CTA from general newsletter — submit to existing `/api/subscribe` with `frequency: "weekly"` param (already supported).

**My Deals enhancement:** Saved deals page shows status (active/expired) + "Remind me" button.
- "Remind me" = sets a localStorage timestamp (`sp_remind_${slug}` = Date.now() + 30 days)
- On next visit to saved deals page: if timestamp passed → show inline banner *"Time to check if you claimed [Deal Name]"*
- **Delivery mechanism: banner on revisit only** (no push/email — localStorage only)

**Push notifications — Deferred:**
The existing push infrastructure (`/api/push-subscribe`) only logs subscriptions to console — it does not persist them. Sending pushes would require: (a) persistent subscription storage (KV or DB), (b) Web Push send function with VAPID private key, (c) new trigger endpoint. This is 1–2 days of new infrastructure. **Deferred to a future spec.**

### 2.4 Interactive Tools — Shareable URLs

**Freebies Finder (`/student-freebies-finder`):**
- Shareable result URL: encode selections in query params (`?country=US&major=cs&audience=students`)
- Parse query params on load to restore state (use `useSearchParams`)
- Add "Copy link" button after results step

**Savings Calculator (`/savings-calculator`):**
- Show total savings prominently at the end
- Add "Share my savings" button → pre-filled tweet text: *"I'm saving $12,400/year as a student developer via @StudentPerks"*
- Copy-to-clipboard fallback

**Stack Builder (`/stack`):**
- Shareable URL: encode selected tools in query params
- Parse on load to restore stack state

**Tracking:** Use Vercel Analytics `track()` custom events (e.g., `{ name: 'share_result', tool: 'freebies-finder' }`) — not search logs.

---

## Section 3 — Content & Quality (Parallel with Section 2)

### 3.1 Deal Page Depth

Add two new fields to Notion database:
- `Tips` (rich_text) — common mistakes / tips, 1–3 sentences
- `Requirements` (rich_text) — verification method (student email / .edu / GitHub Student Pack / LinkedIn)

Add to `Deal` type in `src/data/deals.ts`:
```ts
tips?: string
requirements?: string
```

Fetch in `src/lib/notion.ts` alongside existing fields. Render on deal page as styled callout blocks if populated (graceful degradation if empty).

### 3.2 Freshness — Repurpose `updatedAt`

`Deal` type already has `updatedAt?: string` from Notion's `last_edited_time`. **No new Notion field needed.**

- Display on deal page: *"Last verified: March 5, 2026"* using `updatedAt` formatted date
- Instruct: when manually verifying a deal in Notion, touch any field to update `last_edited_time`

**Vote-based flagging — Redesigned:**
Votes are localStorage-only — no server-side aggregation exists. Auto-flagging via threshold is not feasible without a vote backend.

Instead: add a **"Report broken"** link on deal pages. Clicking it calls `POST /api/report-deal` with `{ slug }`.

**Implementation:** Use a `Reports` numeric property on the Notion deal page (create it in Notion DB). The route looks up the deal page ID by slug via Notion search API, then increments the `Reports` property via Notion PATCH. Note: `page.id` is currently discarded in `pageToDeal()` — add `notionPageId?: string` to the `Deal` type and return it from `src/lib/notion.ts` so the route can look it up without a secondary query. Admin reviews `Reports` count in Notion. Simple, no aggregation backend needed.

### 3.3 Blog as SEO Engine

Write 3–5 articles targeting real search queries:
- *"best free tools for CS students 2026"*
- *"github student pack alternatives"*
- *"free figma for students — complete guide"*
- *"free cloud credits for students"*
- *"best free AI tools for students"*

Format: comparison guides with tables, heavy internal linking to relevant deals. Add as `.mdx` files in `src/content/blog/`.

### 3.4 Social Proof

- Hero: live stats — number of deals, total savings value, number of categories (from Notion count at build time)
- Deal cards: *"847 students saved this"* using existing deterministic claim counter (already implemented in `ClaimCounter.tsx`)

---

## Architecture Notes

- All new localStorage state must use `useSyncExternalStore` with cached snapshots (pattern in `useSavedDeals.ts`, `useClaimCount.ts`)
- New hooks: `useDealViewCount`, `useOnboarding`
- Onboarding widget: server page + client widget — no SSR mismatch
- Shareable URLs: `useSearchParams` (Next.js, already used in deals catalog)
- Notion new fields (`tips`, `requirements`): update `Deal` type + `src/lib/notion.ts` fetch logic
- `/api/report-deal`: new route, creates Notion comment or increments `Reports` property via Notion API

---

## Implementation Order

| Week | Tasks |
|------|-------|
| 1 | 1.1 Deal page visual redesign, 1.2 Homepage rewrite, 1.3 `useDealViewCount` + popup, 1.4 Empty state |
| 2 | 3.4 Social proof on cards + homepage, 3.2 `updatedAt` freshness display, 3.2 Report broken link + `/api/report-deal` |
| 3 | 2.1 Onboarding flow, 2.2 Deal card redesign (after onboarding finalised), 3.1 Notion fields + deal page depth |
| 4 | 2.3 Retention loop (weekly digest CTA, remind-me banner), 2.4 Shareable URLs for tools, 3.3 Blog articles |

---

## Success Criteria

- Bounce rate on deal pages decreases (Vercel Analytics)
- Email signups increase (newsletter + weekly digest CTA)
- "Report broken" submissions appear in Notion (signal of engagement)
- Tools: share events tracked via Vercel Analytics custom events
- Blog: at least 2 articles indexed in GSC within 4 weeks of publishing
