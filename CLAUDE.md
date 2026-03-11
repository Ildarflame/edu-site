# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js 16 with Turbopack)
- `npm run build` — production build (SSG, 515+ pages prerendered)
- `npm run lint` — ESLint
- `npm start` — serve production build
- `node scripts/<name>.mjs` — run Notion bulk scripts (no dotenv; scripts read `.env.local` manually via `fs.readFileSync`)

## Architecture

**StudentPerks** (www.studentperks.dev) — a Next.js 16 directory of free perks/deals for students, startups, and open source projects. 150+ verified deals worth $500K+.

**Stack:** Next.js 16 (App Router, SSG/ISR), Tailwind CSS v4, TypeScript, MDX (next-mdx-remote/rsc), Notion CMS, Vercel Analytics, Outfit font (Google Fonts)

### Data flow

- **Deals** live in Notion database (ID: `31bed78d40648049a78ef531b5ee456e`). Fetched via `src/lib/notion.ts` using **direct `fetch`** to Notion REST API (the `@notionhq/client` SDK `Client` is imported but not used for querying — only raw fetch). Fallback to hardcoded data in `src/data/deals.ts` if Notion is unavailable (`src/lib/deals.ts` handles the fallback).
- **SEO content** defined in `src/data/seo-content.ts` — exports `CATEGORY_SEO`, `AUDIENCE_SEO`, `ALTERNATIVES_SEO`, `COMPARISON_SEO`, `USE_CASE_SEO`, `GUIDE_SEO`, `SEASONAL_SEO`, `TAG_SEO`, `VS_SEO` arrays that drive programmatic SEO pages and sitemap generation.
- **Universities** defined in `src/data/universities.ts` — 50 universities (US/EU/UK/Asia) drive `/university/[slug]` pages.
- **Notion properties:** Name (title), Slug (rich_text), Logo (rich_text), Category (select: Dev/AI/SaaS/Learning/Cloud/Design/Entertainment), Audiences (multi_select: Students/Startups/Opensource — **capitalized in Notion, lowercase in code**), Tagline, Description, Value, Steps (newline-separated), URL, Featured (checkbox), Status (select: verified/expired), Regions (multi_select: US/EU/UK/Asia), Video (url)
- **Blog posts** are MDX files in `src/content/blog/` with frontmatter (title, date, description, tags). Loaded via `src/lib/blog.ts`.
- **Logos:** SVG files in `public/logos/`, sourced from Iconify API. Referenced by slug in Notion `Logo` field. Default path: `/logos/{slug}.svg`.
- ISR with `revalidate: 300` (5 min) for deal pages.

### Key types

Defined in `src/data/deals.ts`:
- `Category`: `"Dev" | "AI" | "SaaS" | "Learning" | "Cloud" | "Design" | "Entertainment"`
- `Audience`: `"students" | "startups" | "opensource"` (lowercase)
- `Deal`: `{ slug, name, logo, category, audiences, tagline, description, value, steps, url, featured, updatedAt?, status?, regions?, video? }`
- `CATEGORY_CONFIG`: maps Category to `{ color, gradient, icon }`

SEO types in `src/data/seo-content.ts`:
- `GuideSEO`: `{ slug, dealSlug, title, metaDescription, heading, intro, eligibility, faqs }` — 27 entries
- `SeasonalSEO`: `{ slug, title, metaDescription, heading, intro, categories, audiences, faqs }` — 3 entries
- `AlternativeSEO` — 16 entries, `ComparisonSEO` — 10 entries, `UseCaseSEO` — 10 entries, `TagSEO` — 9 entries
- `VsSEO`: `{ slug, tool1, tool2, tool1Slug, tool2Slug, title, metaDescription, intro, forStudents, winner, rows }` — 10 entries

### Key patterns

