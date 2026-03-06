# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Next.js 16 with Turbopack)
- `npm run build` — production build (SSG, all pages prerendered)
- `npm run lint` — ESLint
- `npm start` — serve production build

## Architecture

**EduDeals** — fully static Next.js 16 aggregator of free perks/deals for students, startups, and open source projects.

**Stack:** Next.js 16 (App Router, SSG), Tailwind CSS v4, TypeScript, MDX (next-mdx-remote/rsc), Inter font (next/font/google)

### Data flow

- Deal data lives in `src/data/deals.ts` as a typed TypeScript array (no database, no CMS). Types: `Deal`, `Category`, `Audience`. Helper functions: `getDealBySlug`, `getDealsByCategory`, `getDealsByAudience`, `getFeaturedDeals`.
- Blog posts are MDX files in `src/content/blog/` with frontmatter (title, date, description, tags). Loaded via `src/lib/blog.ts` using `gray-matter` + `fs`.
- All pages are statically generated. Dynamic routes (`/deals/[slug]`, `/blog/[slug]`) use `generateStaticParams`.

### Key patterns

- **Next.js 16 async params:** Dynamic page components and `generateMetadata` receive `params` as `Promise<{ slug: string }>` — must `await params`.
- **Client/Server split:** Filtering logic (search, category, audience) is client-side in `DealsGrid.tsx` (`"use client"`). Pages and layout are server components.
- **Path alias:** `@/*` maps to `./src/*`.

### Routes

- `/` — home page (hero, stats, featured deals, audiences, categories)
- `/deals` — catalog with client-side filtering (SearchBar, CategoryFilter, audience buttons)
- `/deals/[slug]` — deal detail (SSG)
- `/blog` — blog list
- `/blog/[slug]` — blog post (MDX rendered via `MDXRemote`)
- `/about` — static about page

### Adding new deals

Add an entry to the `deals` array in `src/data/deals.ts`. If using a new category, add it to the `Category` type and `CATEGORY_CONFIG`.

### Adding blog posts

Create a `.mdx` file in `src/content/blog/` with frontmatter: `title`, `date`, `description`, `tags`.
