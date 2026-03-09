# Full Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve StudentPerks across security, performance, SEO, UX, and add new features (approaches B+C from design doc).

**Architecture:** Incremental improvements organized in 5 phases. Each phase is independent but ordered by priority: security first, then performance, SEO, UX, features. No new dependencies except `zod` and `@vercel/og`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, Zod (new), @vercel/og (new)

---

## Phase 1: Security & Stability

### Task 1: Add input validation to submit-deal API

**Files:**
- Modify: `src/app/api/submit-deal/route.ts`

**Step 1: Install zod**

```bash
npm install zod
```

**Step 2: Add validation schema and origin check**

Replace the entire file `src/app/api/submit-deal/route.ts` with:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ALLOWED_CATEGORIES = ["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"] as const;
const ALLOWED_AUDIENCES = ["Students", "Startups", "Open Source"] as const;

const submitSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url().max(500),
  category: z.enum(ALLOWED_CATEGORIES),
  audiences: z.array(z.enum(ALLOWED_AUDIENCES)).min(1),
  description: z.string().min(1).max(2000),
  email: z.string().email().max(254),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  // Origin check
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("studentperks.dev") && !origin.includes("localhost")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DEALS_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, url, category, audiences, description, email } = parsed.data;
  const slug = slugify(name);

  // Check for duplicate URL
  const checkRes = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "URL", url: { equals: url } },
        page_size: 1,
      }),
    }
  );

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    if (checkData.results?.length > 0) {
      return NextResponse.json({ error: "This deal already exists in our catalog" }, { status: 409 });
    }
  }

  const audienceMap: Record<string, string> = {
    Students: "Students",
    Startups: "Startups",
    "Open Source": "Opensource",
  };

  const notionAudiences = audiences.map((a) => ({
    name: audienceMap[a] || a,
  }));

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          URL: { url },
          Category: { select: { name: category } },
          Audiences: { multi_select: notionAudiences },
          Description: { rich_text: [{ text: { content: description } }] },
          Slug: { rich_text: [{ text: { content: slug } }] },
          Featured: { checkbox: false },
          Tagline: { rich_text: [{ text: { content: `Submitted by ${email}` } }] },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Notion API error:", errText);
      return NextResponse.json({ error: "Failed to submit deal" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit deal error:", err);
    return NextResponse.json({ error: "Failed to submit deal" }, { status: 500 });
  }
}
```

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/app/api/submit-deal/route.ts package.json package-lock.json
git commit -m "feat: add zod validation, origin check, and duplicate detection to submit-deal API"
```

---

### Task 2: Add origin check to subscribe API

**Files:**
- Modify: `src/app/api/subscribe/route.ts`

**Step 1: Add origin check after rate limit check**

After line 25 (after the rate limit return), add:

```typescript
  // Origin check
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("studentperks.dev") && !origin.includes("localhost")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
```

**Step 2: Commit**

```bash
git add src/app/api/subscribe/route.ts
git commit -m "feat: add origin validation to subscribe API"
```

---

### Task 3: Add Error Boundary component

**Files:**
- Create: `src/components/ErrorBoundary.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ErrorBoundary component**

Create `src/components/ErrorBoundary.tsx`:

```typescript
"use client";

import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Something went wrong</h2>
            <p className="text-[13px] text-zinc-500 mb-4">An unexpected error occurred.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn-primary px-5 py-2 text-[13px]"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 2: Wrap children in layout.tsx**

In `src/app/layout.tsx`, add import:

```typescript
import ErrorBoundary from "@/components/ErrorBoundary";
```

Change `<div className="flex-1">{children}</div>` to:

```tsx
<div className="flex-1">
  <ErrorBoundary>{children}</ErrorBoundary>
</div>
```

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ErrorBoundary.tsx src/app/layout.tsx
git commit -m "feat: add ErrorBoundary to catch client-side rendering errors"
```

---

### Task 4: Add Zod validation to Notion data fetching

**Files:**
- Modify: `src/lib/notion.ts`

**Step 1: Replace with Zod-validated version**

Replace the entire file `src/lib/notion.ts` with:

```typescript
import { z } from "zod";
import type { Deal, Category, Audience } from "@/data/deals";

