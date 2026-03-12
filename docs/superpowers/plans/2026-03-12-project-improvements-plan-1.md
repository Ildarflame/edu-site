# StudentPerks Improvements — Implementation Plan 1 (Weeks 1–2)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship all Week 1–2 improvements from the project improvements spec: email capture popup, deal page polish, homepage rewrite, deals catalog fixes, social proof on cards, freshness display, and "Report broken" feature.

**Architecture:** No test framework exists — verification is TypeScript compile (`npx tsc --noEmit`), ESLint (`npm run lint`), and visual inspection via dev server. Each task is independently deployable. All new localStorage hooks follow the `useSyncExternalStore` pattern from `useClaimCount.ts`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, TypeScript, Notion REST API, Vercel Analytics (`@vercel/analytics`). No test runner.

**Spec:** `docs/superpowers/specs/2026-03-12-project-improvements-design.md`

---

## Chunk 1: Deal Page Client Infrastructure + Email Popup

### Task 1: `useDealViewCount` hook

**Files:**
- Create: `src/hooks/useDealViewCount.ts`

**What it does:** Tracks an array of distinct deal slugs the user has viewed. Stored as a JSON array in `localStorage` under key `sp_deal_views`. Used to trigger the email popup after 3 unique deal visits.

- [ ] **Step 1: Create the hook**

```ts
// src/hooks/useDealViewCount.ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sp_deal_views";

// Cached snapshot — same pattern as useSavedDeals.ts to avoid
// returning new array references on every render cycle.
let cachedSnapshot: string[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSnapshot = JSON.parse(raw);
    } catch {
      cachedSnapshot = [];
    }
  }
  return cachedSnapshot;
}

const serverSnapshot: string[] = [];

let listeners: (() => void)[] = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange() {
  listeners.forEach((l) => l());
}

export function useDealViewCount(slug: string) {
  const viewed = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const track = useCallback(() => {
    const current = getSnapshot();
    if (current.includes(slug)) return;
    const updated = [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    cachedRaw = null; // invalidate cache
    emitChange();
  }, [slug]);

  return { viewCount: viewed.length, track };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDealViewCount.ts
git commit -m "feat: add useDealViewCount hook for email popup trigger"
```

---

### Task 2: Shared dismissed-popup store + email capture popup component

**Files:**
- Create: `src/hooks/useDismissedPopup.ts`
- Create: `src/components/DealViewPopup.tsx`

**Why a shared store:** `DealPageTracker` (which gates rendering the popup) and `DealViewPopup` (which calls dismiss on close) live in separate modules. They share the same localStorage key but module-level listener arrays don't cross file boundaries. A shared hook module gives both components the same listener array, so `dismiss()` notifies `DealPageTracker`'s `usePopupDismissed` hook to re-render and stop mounting the popup.

- [ ] **Step 1: Create shared dismissed popup store**

```ts
// src/hooks/useDismissedPopup.ts
"use client";

import { useSyncExternalStore } from "react";

export const DISMISSED_KEY = "sp_popup_dismissed";

let cachedDismissed = false;
let cachedDismissedRaw: string | null = null;

function getSnapshot(): boolean {
  const raw = localStorage.getItem(DISMISSED_KEY) ?? "0";
  if (raw !== cachedDismissedRaw) {
    cachedDismissedRaw = raw;
    cachedDismissed = raw === "1";
  }
  return cachedDismissed;
}

const listeners: (() => void)[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function dismissPopup() {
  try {
    localStorage.setItem(DISMISSED_KEY, "1");
    cachedDismissedRaw = null; // invalidate cache
    listeners.forEach((l) => l());
  } catch {}
}

export function usePopupDismissed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
```

- [ ] **Step 2: Create the popup component**

