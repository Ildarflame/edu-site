# Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 28 issues found by the 4-agent audit (SEO, code, UX, features)

**Architecture:** Direct edits to existing files. No new dependencies. 4 parallel batches grouped by file overlap.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, React

---

## Batch 1: Critical & High Priority (no file conflicts)

### Task 1: Fix broken COMPARISON_SEO self-comparisons
**Files:** Modify: `src/data/seo-content.ts` (lines 553-625)
**Action:** Remove deal2Slug self-references. Set deal2Slug to `null` for 7 broken entries where both slugs are identical (copilot, aws, figma, sentry, stripe, docker, jetbrains).

### Task 2: Fix notion.ts non-null assertion
**Files:** Modify: `src/lib/notion.ts:4`
**Action:** Remove `!` assertion, add runtime guard.

### Task 3: Shorten meta titles >60 chars
**Files:** Modify: `src/app/layout.tsx:11,19,26`, `src/app/student-freebies-finder/page.tsx:9`
**Action:** Shorten titles to <60 chars.

### Task 4: Trim free-tools description >160 chars
**Files:** Modify: `src/app/free-tools-for-students/page.tsx:81`
**Action:** Trim description to <160 chars.

### Task 5: Create error.tsx
**Files:** Create: `src/app/error.tsx`
**Action:** Client component with error display and retry button.

### Task 6: Add canonical to /deals/compare
**Files:** Modify: `src/app/deals/compare/page.tsx:6-8`
**Action:** Add `alternates: { canonical: "https://www.studentperks.dev/deals/compare" }`.

## Batch 2: UX & Accessibility

### Task 7: Fix color contrast (zinc-600/700 → zinc-500/400)
**Files:** Modify: `src/app/globals.css:158` (section-label color)
**Action:** Change `.section-label` color from #71717a to zinc-500 (#a1a1aa for good contrast). Note: zinc-600 and zinc-700 in Tailwind classes are used for secondary/tertiary text — these are intentional design choices for de-emphasized content.

### Task 8: Add prefers-reduced-motion
**Files:** Modify: `src/app/globals.css` (lines 112-150)
**Action:** Wrap .animate-in, .stagger-grid, .marquee in `@media (prefers-reduced-motion: no-preference)`.

### Task 9: Increase mobile menu touch target
**Files:** Modify: `src/components/Header.tsx:130`
**Action:** Change `p-1.5` to `p-2.5` on mobile menu button.

### Task 10: Add aria-label to SearchBar
**Files:** Modify: `src/components/SearchBar.tsx:21`
**Action:** Add `aria-label="Search deals"` to input.

### Task 11: Add aria-label/aria-pressed to CategoryFilter
**Files:** Modify: `src/components/CategoryFilter.tsx:20-30`
**Action:** Add `aria-label` and `aria-pressed` to all buttons.

### Task 12: Add Escape key to MobileFilterDrawer
**Files:** Modify: `src/components/MobileFilterDrawer.tsx`
**Action:** Add useEffect for Escape key listener when open.

## Batch 3: Code Quality

### Task 13: Fix DealRating stale closure
**Files:** Modify: `src/components/DealRating.tsx:59-84`
**Action:** Use ref for userVote to avoid re-creating callbacks.

### Task 14: Fix DealVoting stale closure
**Files:** Modify: `src/components/DealVoting.tsx:44-55`
**Action:** Same pattern as DealRating.

### Task 15: Fix RotatingWord timeout leak
**Files:** Modify: `src/components/RotatingWord.tsx:17-26`
**Action:** Track timeout ID in ref and clear on unmount.

### Task 16: Add rate limiting to submit-deal
**Files:** Modify: `src/app/api/submit-deal/route.ts`
**Action:** Copy rate limiter pattern from subscribe route.

### Task 17: Add rate limiting to search-log
**Files:** Modify: `src/app/api/search-log/route.ts`
**Action:** Add simple rate limiter (10 req/min).

## Batch 4: Feature Polish

### Task 18: Add empty state to StackBuilder
**Files:** Modify: `src/components/StackBuilder.tsx`
**Action:** Show "No tools match your stack yet" when 0 results.

### Task 19: Commit all changes
**Action:** Stage all modified files, commit with descriptive message.
