# StudentPerks Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add SEO optimizations, UX/conversion features, retention mechanisms, and content pages to StudentPerks.

**Architecture:** Incremental additions to existing Next.js App Router pages. New client-side hooks for localStorage features (saved deals, claim counts). New API routes for search logging and push subscriptions. New programmatic SEO pages for seasonal content. All new Notion fields are optional with graceful fallbacks.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Notion API, localStorage, Service Worker, RSS XML

**Note on JSON-LD:** All JSON-LD structured data uses controlled/hardcoded content from `seo-content.ts`, not user input. This follows the existing pattern throughout the codebase (category pages, audience pages, deal pages).

---

## Batch 1 — SEO

### Task 1: Add FAQ Schema to Alternatives Pages

**Files:**
- Modify: `src/data/seo-content.ts:29-34` (AlternativeSEO type)
- Modify: `src/data/seo-content.ts` (each ALTERNATIVES_SEO entry — add faqs)
- Modify: `src/app/alternatives/[slug]/page.tsx`

**Step 1: Add `faqs` field to `AlternativeSEO` type**

In `src/data/seo-content.ts`, update the type:

```typescript
export type AlternativeSEO = {
  slug: string;
  name: string;
  category: Category;
  intro: string;
  faqs: FAQ[];
};
```

**Step 2: Add faqs to each ALTERNATIVES_SEO entry**

For each entry in `ALTERNATIVES_SEO` array, add 2-3 relevant FAQs. Example for `aws`:

```typescript
{
  slug: "aws",
  name: "AWS",
  category: "Cloud",
  intro: "...",
  faqs: [
    { question: "Can students get free AWS credits?", answer: "Yes, through AWS Educate and the GitHub Student Developer Pack, students can access free AWS credits and learning resources." },
    { question: "What are the best free alternatives to AWS for students?", answer: "Google Cloud, DigitalOcean, Railway, and Vercel all offer generous free tiers or student credits." },
  ],
},
```

Add 2-3 FAQs per alternative (all ~18 entries).

**Step 3: Add FAQ section and JSON-LD to alternatives page**

In `src/app/alternatives/[slug]/page.tsx`, add after the deal grid and before "Other alternatives":

```tsx
{/* FAQ — content from controlled seo-content.ts data, not user input */}
{alt.faqs.length > 0 && (
  <section className="mb-16">
    <h2 className="text-xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
    <div className="space-y-4">
      {alt.faqs.map((faq, i) => (
        <div key={i} className="card p-5">
          <h3 className="text-[15px] font-semibold text-zinc-200 mb-2">{faq.question}</h3>
          <p className="text-[14px] text-zinc-500 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>
  </section>
)}
```

Add FAQ JSON-LD (controlled data from seo-content.ts, same pattern as category/audience pages):

```tsx
const faqLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: alt.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}).replace(/</g, "\\u003c");
```

Add script tag alongside existing JSON-LD scripts (same safe pattern used in category/audience pages).

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds, alternatives pages rendered with FAQ sections.

**Step 5: Commit**

```bash
git add src/data/seo-content.ts src/app/alternatives/\[slug\]/page.tsx
git commit -m "feat: add FAQ schema to alternatives pages"
```

---

### Task 2: Add `updatedAt` to Deal Type and Notion Parsing

**Files:**
- Modify: `src/data/deals.ts:12-24` (Deal type)
- Modify: `src/lib/notion.ts:28-31,64-93` (NotionPage type, pageToDeal)
- Modify: `src/lib/notion.ts:9-21` (dealSchema)

**Step 1: Add `updatedAt` to Deal type**

In `src/data/deals.ts`:

```typescript
export type Deal = {
  slug: string;
  name: string;
  logo: string;
  category: Category;
  audiences: Audience[];
  tagline: string;
  description: string;
  value: string;
  steps: string[];
  url: string;
  featured: boolean;
  updatedAt?: string;
};
```

**Step 2: Update Notion parsing**

In `src/lib/notion.ts`, update `NotionPage` type to include `last_edited_time`:

```typescript
type NotionPage = {
  id: string;
  last_edited_time?: string;
  properties: Record<string, NotionProperty>;
};
```