```tsx
// src/components/DealViewPopup.tsx
"use client";

import { useState } from "react";
import { dismissPopup } from "@/hooks/useDismissedPopup";

export default function DealViewPopup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function handleDismiss() {
    dismissPopup();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency: "weekly", interests: [] }),
      });
      setStatus("done");
      // Dismiss after a short delay so user sees confirmation
      setTimeout(dismissPopup, 2000);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 z-50 w-[300px] card p-5 shadow-xl shadow-black/40 animate-in">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {status === "done" ? (
        <div className="text-center py-2">
          <div className="text-emerald-400 font-semibold text-[14px] mb-1">You&apos;re in!</div>
          <p className="text-[12px] text-zinc-600">New deals hit your inbox weekly.</p>
        </div>
      ) : (
        <>
          <p className="text-[13px] font-semibold text-zinc-200 mb-1 pr-5">Get new deals weekly</p>
          <p className="text-[12px] text-zinc-600 mb-3">Free, no spam, unsubscribe anytime.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/40 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary py-2 text-[12px] text-center"
            >
              {status === "loading" ? "Subscribing…" : "Get Weekly Deals →"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DealViewPopup.tsx
git commit -m "feat: add DealViewPopup email capture component"
```

---

### Task 3: Wire tracking + popup into deal pages

**Files:**
- Create: `src/components/DealPageTracker.tsx`
- Modify: `src/app/deals/[slug]/page.tsx` — add `<DealPageTracker slug={slug} />`

**What it does:** A null-rendering client component (same pattern as `CategoryTracker`) that records the slug on mount and conditionally renders `DealViewPopup` when count ≥ 3 and not dismissed.

- [ ] **Step 1: Create DealPageTracker**

`DealPageTracker` uses `usePopupDismissed` from the shared `useDismissedPopup.ts` hook, so when `DealViewPopup` calls `dismissPopup()`, the shared listener array is notified and `DealPageTracker` stops mounting the popup.

```tsx
// src/components/DealPageTracker.tsx
"use client";

import { useEffect } from "react";
import { useDealViewCount } from "@/hooks/useDealViewCount";
import { usePopupDismissed } from "@/hooks/useDismissedPopup";
import DealViewPopup from "./DealViewPopup";

export default function DealPageTracker({ slug }: { slug: string }) {
  const { viewCount, track } = useDealViewCount(slug);
  const dismissed = usePopupDismissed();

  useEffect(() => {
    track();
  }, [track]);

  if (dismissed || viewCount < 3) return null;
  return <DealViewPopup />;
}
```

- [ ] **Step 2: Add to deal page**

In `src/app/deals/[slug]/page.tsx`, add the import and render `<DealPageTracker>` right after `<CategoryTracker>`:

Find this block (line 17–18):
```tsx
import CategoryTracker from "@/components/CategoryTracker";
```

Add the import below it:
```tsx
import DealPageTracker from "@/components/DealPageTracker";
```

Find line 59:
```tsx
      <CategoryTracker category={deal.category} />
```

Add after it:
```tsx
      <DealPageTracker slug={slug} />
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Visit 3 different deal pages (e.g., `/deals/github-students`, `/deals/figma-education`, `/deals/notion-students`). After the 3rd, popup should appear bottom-right. Dismiss → popup gone, does not reappear on refresh.

- [ ] **Step 5: Commit**

```bash
git add src/components/DealPageTracker.tsx src/app/deals/\[slug\]/page.tsx
git commit -m "feat: wire deal view tracking and email popup into deal pages"
```

---

### Task 4: Deal page — verified date badge + sticky mobile CTA

**Files:**
- Modify: `src/app/deals/[slug]/page.tsx`

**What it does:** (a) Shows "Last verified: [date]" below the status badge using existing `deal.updatedAt`. (b) Adds a sticky CTA bar at the bottom on mobile so the "Claim this perk" button stays visible.

- [ ] **Step 1: Add verified date helper and sticky CTA wrapper**

In `src/app/deals/[slug]/page.tsx`:

After the imports, add a helper function:
```ts
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