const databaseId = process.env.NOTION_DEALS_DATABASE_ID!;

const CATEGORIES: Category[] = ["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"];
const AUDIENCES: Audience[] = ["students", "startups", "opensource"];

const dealSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  logo: z.string(),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  audiences: z.array(z.enum(AUDIENCES as [Audience, ...Audience[]])).min(1),
  tagline: z.string(),
  description: z.string(),
  value: z.string(),
  steps: z.array(z.string()),
  url: z.string(),
  featured: z.boolean(),
});

type NotionRichText = { plain_text: string }[];
type NotionPage = {
  id: string;
  properties: Record<string, any>;
};

function getRichText(prop: any): string {
  if (!prop?.rich_text) return "";
  return (prop.rich_text as NotionRichText).map((t) => t.plain_text).join("");
}

function getTitle(prop: any): string {
  if (!prop?.title) return "";
  return (prop.title as NotionRichText).map((t) => t.plain_text).join("");
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? "";
}

function getMultiSelect(prop: any): string[] {
  if (!prop?.multi_select) return [];
  return prop.multi_select.map((s: any) => s.name);
}

function getCheckbox(prop: any): boolean {
  return prop?.checkbox ?? false;
}

function getUrl(prop: any): string {
  return prop?.url ?? "";
}

function pageToSlug(page: NotionPage): string {
  return getRichText(page.properties["Slug"]) || page.id;
}

function pageToDeal(page: NotionPage): Deal | null {
  const p = page.properties;
  const stepsRaw = getRichText(p["Steps"]);
  const steps = stepsRaw
    ? stepsRaw.split("\n").filter((s) => s.trim())
    : [];

  const raw = {
    slug: pageToSlug(page),
    name: getTitle(p["Name"]),
    logo: getRichText(p["Logo"]) || `/logos/${pageToSlug(page)}.svg`,
    category: (getSelect(p["Category"]) || "Dev") as Category,
    audiences: getMultiSelect(p["Audiences"]).map(
      (a) => a.toLowerCase().replace(" ", "") as Audience
    ),
    tagline: getRichText(p["Tagline"]),
    description: getRichText(p["Description"]),
    value: getRichText(p["Value"]),
    steps,
    url: getUrl(p["URL"]),
    featured: getCheckbox(p["Featured"]),
  };

  const result = dealSchema.safeParse(raw);
  if (!result.success) {
    console.warn(`Invalid deal "${raw.name || raw.slug}":`, result.error.issues);
    return null;
  }
  return result.data;
}

export async function fetchDealsFromNotion(): Promise<Deal[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, any> = {
      sorts: [{ property: "Name", direction: "ascending" }],
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`Notion API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    pages.push(...(data.results as NotionPage[]));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages.map(pageToDeal).filter((d): d is Deal => d !== null);
}

export function isNotionConfigured(): boolean {
  return !!(process.env.NOTION_TOKEN && process.env.NOTION_DEALS_DATABASE_ID);
}
```

Key changes: removed unused `@notionhq/client` import, added Zod schema, `pageToDeal` returns null for invalid entries.

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/lib/notion.ts
git commit -m "feat: add Zod validation to Notion data, remove unused SDK import"
```

---

### Task 5: Add caching to getDeals()

**Files:**
- Modify: `src/lib/deals.ts`

**Step 1: Add React cache and unstable_cache**

Replace `src/lib/deals.ts` with:

```typescript
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { deals as hardcodedDeals, type Deal, type Category, type Audience } from "@/data/deals";
import { fetchDealsFromNotion, isNotionConfigured } from "./notion";

async function fetchDeals(): Promise<Deal[]> {
  if (isNotionConfigured()) {
    try {
      const notionDeals = await fetchDealsFromNotion();
      if (notionDeals.length > 0) return notionDeals;
    } catch (e) {
      console.error("Failed to fetch from Notion, using fallback:", e);
    }
  }
  return hardcodedDeals;
}

const getCachedDeals = unstable_cache(fetchDeals, ["deals"], {
  revalidate: 300,
  tags: ["deals"],
});

export const getDeals = cache(getCachedDeals);

export async function getDealBySlug(slug: string): Promise<Deal | undefined> {
  const deals = await getDeals();
  return deals.find((d) => d.slug === slug);
}

export async function getDealsByCategory(category: Category): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.category === category);
}