- **Next.js 16 async params:** Dynamic pages receive `params` as `Promise<{ slug: string }>` — must `await params`.
- **Client/Server split:** Filtering, search, sorting, comparison are client-side in `DealsGrid.tsx` (`"use client"`). Pages and layout are server components.
- **localStorage state:** Use `useSyncExternalStore` (not useState + useEffect) for hydration-safe localStorage. See `useSavedDeals.ts` and `useClaimCount.ts` for the pattern with cached snapshots.
- **JSON-LD:** All pages render structured data (FAQPage, HowTo, ItemList, BreadcrumbList, Product, etc). Content is from controlled Notion CMS data, not user input. Always escape with `.replace(/</g, "\\u003c")`.
- **URL params:** Filters sync to URL: `?q=`, `?category=`, `?audience=`, `?value=`, `?sort=`, `?page=`
- **Pagination:** `DEALS_PER_PAGE = 12` in `DealsGrid.tsx`.
- **Path alias:** `@/*` maps to `./src/*`.

### CSS utility classes (globals.css)

Custom classes used throughout — not Tailwind utilities:
- `.card` — dark glass card with hover lift effect
- `.card-accent-{color}` — colored top border on hover (blue/purple/pink/amber/sky/emerald/red)
- `.btn-primary` — orange gradient CTA button
- `.btn-ghost` — subtle bordered button
- `.text-gradient-warm` — animated orange shimmer gradient text
- `.value-pill` — green glow pill for deal values
- `.mesh-gradient`, `.dot-grid` — hero background effects
- `.section-label` — uppercase 11px tracking label
- `.animate-in`, `.delay-{1-4}`, `.stagger-grid` — fade-up entrance animations
- `.prose-dark` — dark theme for MDX blog content

### Routes

Core pages:
- `/` — home (hero, featured deals, audiences, categories, newsletter, stats)
- `/deals` — catalog with filters, search, sort, pagination, compare mode, saved deals, region filter
- `/deals/[slug]` — deal detail with ratings, sharing, video embed, status badge, JSON-LD
- `/deals/compare` — side-by-side deal comparison (up to 3)

Interactive tools:
- `/student-freebies-finder` — 3-step wizard (country/university/major -> personalized results with scoring)
- `/free-tools-for-students` — viral landing page "100+ Free Tools" grouped by use-case
- `/savings-calculator` — student savings calculator wizard
- `/this-week` — new & updated deals this week
- `/discover` — AI Deal Finder (keyword matching)
- `/stack` — Stack Builder (select tech -> get relevant deals)

Content:
- `/blog` — blog list
- `/blog/[slug]` — blog post (MDX)
- `/blog/feed.xml` — RSS feed

Static pages:
- `/about` — about page with stats
- `/submit` — submit a deal form -> Notion API
- `/offline` — PWA offline fallback

#### Programmatic SEO pages (driven by `src/data/seo-content.ts`)

- `/student-discount` — index: all student deals grouped by category
- `/student-discount/[tool]` — per-deal student discount page with FAQ, HowTo JSON-LD (~126 pages)
- `/guides/[slug]` — step-by-step claim guides (27 entries)
- `/category/[slug]` — category landing (e.g. `/category/dev`, `/category/ai`)
- `/for/[audience]` — audience landing (e.g. `/for/students`, `/for/startups`)
- `/for/[audience]/[category]` — cross-filter (e.g. `/for/students/cloud`)
- `/top/[category]` — top deals by category
- `/alternatives/[slug]` — free alternatives pages with FAQ
- `/compare/[slug]` — tool comparisons
- `/best/[slug]` — use-case curated lists
- `/seasonal/[slug]` — seasonal landing pages (back-to-school, black-friday, new-year)
- `/tag/[slug]` — topic tag pages
- `/vs/[slug]` — student-focused tool VS comparisons with feature tables (10 entries)
- `/university/[slug]` — university-specific deal pages (50 universities)

### Header navigation

Desktop: `Deals | Student Discounts | Tools (dropdown) | Blog | Submit | [Get Deals]`
- Tools dropdown: Freebies Finder, 100+ Free Tools, Savings Calculator, This Week, AI Deal Finder, Stack Builder
- Mobile: grouped sections (Browse: Deals/Student Discounts/This Week/Blog | Tools: all 6 tools | Submit)

### API Routes

- `POST /api/submit-deal` — creates deal in Notion (Name, URL, Category, Audiences, Description, Slug)
- `POST /api/subscribe` — newsletter signup with frequency and interests (validated)
- `POST /api/search-log` — search analytics logging (query + results count, max 200 chars)
- `POST /api/push-subscribe` — push notification subscription (placeholder)
- `POST /api/revalidate` — ISR revalidation trigger
- `GET /api/deals` — fetch all deals as JSON
- `GET /api/badge/[slug]` — dynamic SVG badge for a deal
- `GET /api/og` — dynamic OG image generation

