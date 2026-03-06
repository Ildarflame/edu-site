# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js 16 with Turbopack)
- `npm run build` — production build (SSG, 172 pages prerendered)
- `npm run lint` — ESLint
- `npm start` — serve production build

## Architecture

**StudentPerks** (studentperks.dev) — a Next.js 16 directory of free perks/deals for students, startups, and open source projects. 153+ verified deals worth $500K+.

**Stack:** Next.js 16 (App Router, SSG/ISR), Tailwind CSS v4, TypeScript, MDX (next-mdx-remote/rsc), Notion CMS, Vercel Analytics, Inter font

### Data flow

- **Deals** live in Notion database (ID: `31bed78d40648049a78ef531b5ee456e`). Fetched via `src/lib/notion.ts` using Notion API. Fallback data in `src/data/deals.ts`.
- **Notion properties:** Name (title), Slug (rich_text), Logo (rich_text), Category (select: Dev/AI/SaaS/Learning/Cloud/Design/Entertainment), Audiences (multi_select: Students/Startups/Opensource — capitalized), Tagline, Description, Value, Steps (newline-separated), URL, Featured (checkbox)
- **Blog posts** are MDX files in `src/content/blog/` with frontmatter (title, date, description, tags). Loaded via `src/lib/blog.ts`.
- **Logos:** SVG files in `public/logos/`, sourced from Iconify API. Referenced by slug in Notion `Logo` field.
- ISR with `revalidate: 300` (5 min) for deal pages.

### Key patterns

- **Next.js 16 async params:** Dynamic pages receive `params` as `Promise<{ slug: string }>` — must `await params`.
- **Client/Server split:** Filtering, search, sorting, comparison are client-side in `DealsGrid.tsx` (`"use client"`). Pages and layout are server components.
- **URL params:** Filters sync to URL: `?q=`, `?category=`, `?audience=`, `?value=`, `?sort=`, `?page=`
- **Path alias:** `@/*` maps to `./src/*`.
- **SEO:** JSON-LD structured data on all pages (Product, CollectionPage, BlogPosting, BreadcrumbList, WebSite). Canonical URLs. Sitemap includes deals, blog, category/audience filters.

### Routes

- `/` — home (hero, featured deals, audiences, categories, newsletter, stats)
- `/deals` — catalog with filters, search, sort, pagination, compare mode
- `/deals/[slug]` — deal detail with ratings, sharing, JSON-LD
- `/deals/compare` — side-by-side deal comparison (up to 3)
- `/discover` — AI Deal Finder (keyword matching)
- `/stack` — Stack Builder (select tech → get relevant deals)
- `/blog` — blog list
- `/blog/[slug]` — blog post (MDX)
- `/about` — about page with stats
- `/submit` — submit a deal form → Notion API
- `/offline` — PWA offline fallback

### API Routes

- `POST /api/submit-deal` — creates deal in Notion (Name, URL, Category, Audiences, Description, Slug)
- `POST /api/subscribe` — newsletter signup with frequency and interests

### Key components

- `DealsGrid.tsx` — main deals listing with filters, search, sort, pagination, compare mode
- `DealCard.tsx` — deal card with optional compare checkbox
- `DealFinder.tsx` — AI keyword-based deal matching
- `StackBuilder.tsx` — interactive tech stack → deals matcher
- `CompareBar.tsx` — floating comparison bar
- `DealRating.tsx` — 5-star rating + helpful votes (localStorage)
- `ShareButtons.tsx` — copy link, Twitter, LinkedIn
- `NewsletterForm.tsx` — email signup with frequency/interests
- `Header.tsx` — nav with Blog, Discover, Stack Builder links

### Adding new deals

Add deals via Notion database. Properties must include: Name, Slug, URL, Category, Audiences, Tagline, Description, Value, Steps, Logo. Set Featured checkbox for homepage display.

### Adding blog posts

Create a `.mdx` file in `src/content/blog/` with frontmatter: `title`, `date`, `description`, `tags`.

### External content (docs/)

- `docs/awesome-list/` — GitHub awesome-list (published at github.com/Ildarflame/awesome-student-developer-deals)
- `docs/articles/` — 3 article drafts for dev.to/Medium
- `docs/content-strategy.md` — 6-month content/SEO plan

### Environment variables

- `NOTION_TOKEN` — Notion integration token
- `NOTION_DEALS_DATABASE_ID` — Notion deals database ID