export async function getDealsByAudience(audience: Audience): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.audiences.includes(audience));
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.featured);
}

export type { Deal, Category, Audience };
export { CATEGORY_CONFIG, AUDIENCE_LABELS } from "@/data/deals";
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/lib/deals.ts
git commit -m "feat: add React cache + unstable_cache for deals deduplication"
```

---

### Task 6: Add revalidation webhook

**Files:**
- Create: `src/app/api/revalidate/route.ts`

**Step 1: Create the webhook route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.REVALIDATION_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("deals");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/app/api/revalidate/route.ts
git commit -m "feat: add /api/revalidate webhook for on-demand cache invalidation"
```

---

## Phase 2: Performance & DealsGrid Refactor

### Task 7: Create useDebounce hook

**Files:**
- Create: `src/lib/hooks.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

**Step 2: Commit**

```bash
git add src/lib/hooks.ts
git commit -m "feat: add useDebounce hook"
```

---

### Task 8: Extract FilterBar component

**Files:**
- Create: `src/components/FilterBar.tsx`

**Step 1: Create FilterBar**

Create `src/components/FilterBar.tsx`:

```typescript
"use client";

import { memo } from "react";
import { Deal, Category, Audience } from "@/data/deals";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

export type ValueFilter = "all" | "free" | "credits" | "discount" | "pro";
export type SortOption = "newest" | "value" | "az";

const audienceOptions: { value: Audience | null; label: string }[] = [
  { value: null, label: "Everyone" },
  { value: "students", label: "Students" },
  { value: "startups", label: "Startups" },
  { value: "opensource", label: "Open Source" },
];

const valueFilterOptions: { value: ValueFilter; label: string }[] = [
  { value: "all", label: "Any value" },
  { value: "free", label: "Free" },
  { value: "credits", label: "Credits" },
  { value: "discount", label: "Discount" },
  { value: "pro", label: "Pro Plan" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "value", label: "Most valuable" },
  { value: "az", label: "A-Z" },
];

const base = "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border";
const active = "bg-orange-500/10 text-orange-400 border-orange-500/20";
const inactive = "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400 hover:border-white/[0.1]";

type Props = {
  search: string;
  category: Category | null;
  audience: Audience | null;
  valueFilter: ValueFilter;
  sort: SortOption;
  totalCount: number;
  startItem: number;
  endItem: number;
  hasActiveFilters: boolean;
  filteredDeals: Deal[];
  onSearch: (v: string) => void;
  onCategory: (v: Category | null) => void;
  onAudience: (v: Audience | null) => void;
  onValueFilter: (v: ValueFilter) => void;
  onSort: (v: SortOption) => void;
  onClearAll: () => void;
};