In the header block, find where audiences badges are rendered (around line 94–98). After the audience badges `div`, add the verified date:
```tsx
          {deal.updatedAt && (
            <p className="mt-2 text-[11px] text-zinc-700 font-medium">
              Last verified: {formatDate(deal.updatedAt)}
            </p>
          )}
```

For the sticky mobile CTA, add this block just before the closing `</main>` tag (before the `<script>` tags):
```tsx
      {/* Sticky mobile CTA — hidden on md+ where inline CTA is visible */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-zinc-950/90 backdrop-blur-sm border-t border-white/[0.04]">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center py-3 text-[14px] font-semibold block"
        >
          Claim this perk →
        </a>
      </div>
      {/* Spacer so sticky bar doesn't cover content on mobile */}
      <div className="md:hidden h-20" />
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Visual check on mobile viewport**

In browser DevTools, set viewport to 390px width. Visit any deal page. Verify sticky bar appears at bottom. Verify "Last verified" date appears below audience badges.

- [ ] **Step 4: Commit**

```bash
git add src/app/deals/\[slug\]/page.tsx
git commit -m "feat: add verified date badge and sticky mobile CTA to deal pages"
```

---

## Chunk 2: Homepage + Catalog Quick Wins

### Task 5: Homepage — hero copy + social proof

**Files:**
- Modify: `src/app/page.tsx`

**What it does:** Updates the hero subheading to lead with the concrete value proposition. Adds a "students saved" social proof line in the hero.

- [ ] **Step 1: Update subheading**

Find this block (around line 88–90):
```tsx
          <p className="mt-5 text-center text-[17px] md:text-lg text-zinc-500 max-w-md mx-auto leading-relaxed animate-in delay-2">
            Credits, pro plans, and perks — curated for students, startups, and OSS maintainers.
          </p>
```

Replace with:
```tsx
          <p className="mt-5 text-center text-[17px] md:text-lg text-zinc-500 max-w-md mx-auto leading-relaxed animate-in delay-2">
            {deals.length}+ verified deals worth $500K+ in software — free for students, startups, and open source.
          </p>
```

- [ ] **Step 2: Add social proof under the CTA buttons**

Find the closing `</div>` after the CTAs section — the `animate-in delay-3` div containing the two buttons (around line 93–100). Right after that closing `</div>`, before the audience pills section, add:

```tsx
          {/* Social proof */}
          <p className="mt-4 text-center text-[12px] text-zinc-700 animate-in delay-4">
            Joined by 2,400+ developers, students & founders
          </p>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Visit `/`. Verify updated subheading and social proof text appear in hero.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage hero copy with concrete value prop and social proof"
```

---

### Task 6: Deals catalog — empty state improvement + value pill prominence

**Files:**
- Modify: `src/components/DealsGrid.tsx`
- Modify: `src/components/DealCard.tsx`

**What it does:** (a) Improves the empty state message to be more action-oriented. (b) Makes the `value` pill text slightly larger on deal cards.

- [ ] **Step 1: Improve empty state in DealsGrid**

In `src/components/DealsGrid.tsx`, find the empty state block (around line 253–268):
```tsx
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-[15px]">No deals found</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try adjusting your filters or search term</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 text-[13px] text-orange-400 hover:text-orange-300 transition-colors font-medium"
          >
            Clear all filters
          </button>
        </div>
```

Replace with:
```tsx
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-zinc-400 text-[15px] font-medium">No deals match your filters</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try removing some filters to see more results</p>
          <button
            onClick={clearAllFilters}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[13px] text-orange-400 hover:bg-orange-500/15 transition-all font-medium"
          >
            Remove all filters
          </button>
        </div>
```

- [ ] **Step 2: Make value pill larger on deal cards**

In `src/components/DealCard.tsx`, find line 79:
```tsx
            <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md">
```

Replace with:
```tsx
            <span className="value-pill text-[12px] font-bold px-2.5 py-1 rounded-md">
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 4: Visual check**