### Client-side features

- **Saved deals** (`useSavedDeals.ts`) — localStorage with `useSyncExternalStore`, heart toggle on cards
- **Claim counter** (`useClaimCount.ts`) — deterministic base count from slug hash + localStorage increment
- **Region filter** — auto-detects from timezone via `useSyncExternalStore`, manual override (US/EU/UK/Asia)
- **Deal ratings** — 5-star + helpful votes, localStorage
- **Social sharing** — copy link, Twitter, LinkedIn
- **Push notifications** (`PushNotification.tsx`) — subscription prompt, service worker
- **Compare mode** — select up to 3 deals for side-by-side comparison
- **Deal voting** (`DealVoting.tsx`) — "Is this deal still working?" Yes/No, localStorage, percentage display

### Canonical domain

All canonical URLs use `https://www.studentperks.dev` (non-www 307-redirects to www). Always use `www.` prefix in canonical URLs, sitemap, and OG metadata.

### Production optimizations (next.config.ts)

- `compress: true` — gzip compression
- `images.formats: ["image/avif", "image/webp"]` — modern image formats
- Cache headers: `/logos/*` and `*.svg` → `public, max-age=31536000, immutable`
- `src/app/robots.ts` — allows `/`, disallows `/api/` and `/_next/`, references sitemap

### Adding new deals

Add deals via Notion database. Properties must include: Name, Slug, URL, Category, Audiences, Tagline, Description, Value, Steps, Logo. Optional: Featured (checkbox), Status (select), Regions (multi_select), Video (url).

### Adding blog posts

Create a `.mdx` file in `src/content/blog/` with frontmatter: `title`, `date`, `description`, `tags`.

### Adding guides

Add a `GuideSEO` entry to `GUIDE_SEO` array in `src/data/seo-content.ts` with: `slug`, `dealSlug`, `title`, `metaDescription`, `heading`, `intro`, `eligibility[]`, `faqs[]`. The page at `/guides/[slug]` is auto-generated.

### Adding VS comparisons

Add a `VsSEO` entry to `VS_SEO` array in `src/data/seo-content.ts` with: `slug` (format: `tool1-vs-tool2`), `tool1`, `tool2`, `tool1Slug?`, `tool2Slug?`, `title`, `metaDescription`, `intro`, `forStudents`, `winner`, `rows[]`. The page at `/vs/[slug]` is auto-generated.

### Adding alternatives / comparisons / use-cases / tags

Add entries to the respective arrays in `src/data/seo-content.ts`: `ALTERNATIVES_SEO`, `COMPARISON_SEO`, `USE_CASE_SEO`, `TAG_SEO`. Pages are auto-generated at `/alternatives/[slug]`, `/compare/[slug]`, `/best/[slug]`, `/tag/[slug]`.

### Adding universities

Add entries to `UNIVERSITIES` array in `src/data/universities.ts` with: `slug`, `name`, `shortName`, `region`, `country`. The page at `/university/[slug]` is auto-generated.

### Notion bulk scripts (scripts/)

`.mjs` files for seeding, auditing, importing, and fixing deals in Notion. They read `.env.local` manually (no dotenv dependency). Run with `node scripts/<name>.mjs`.

### External content (docs/)

- `docs/awesome-list/` — GitHub awesome-list (published at github.com/Ildarflame/awesome-student-developer-deals)
- `docs/articles/` — 3 article drafts for dev.to/Medium
- `docs/content-strategy.md` — 6-month content/SEO plan
- `docs/viral-posts.md` — ready-to-publish posts for Reddit, HN, Twitter, Product Hunt
- `docs/plans/` — design docs and implementation plans (historical)

### Environment variables

- `NOTION_TOKEN` — Notion integration token
- `NOTION_DEALS_DATABASE_ID` — Notion deals database ID

### Platform notes (macOS)

- `grep -P` not supported — use `awk` or ripgrep instead
- `git add` with brackets in filenames needs single quotes
- `.next` directory lock issues: kill running processes first, then `rm -rf .next`
- Avoid `node -e` in zsh (escaping issues) — write to `.mjs` files instead