Update `dealSchema` to include optional `updatedAt`:

```typescript
updatedAt: z.string().optional(),
```

Update `pageToDeal` to extract `last_edited_time`:

```typescript
const raw = {
  // ... existing fields ...
  updatedAt: page.last_edited_time,
};
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds. Deal type now includes updatedAt.

**Step 4: Commit**

```bash
git add src/data/deals.ts src/lib/notion.ts
git commit -m "feat: add updatedAt field to Deal from Notion last_edited_time"
```

---

### Task 3: Improve Sitemap with Real lastModified Dates

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Update sitemap to use deal.updatedAt**

In `src/app/sitemap.ts`, update dealUrls:

```typescript
const dealUrls: MetadataRoute.Sitemap = deals.map((deal) => ({
  url: `${baseUrl}/deals/${deal.slug}`,
  lastModified: deal.updatedAt ? new Date(deal.updatedAt) : new Date(),
  changeFrequency: "weekly",
  priority: 0.7,
}));
```

Blog URLs already use `post.date` — no change needed.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, sitemap.xml generated with real dates.

**Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: use real lastModified dates in sitemap from Notion"
```

---

### Task 4: Add RSS Feed for Blog

**Files:**
- Create: `src/app/blog/feed.xml/route.ts`
- Modify: `src/app/layout.tsx` (add RSS link)

**Step 1: Create RSS route handler**

Create `src/app/blog/feed.xml/route.ts`:

```typescript
import { getAllPosts } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev";

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>StudentPerks Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Free tools, credits, and pro plans for students, startups, and open source projects.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
```

**Step 2: Add RSS link to root layout**

In `src/app/layout.tsx`, add inside `<head>` after dns-prefetch links:

```tsx
<link rel="alternate" type="application/rss+xml" title="StudentPerks Blog" href="/blog/feed.xml" />
```

**Step 3: Verify**

Run: `npm run dev` then visit `http://localhost:3000/blog/feed.xml`
Expected: Valid RSS XML with all blog posts.

**Step 4: Commit**

```bash
git add src/app/blog/feed.xml/route.ts src/app/layout.tsx
git commit -m "feat: add RSS feed for blog"
```

---

## Batch 2 — UX/Conversion

### Task 5: Create `useSavedDeals` Hook

**Files:**
- Create: `src/hooks/useSavedDeals.ts`

**Step 1: Create the hook**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "saved-deals";

function getStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useSavedDeals() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSavedSlugs(getStored());
  }, []);

  const toggle = useCallback((slug: string) => {
    setSavedSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (slug: string) => savedSlugs.includes(slug),
    [savedSlugs]
  );

  return { savedSlugs, toggle, isSaved, count: savedSlugs.length };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useSavedDeals.ts
git commit -m "feat: add useSavedDeals hook (localStorage)"
```

---

### Task 6: Add Save Button to Deal Cards

**Files:**
- Create: `src/components/SaveButton.tsx`
- Modify: `src/components/DealCard.tsx`
- Modify: `src/components/DealsGrid.tsx`

**Step 1: Create SaveButton component**

```tsx
"use client";

import { useState } from "react";

export default function SaveButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnimating(true);
        onToggle();
        setTimeout(() => setAnimating(false), 300);
      }}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 ${
        saved
          ? "text-red-400 bg-red-500/10"
          : "text-zinc-600 hover:text-red-400 bg-white/[0.03] hover:bg-red-500/10"
      } ${animating ? "scale-125" : ""}`}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
```

**Step 2: Add props to DealCard**

In `src/components/DealCard.tsx`, add `isSaved` and `onSave` optional props, import SaveButton, and add it next to value pill:

```tsx
import SaveButton from "./SaveButton";

// Add to props interface:
isSaved?: boolean;
onSave?: (slug: string) => void;

// In the header flex div, replace the value-pill span with:
<div className="flex items-center gap-1.5">
  {onSave && (
    <SaveButton saved={isSaved} onToggle={() => onSave(deal.slug)} />
  )}
  <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md">
    {deal.value}
  </span>
</div>
```

**Step 3: Wire up in DealsGrid**