Visit `/deals`, apply a filter that yields no results. Verify new empty state with orange button. Also verify value pill is slightly larger on all cards.

- [ ] **Step 5: Commit**

```bash
git add src/components/DealsGrid.tsx src/components/DealCard.tsx
git commit -m "feat: improve deals empty state UX and make value pill more prominent"
```

---

## Chunk 3: Week 2 — Social Proof + Freshness + Report Broken

### Task 7: Social proof on deal cards — claim counter text

**Files:**
- Modify: `src/components/ClaimCounter.tsx`

**What it does:** Makes the claim counter text more social-proof-oriented ("847 students saved this" instead of generic count display).

- [ ] **Step 1: Read the current component**

```bash
cat src/components/ClaimCounter.tsx
```

- [ ] **Step 2: Update claim counter copy**

In `src/components/ClaimCounter.tsx`, find the text that displays the count. Replace the display text pattern to read `"{count} students saved this"` — adjust exact JSX based on what you see in the file.

If the component renders something like `{count} claimed`, change it to render:
```tsx
<span className="text-[11px] text-zinc-700 mt-1.5 block">{count.toLocaleString()} students saved this</span>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ClaimCounter.tsx
git commit -m "feat: update claim counter copy to social proof language"
```

---

### Task 8: Report Broken feature

**Files:**
- Create: `src/app/api/report-deal/route.ts`
- Modify: `src/app/deals/[slug]/page.tsx` — add "Report broken" link + `ReportButton` import
- Create: `src/components/ReportButton.tsx`

**What it does:** Lets users report a broken deal. Server-side: queries Notion directly by slug, then increments a `Reports` number property. Client-side: a small "Report broken" link that POSTs to `/api/report-deal`. Rate-limited by localStorage (one report per slug per session).

**Prerequisites:** Create a `Reports` number property in the Notion deals database before running this task. Name it exactly `Reports`.

- [ ] **Step 1: Create `/api/report-deal` route**

The route looks up the deal directly from Notion by slug using a database filter — this avoids calling `getDeals()` which wraps `unstable_cache` with `React.cache()` (unsafe in Route Handlers). The Notion database ID is already available via `NOTION_DEALS_DATABASE_ID`.