function exportCSV(deals: Deal[]) {
  const header = "Name,Category,Value,URL\n";
  const rows = deals.map((d) =>
    `"${d.name.replace(/"/g, '""')}","${d.category}","${d.value.replace(/"/g, '""')}","${d.url}"`
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studentperks-deals.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default memo(function FilterBar({
  search, category, audience, valueFilter, sort,
  totalCount, startItem, endItem, hasActiveFilters, filteredDeals,
  onSearch, onCategory, onAudience, onValueFilter, onSort, onClearAll,
}: Props) {
  return (
    <>
      <div className="space-y-3 mb-8">
        <SearchBar value={search} onChange={onSearch} />
        <CategoryFilter selected={category} onChange={onCategory} />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by audience">
          {audienceOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onAudience(opt.value)}
              className={`${base} ${audience === opt.value ? active : inactive}`}
              aria-pressed={audience === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by value type">
          {valueFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onValueFilter(opt.value)}
              className={`${base} ${valueFilter === opt.value ? active : inactive}`}
              aria-pressed={valueFilter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-[12px] text-zinc-500 hover:text-orange-400 transition-colors underline underline-offset-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-zinc-700 font-medium">
          {totalCount === 0
            ? "0 deals"
            : `Showing ${startItem}-${endItem} of ${totalCount} deal${totalCount !== 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(filteredDeals)}
            className="text-[12px] text-zinc-600 hover:text-orange-400 transition-colors font-medium flex items-center gap-1"
            aria-label="Export filtered deals as CSV"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortOption)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[12px] text-zinc-400 font-medium focus:outline-none focus:border-orange-500/30"
            aria-label="Sort deals"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
});
```

**Step 2: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "feat: extract FilterBar component with CSV export and aria attributes"
```

---

### Task 9: Extract PaginationControls component

**Files:**
- Create: `src/components/PaginationControls.tsx`

**Step 1: Create PaginationControls**

```typescript
"use client";

import { memo, useMemo } from "react";

const pageBtn = "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all duration-150";
const pageBtnActive = "bg-orange-500/10 text-orange-400 border-orange-500/20";
const pageBtnInactive = "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.1]";
const pageBtnDisabled = "bg-white/[0.01] text-zinc-800 border-white/[0.03] cursor-not-allowed";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default memo(function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Page navigation">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className={`${pageBtn} ${currentPage <= 1 ? pageBtnDisabled : pageBtnInactive}`}
        aria-label="Previous page"
      >
        Previous
      </button>
      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-zinc-700 text-[12px]">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${pageBtn} ${p === currentPage ? pageBtnActive : pageBtnInactive}`}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className={`${pageBtn} ${currentPage >= totalPages ? pageBtnDisabled : pageBtnInactive}`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
});
```

**Step 2: Commit**

```bash
git add src/components/PaginationControls.tsx
git commit -m "feat: extract PaginationControls with aria attributes and useMemo"
```

---

### Task 10: Refactor DealsGrid to use extracted components + debounce

**Files:**
- Modify: `src/components/DealsGrid.tsx`

**Step 1: Rewrite DealsGrid as orchestrator**

Replace the entire file with:

```typescript
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Deal, Category, Audience } from "@/data/deals";
import { useDebounce } from "@/lib/hooks";
import DealCard from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";
import FilterBar, { ValueFilter, SortOption } from "./FilterBar";
import PaginationControls from "./PaginationControls";
import CompareBar from "./CompareBar";

const DEALS_PER_PAGE = 12;

function matchesValueFilter(deal: Deal, filter: ValueFilter): boolean {
  if (filter === "all") return true;
  const v = deal.value.toLowerCase();
  switch (filter) {
    case "free": return v.includes("free");
    case "credits": return v.includes("credit");
    case "discount": return v.includes("discount") || v.includes("saving") || v.includes("off");
    case "pro": return v.includes("plan") || v.includes("/year") || v.includes("/month");
    default: return true;
  }
}

function parseDollarValue(v: string): number {
  const cleaned = v.replace(/,/g, "");
  const match = cleaned.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  if (match) return parseFloat(match[1]);
  return 0;
}

export default function DealsGrid({
  deals,
  initialCategory,
  initialAudience,
  isLoading = false,
}: {
  deals: Deal[];
  initialCategory?: Category;
  initialAudience?: Audience;
  isLoading?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState<Category | null>(
    (searchParams.get("category") as Category) || initialCategory || null
  );
  const [audience, setAudience] = useState<Audience | null>(
    (searchParams.get("audience") as Audience) || initialAudience || null
  );
  const [valueFilter, setValueFilter] = useState<ValueFilter>(
    (searchParams.get("value") as ValueFilter) || "all"
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return p > 0 ? p : 1;
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const hasActiveFilters = !!(debouncedSearch || category || audience || valueFilter !== "all");

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setCategory(null);
    setAudience(null);
    setValueFilter("all");
    setPage(1);
  }, []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (valueFilter !== "all") params.set("value", valueFilter);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/deals${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, category, audience, valueFilter, sort, page, router]);

  useEffect(() => { syncUrl(); }, [syncUrl]);

  const resetPage = useCallback(() => setPage(1), []);
  const handleSearch = useCallback((v: string) => { setSearch(v); resetPage(); }, [resetPage]);
  const handleCategory = useCallback((v: Category | null) => { setCategory(v); resetPage(); }, [resetPage]);
  const handleAudience = useCallback((v: Audience | null) => { setAudience(v); resetPage(); }, [resetPage]);
  const handleValueFilter = useCallback((v: ValueFilter) => { setValueFilter(v); resetPage(); }, [resetPage]);
  const handleSort = useCallback((v: SortOption) => { setSort(v); resetPage(); }, [resetPage]);

  const toggleCompare = useCallback((slug: string) => {
    setCompareIds((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 3 ? [...prev, slug] : prev
    );
  }, []);

  const filtered = useMemo(() => {
    let result = deals.filter((deal) => {
      if (category && deal.category !== category) return false;
      if (audience && !deal.audiences.includes(audience)) return false;
      if (!matchesValueFilter(deal, valueFilter)) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !deal.name.toLowerCase().includes(q) &&
          !deal.tagline.toLowerCase().includes(q) &&
          !deal.description.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });

    switch (sort) {
      case "az":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "value":
        result = [...result].sort((a, b) => parseDollarValue(b.value) - parseDollarValue(a.value));
        break;
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [deals, category, audience, valueFilter, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEALS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedDeals = filtered.slice((safePage - 1) * DEALS_PER_PAGE, safePage * DEALS_PER_PAGE);
  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * DEALS_PER_PAGE + 1;
  const endItem = Math.min(safePage * DEALS_PER_PAGE, filtered.length);
  const compareDeals = deals.filter((d) => compareIds.includes(d.slug));

  return (
    <div>
      <FilterBar
        search={search}
        category={category}
        audience={audience}
        valueFilter={valueFilter}
        sort={sort}
        totalCount={filtered.length}
        startItem={startItem}
        endItem={endItem}
        hasActiveFilters={hasActiveFilters}
        filteredDeals={filtered}
        onSearch={handleSearch}
        onCategory={handleCategory}
        onAudience={handleAudience}
        onValueFilter={handleValueFilter}
        onSort={handleSort}
        onClearAll={clearAllFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: DEALS_PER_PAGE }).map((_, i) => (
            <DealCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
            {paginatedDeals.map((deal) => (
              <DealCard
                key={deal.slug}
                deal={deal}
                compareMode
                isComparing={compareIds.includes(deal.slug)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
          <PaginationControls currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {compareIds.length > 0 && (
        <CompareBar deals={compareDeals} onRemove={toggleCompare} onClear={() => setCompareIds([])} />
      )}
    </div>
  );
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 3: Commit**

```bash
git add src/components/DealsGrid.tsx
git commit -m "refactor: DealsGrid uses FilterBar, PaginationControls, debounced search"
```

---

### Task 11: Add lazy loading to DealCard images

**Files:**
- Modify: `src/components/DealCard.tsx`

**Step 1: Add loading="lazy" to Image**

Find the `<Image>` tag in `DealCard.tsx` and add the `loading` prop:

```tsx
<Image src={deal.logo} alt={deal.name} width={28} height={28} loading={featured ? undefined : "lazy"} />
```

(If `featured` is true, skip lazy loading so hero images load eagerly.)

**Step 2: Commit**

```bash
git add src/components/DealCard.tsx
git commit -m "perf: add lazy loading to DealCard images"
```

---

## Phase 3: SEO & Accessibility

### Task 12: Add skip-link and main landmark

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Add skip-link as first child of `<header>` in Header.tsx**

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-[13px] focus:font-medium"
>
  Skip to main content
</a>
```

**Step 2: Add id="main-content" to layout.tsx**

Change `<div className="flex-1">` to `<div className="flex-1" id="main-content">`.

**Step 3: Commit**

```bash
git add src/components/Header.tsx src/app/layout.tsx
git commit -m "a11y: add skip-link and main-content landmark"
```

---

### Task 13: Add dynamic OG images

**Files:**
- Create: `src/app/api/og/route.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Install @vercel/og**

```bash
npm install @vercel/og
```

**Step 2: Create OG image route**

Create `src/app/api/og/route.tsx`:

```tsx
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getDealBySlug } from "@/lib/deals";
import { CATEGORY_CONFIG } from "@/data/deals";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", color: "#fff", fontSize: 48, fontWeight: 700 }}>
          StudentPerks
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const deal = await getDealBySlug(slug);
  if (!deal) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", color: "#fff", fontSize: 48, fontWeight: 700 }}>
          Deal Not Found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const config = CATEGORY_CONFIG[deal.category];

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 40 }}>{config.icon}</span>
          <span style={{ fontSize: 20, color: "#a1a1aa", fontWeight: 500 }}>{deal.category}</span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#fafafa", lineHeight: 1.1, marginBottom: 20 }}>
          {deal.name}
        </div>
        <div style={{ fontSize: 28, color: "#71717a", marginBottom: 32 }}>
          {deal.tagline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 12, padding: "8px 20px", fontSize: 24, fontWeight: 700, color: "#34d399" }}>
            {deal.value}
          </div>
          <span style={{ fontSize: 18, color: "#52525b" }}>studentperks.dev</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Step 3: Add OG image to deal page metadata**

In `src/app/deals/[slug]/page.tsx` `generateMetadata`, add to the return object (after `alternates`):

```typescript
    openGraph: {
      title,
      description,
      images: [{ url: `/api/og?slug=${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?slug=${slug}`],
    },
```

**Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 5: Commit**

```bash
git add src/app/api/og/route.tsx src/app/deals/[slug]/page.tsx package.json package-lock.json
git commit -m "feat: add dynamic OG images for deal pages"
```

---

### Task 14: Add FAQPage JSON-LD to SEO pages

**Files:**
- Modify: `src/app/category/[slug]/page.tsx`
- Modify: `src/app/for/[audience]/page.tsx`

**Step 1: In both files, add FAQPage structured data before closing `</main>`**

The `seo` variable (for category pages) or equivalent already has `faqs` array from `seo-content.ts`. Add:

```tsx
{seo.faqs.length > 0 && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((faq: { question: string; answer: string }) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }).replace(/</g, "\\u003c"),
    }}
  />
)}
```

**Step 2: Commit**

```bash
git add src/app/category/[slug]/page.tsx src/app/for/[audience]/page.tsx
git commit -m "seo: add FAQPage JSON-LD to category and audience pages"
```

---

## Phase 4: UX Improvements

### Task 15: Add MobileFilterDrawer

**Files:**
- Create: `src/components/MobileFilterDrawer.tsx`
- Modify: `src/components/FilterBar.tsx`

**Step 1: Create MobileFilterDrawer**

Create `src/components/MobileFilterDrawer.tsx`:

```typescript
"use client";

import { useState, ReactNode } from "react";

type Props = {
  activeCount: number;
  children: ReactNode;
};

export default function MobileFilterDrawer({ activeCount, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/[0.06] rounded-t-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-zinc-100">Filters</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200 transition-colors" aria-label="Close filters">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
            <button onClick={() => setOpen(false)} className="btn-primary w-full py-2.5 text-[13px] mt-4">
              Show results
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:block">{children}</div>
    </>
  );
}
```

**Step 2: Integrate into FilterBar**

In `src/components/FilterBar.tsx`:

1. Import: `import MobileFilterDrawer from "./MobileFilterDrawer";`
2. Wrap the `<div className="space-y-3 mb-8">` block inside `<MobileFilterDrawer>`:

```tsx
<MobileFilterDrawer activeCount={[category, audience, valueFilter !== "all" ? valueFilter : null, search || null].filter(Boolean).length}>
  <div className="space-y-3 mb-8 md:mb-0">
    {/* ...existing filter content... */}
  </div>
</MobileFilterDrawer>
```

**Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/MobileFilterDrawer.tsx src/components/FilterBar.tsx
git commit -m "feat: add collapsible mobile filter drawer"
```

---

### Task 16: Add difference highlighting to CompareView

**Files:**
- Modify: `src/app/deals/compare/CompareView.tsx`

**Step 1: Add difference detection and highlighting**

Add helper before `rows`:

```typescript
function valuesAreDifferent(deals: Deal[], getter: (d: Deal) => string): boolean {
  const values = deals.map(getter);
  return new Set(values).size > 1;
}
```

Update `rows` type to include `isDifferent`:

```typescript
const rows: { label: string; render: (deal: Deal) => React.ReactNode; isDifferent?: (deals: Deal[]) => boolean }[] = [
```

Add `isDifferent` to Category, Value, and Audiences rows:

```typescript
// Category row
isDifferent: (ds) => valuesAreDifferent(ds, (d) => d.category),
// Value row
isDifferent: (ds) => valuesAreDifferent(ds, (d) => d.value),
// Audiences row
isDifferent: (ds) => valuesAreDifferent(ds, (d) => d.audiences.sort().join(",")),
```

In the table body `<td>`, add conditional background:

```tsx
<td
  key={deal.slug}
  className={`text-center py-4 px-4 align-middle ${row.isDifferent?.(deals) ? "bg-orange-500/[0.03]" : ""}`}
>
```

**Step 2: Commit**

```bash
git add src/app/deals/compare/CompareView.tsx
git commit -m "feat: highlight differing fields in deal comparison"
```

---

## Phase 5: New Features

### Task 17: Add deal click tracking

**Files:**
- Create: `src/components/DealCTA.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Create DealCTA client component**

Create `src/components/DealCTA.tsx`:

```typescript
"use client";

import { track } from "@vercel/analytics";

type Props = {
  url: string;
  slug: string;
  category: string;
  audiences: string[];
};

export default function DealCTA({ url, slug, category, audiences }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("deal_click", { slug, category, audience: audiences.join(",") })}
      className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-[14px]"
    >
      Claim this perk
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </a>
  );
}
```

**Step 2: Replace CTA in deal page**

In `src/app/deals/[slug]/page.tsx`:
- Import: `import DealCTA from "@/components/DealCTA";`
- Replace the `<a href={deal.url} ...>Claim this perk</a>` block (lines 100-110) with:

```tsx
<DealCTA url={deal.url} slug={deal.slug} category={deal.category} audiences={deal.audiences} />
```

**Step 3: Commit**

```bash
git add src/components/DealCTA.tsx src/app/deals/[slug]/page.tsx
git commit -m "feat: add Vercel Analytics click tracking on deal CTA"
```

---

### Task 18: Add category checkboxes to newsletter

**Files:**
- Modify: `src/components/NewsletterForm.tsx`
- Modify: `src/app/api/subscribe/route.ts`

**Step 1: Add categories to NewsletterForm**

After `FREQUENCIES` constant, add:

```typescript
const CATEGORIES = [
  { id: "Dev", label: "Dev Tools" },
  { id: "AI", label: "AI" },
  { id: "Cloud", label: "Cloud" },
  { id: "SaaS", label: "SaaS" },
  { id: "Learning", label: "Learning" },
  { id: "Design", label: "Design" },
] as const;
```

Add state: `const [categories, setCategories] = useState<string[]>([]);`

Add toggle: `const toggleCategory = (id: string) => { setCategories((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])); };`

Add UI after interests section (inside `{!compact && ...}`):

```tsx
<div className="flex items-center gap-3 flex-wrap">
  <span className="text-[12px] text-zinc-500 font-medium">Categories:</span>
  <div className="flex gap-1.5 flex-wrap">
    {CATEGORIES.map((cat) => (
      <button
        key={cat.id}
        type="button"
        onClick={() => toggleCategory(cat.id)}
        className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
          categories.includes(cat.id)
            ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
            : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
</div>
```

Update fetch body: `JSON.stringify({ email, frequency, interests, categories })`

**Step 2: Update subscribe API**

In `src/app/api/subscribe/route.ts`, update body type to include `categories?: string[]` and add to Notion properties:

```typescript
...(body.categories && body.categories.length > 0
  ? { Categories: { multi_select: body.categories.map((c) => ({ name: c })) } }
  : {}),
```

**Step 3: Commit**

```bash
git add src/components/NewsletterForm.tsx src/app/api/subscribe/route.ts
git commit -m "feat: add category subscription to newsletter signup"
```

---

### Task 19: Add "Recommended for you" to homepage

**Files:**
- Create: `src/components/RecommendedDeals.tsx`
- Create: `src/components/CategoryTracker.tsx`
- Modify: `src/app/deals/[slug]/page.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create RecommendedDeals**

Create `src/components/RecommendedDeals.tsx`:

```typescript
"use client";

import { useMemo, useEffect, useState } from "react";
import DealCard from "./DealCard";
import type { Deal, Category } from "@/data/deals";

function getPrefs(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = document.cookie.split(";").find((c) => c.trim().startsWith("sp_prefs="));
    if (!raw) return [];
    return JSON.parse(decodeURIComponent(raw.split("=")[1])) as Category[];
  } catch {
    return [];
  }
}

export function trackCategory(category: Category) {
  if (typeof window === "undefined") return;
  const prefs = getPrefs();
  const updated = [category, ...prefs.filter((c) => c !== category)].slice(0, 5);
  document.cookie = `sp_prefs=${encodeURIComponent(JSON.stringify(updated))};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Strict`;
}

export default function RecommendedDeals({ deals }: { deals: Deal[] }) {
  const [prefs, setPrefs] = useState<Category[]>([]);

  useEffect(() => { setPrefs(getPrefs()); }, []);

  const recommended = useMemo(() => {
    if (prefs.length === 0) return [];
    return deals.filter((d) => prefs.includes(d.category)).slice(0, 4);
  }, [deals, prefs]);

  if (recommended.length < 2) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="section-label mb-2">For you</p>
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-8">Recommended Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
        {recommended.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Create CategoryTracker**

Create `src/components/CategoryTracker.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { trackCategory } from "./RecommendedDeals";
import type { Category } from "@/data/deals";

export default function CategoryTracker({ category }: { category: Category }) {
  useEffect(() => { trackCategory(category); }, [category]);
  return null;
}
```

**Step 3: Add CategoryTracker to deal detail page**

In `src/app/deals/[slug]/page.tsx`:
- Import: `import CategoryTracker from "@/components/CategoryTracker";`
- Add `<CategoryTracker category={deal.category} />` right after `<main>` opening tag.

**Step 4: Add RecommendedDeals to homepage**

In `src/app/page.tsx`:
- Import: `import RecommendedDeals from "@/components/RecommendedDeals";`
- Add `<RecommendedDeals deals={deals} />` after the featured section's `</ScrollReveal>` and before the audiences divider.

**Step 5: Commit**

```bash
git add src/components/RecommendedDeals.tsx src/components/CategoryTracker.tsx src/app/deals/[slug]/page.tsx src/app/page.tsx
git commit -m "feat: add cookie-based deal recommendations on homepage"
```

---

### Task 20: Final build verification

**Step 1: Run lint**

```bash
npm run lint
```

**Step 2: Run full build**

```bash
npm run build
```

**Step 3: Fix any issues, then commit**

```bash
git add -A
git commit -m "fix: address lint and build issues from improvements"
```