In `src/components/DealsGrid.tsx`:
- Import `useSavedDeals` hook
- Add `showSavedOnly` state
- Filter by saved slugs when active
- Add Saved filter button after FilterBar
- Pass `isSaved` and `onSave` to DealCard

**Step 4: Verify**

Run: `npm run dev`, click heart icons, verify localStorage persistence and Saved filter.

**Step 5: Commit**

```bash
git add src/hooks/useSavedDeals.ts src/components/SaveButton.tsx src/components/DealCard.tsx src/components/DealsGrid.tsx
git commit -m "feat: add save-for-later with heart icon and saved filter"
```

---

### Task 7: Add Deal Status Badges (Verified/Expired)

**Files:**
- Modify: `src/data/deals.ts` (Deal type)
- Modify: `src/lib/notion.ts` (parse Status field)
- Create: `src/components/DealStatusBadge.tsx`
- Modify: `src/components/DealCard.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Update Deal type**

In `src/data/deals.ts`, add to Deal type:

```typescript
status?: "verified" | "expired";
```

**Step 2: Update Notion parsing**

In `src/lib/notion.ts`, update dealSchema and pageToDeal to parse optional Status select field.

**Step 3: Create DealStatusBadge component**

Green "Verified" badge with checkmark icon, red "Expired" badge with warning icon.

**Step 4: Add badge to DealCard and deal detail page**

- Badge in card's category/audience badges area
- Expired banner at top of deal detail page
- Verified badge next to deal name

**Step 5: Verify build**

Run: `npm run build`

**Step 6: Commit**

```bash
git add src/data/deals.ts src/lib/notion.ts src/components/DealStatusBadge.tsx src/components/DealCard.tsx 'src/app/deals/[slug]/page.tsx'
git commit -m "feat: add deal verified/expired status badges"
```

---

### Task 8: Add Claim Counter

**Files:**
- Create: `src/hooks/useClaimCount.ts`
- Create: `src/components/ClaimCounter.tsx`
- Modify: `src/components/DealCTA.tsx`

**Step 1: Create useClaimCount hook**

Uses deterministic hash of slug for base count (50-499), stores increments in localStorage. One increment per slug per browser.

**Step 2: Create ClaimCounter component**

Displays "N people claimed this" text.

**Step 3: Update DealCTA**

Import hook, call `increment()` on click alongside existing analytics tracking. Render ClaimCounter below the CTA button.

**Step 4: Verify**

Run: `npm run dev`, click "Claim this perk", verify counter.

**Step 5: Commit**

```bash
git add src/hooks/useClaimCount.ts src/components/ClaimCounter.tsx src/components/DealCTA.tsx
git commit -m "feat: add claim counter with social proof"
```

---

## Batch 3 — Retention

### Task 9: Add Service Worker for PWA Offline + Push

**Files:**
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx` (register SW)

**Step 1: Create service worker**

`public/sw.js` with:
- PRECACHE for offline page, manifest, icons
- Navigation fetch → fallback to /offline on network failure
- Push event listener → show notification
- Notification click → open URL

**Step 2: Register SW in layout**

Add inline script before `</body>` that registers `/sw.js`.

**Step 3: Verify**

Run: `npm run dev`, check DevTools > Application > Service Workers.

**Step 4: Commit**

```bash
git add public/sw.js src/app/layout.tsx
git commit -m "feat: add service worker for PWA offline + push support"
```

---

### Task 10: Add Push Notification Subscribe Button

**Files:**
- Create: `src/components/PushNotification.tsx`
- Create: `src/app/api/push-subscribe/route.ts`
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Create push subscribe API route**

Accepts subscription JSON, logs it (placeholder for future storage).

**Step 2: Create PushNotification component**

Client component that:
- Checks browser support for Notification + serviceWorker
- Shows "Get deal alerts" button if permission is default
- On click: requests permission, subscribes via PushManager, sends to API
- Hides if already subscribed, denied, or unsupported

**Step 3: Add to deal detail page**

Place near share buttons.

**Step 4: Commit**

```bash
git add src/components/PushNotification.tsx src/app/api/push-subscribe/route.ts 'src/app/deals/[slug]/page.tsx'
git commit -m "feat: add push notification subscribe button"
```