```ts
// src/app/api/report-deal/route.ts
import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

function notionHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const databaseId = process.env.NOTION_DEALS_DATABASE_ID;
    if (!databaseId || !process.env.NOTION_TOKEN) {
      return NextResponse.json({ error: "not configured" }, { status: 503 });
    }

    // Find the Notion page for this slug directly (no React.cache / getDeals)
    const searchRes = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: notionHeaders(),
        body: JSON.stringify({
          filter: { property: "Slug", rich_text: { equals: slug } },
          page_size: 1,
        }),
      }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ error: "notion search failed" }, { status: 500 });
    }

    const data = await searchRes.json();
    const page = data.results?.[0];
    if (!page) {
      return NextResponse.json({ error: "deal not found" }, { status: 404 });
    }

    const current = page.properties?.Reports?.number ?? 0;

    // Increment Reports property
    const patchRes = await fetch(
      `https://api.notion.com/v1/pages/${page.id}`,
      {
        method: "PATCH",
        headers: notionHeaders(),
        body: JSON.stringify({
          properties: { Reports: { number: current + 1 } },
        }),
      }
    );

    if (!patchRes.ok) {
      return NextResponse.json({ error: "notion patch failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
```

Note: since the route now queries Notion directly, `notionPageId` is **no longer needed** in the `Deal` type or `notion.ts`. Remove Task 8 Steps 1–2 (adding `notionPageId` to Deal type and `pageToDeal`). The route is self-contained.

- [ ] **Step 4: Create `ReportButton` client component**

```tsx
// src/components/ReportButton.tsx
"use client";

import { useEffect, useState } from "react";

const REPORTED_PREFIX = "sp_reported_";

export default function ReportButton({ slug }: { slug: string }) {
  const reportedKey = `${REPORTED_PREFIX}${slug}`;

  // Initialize to "idle" on SSR and client — read localStorage in useEffect
  // to avoid hydration mismatch (CLAUDE.md: never seed useState from localStorage directly)
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (localStorage.getItem(reportedKey) === "1") {
      setStatus("done");
    }
  }, [reportedKey]);

  async function handleReport() {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      await fetch("/api/report-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      localStorage.setItem(reportedKey, "1");
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <span className="text-[12px] text-zinc-700">
        Thanks for the report — we&apos;ll check it.
      </span>
    );
  }

  return (
    <button
      onClick={handleReport}
      disabled={status === "loading"}
      className="text-[12px] text-zinc-700 hover:text-zinc-500 transition-colors underline underline-offset-2 decoration-dotted"
    >
      {status === "loading" ? "Reporting…" : "Report broken deal"}
    </button>
  );
}
```

- [ ] **Step 5: Add ReportButton to deal page**

In `src/app/deals/[slug]/page.tsx`, add the import:
```tsx
import ReportButton from "@/components/ReportButton";
```

Find the DealVoting block (around line 147–150):
```tsx
      {/* Status Voting */}
      <div className="mb-4">
        <DealVoting slug={deal.slug} />
      </div>
```

Add ReportButton after DealVoting:
```tsx
      {/* Report broken */}
      <div className="mb-4 flex justify-end">
        <ReportButton slug={deal.slug} />
      </div>
```

- [ ] **Step 6: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 7: Manual end-to-end test**

Start dev server, visit any deal page. Click "Report broken deal". Check Notion database — the `Reports` column for that deal should increment by 1.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/report-deal/route.ts src/components/ReportButton.tsx src/app/deals/\[slug\]/page.tsx
git commit -m "feat: add Report Broken feature — increments Notion Reports property"
```

---

### Task 9: Deal page — freshness display

**Files:**
- Modify: `src/app/deals/[slug]/page.tsx`

**What it does:** The `updatedAt` field is already fetched from Notion. This task makes it visible on the deal page header. Already partially done in Task 4 (verified date). Verify it's rendering correctly and the format is readable.

- [ ] **Step 1: Verify `updatedAt` is rendering**

In `npm run dev`, visit a deal page. Confirm "Last verified: [Month Day, Year]" appears below the audience badges. If Task 4 is already done, this task is complete.

- [ ] **Step 2: Confirm fallback when `updatedAt` is undefined**

Verify a deal without `updatedAt` (e.g., a fallback static deal from `src/data/deals.ts`) does not show the verified line — the `{deal.updatedAt && ...}` guard handles this.

- [ ] **Step 3: No extra commit needed** — already covered by Task 4.

---

## Verification Checklist

Before calling Week 1–2 complete:

- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] `npm run build` — builds successfully, no prerender errors
- [ ] Email popup: appears after 3 distinct deal visits, dismisses permanently, submits correctly
- [ ] Deal page: "Last verified" date shows, sticky mobile CTA visible on 390px viewport
- [ ] Homepage: new hero subheading and social proof text visible
- [ ] Deals catalog: empty state has orange "Remove all filters" button
- [ ] Report broken: clicking button → Notion `Reports` property increments

---

## Notes for Plan 2 (Weeks 3–4)

The following features are NOT in this plan — they will be in `2026-03-12-project-improvements-plan-2.md`:

- Onboarding flow (2-step widget → personalized DealsGrid)
- Deal card full redesign (value pill top-right, audience badge always visible, hover step reveal)
- Notion new fields: `tips`, `requirements` for deal page depth
- Weekly digest CTA on `/this-week`
- "Remind me" banner on saved deals
- Shareable URLs for Freebies Finder, Savings Calculator, Stack Builder
- 3–5 SEO blog articles