---

### Task 11: Add Region Filter

**Files:**
- Modify: `src/data/deals.ts` (Deal type — add `regions?: string[]`)
- Modify: `src/lib/notion.ts` (parse Regions multi_select)
- Modify: `src/components/DealsGrid.tsx` (add region filter + timezone auto-detect)

**Step 1: Update Deal type and Notion parsing**

Add `regions?: string[]` to Deal type and parse from Notion Regions multi_select.

**Step 2: Add region filter to DealsGrid**

- Auto-detect region from timezone
- Add dropdown/button group: All, US, EU, UK, Asia
- Filter deals by region (deals without regions = Global, shown everywhere)

**Step 3: Verify build**

**Step 4: Commit**

```bash
git add src/data/deals.ts src/lib/notion.ts src/components/DealsGrid.tsx
git commit -m "feat: add region filter with timezone auto-detect"
```

---

### Task 12: Add Search Analytics Logging

**Files:**
- Create: `src/app/api/search-log/route.ts`
- Modify: `src/components/DealsGrid.tsx`

**Step 1: Create search log API route**

Accepts `{ query, resultsCount }`, logs to console (visible in Vercel logs).

**Step 2: Add search logging to DealsGrid**

useEffect that fires after debouncedSearch changes (min 2 chars), POSTs to `/api/search-log`. Fire-and-forget (`.catch(() => {})`).

**Step 3: Verify**

Run: `npm run dev`, search, check terminal for `[search]` log.

**Step 4: Commit**

```bash
git add src/app/api/search-log/route.ts src/components/DealsGrid.tsx
git commit -m "feat: add search analytics logging"
```

---

## Batch 4 — Content

### Task 13: Add Seasonal Landing Pages

**Files:**
- Modify: `src/data/seo-content.ts` (add SeasonalSEO type + SEASONAL_SEO array)
- Create: `src/app/seasonal/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`

**Step 1: Add SEASONAL_SEO to seo-content.ts**

SeasonalSEO type with: slug, title, metaDescription, heading, intro, categories (to filter deals), audiences (to filter deals), faqs.

3 entries: back-to-school-2026, black-friday-2026, new-year-2027.

**Step 2: Create seasonal page**

Same structure as category/audience pages: breadcrumb, header, deal grid (filtered by categories + audiences), FAQ section, JSON-LD (ItemList + FAQPage — all from controlled seo-content.ts data).

**Step 3: Add to sitemap**

Import SEASONAL_SEO, generate URLs with priority 0.8.

**Step 4: Verify build**

**Step 5: Commit**

```bash
git add src/data/seo-content.ts 'src/app/seasonal/[slug]/page.tsx' src/app/sitemap.ts
git commit -m "feat: add seasonal landing pages (back-to-school, black-friday, new-year)"
```

---

### Task 14: Add YouTube Embed Component

**Files:**
- Modify: `src/data/deals.ts` (Deal type — add `video?: string`)
- Modify: `src/lib/notion.ts` (parse Video URL field)
- Create: `src/components/YouTubeEmbed.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Update Deal type and Notion parsing**

Add `video?: string`, parse from Notion URL field "Video".

**Step 2: Create YouTubeEmbed component**

Lite-youtube approach:
- Extract video ID from URL
- Show thumbnail + play button initially (no iframe loaded)
- On click: replace with autoplay iframe (youtube-nocookie.com for privacy)

**Step 3: Add to deal detail page**

After steps section, before CTA. Only shown if `deal.video` exists.

**Step 4: Verify build**

**Step 5: Commit**

```bash
git add src/data/deals.ts src/lib/notion.ts src/components/YouTubeEmbed.tsx 'src/app/deals/[slug]/page.tsx'
git commit -m "feat: add YouTube embed component for deal video guides"
```

---

## Final Verification

### Task 15: Full Build and Verification

**Step 1: Run linter**

```bash
npm run lint
```

Fix any issues.

**Step 2: Run production build**

```bash
npm run build
```

Expected: All pages prerender successfully, no type errors.

**Step 3: Final commit if fixes needed**

**Step 4: Push**

```bash
git push
```
