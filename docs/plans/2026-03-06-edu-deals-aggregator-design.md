# EduDeals — Student & Startup Perks Aggregator

## Overview

MVP of a deal aggregator website for students (with .edu email), startups, and open source projects. Aggregates free/discounted tools and services across categories: Dev, AI, SaaS, Learning, Cloud, Design, Entertainment.

## Pages

- **Home (`/`)** — Hero, stats, featured deals, audience sections
- **Catalog (`/deals`)** — Filterable grid (category, audience, search, sort)
- **Deal detail (`/deals/[slug]`)** — Full info, steps to claim, related deals
- **About (`/about`)** — Mission, how to suggest a service
- **Blog (`/blog`)** — MDX guides and roundups
- **Blog post (`/blog/[slug]`)** — Individual article

## Data Model

```typescript
type Deal = {
  slug: string
  name: string
  logo: string
  category: Category
  audiences: Audience[]
  tagline: string
  description: string
  value: string
  steps: string[]
  url: string
  featured: boolean
}

type Category = "Dev" | "AI" | "SaaS" | "Learning" | "Cloud" | "Design" | "Entertainment"
type Audience = "students" | "startups" | "opensource"
```

Blog: MDX files with frontmatter (title, date, description, tags).

## Visual Style

- **Vibe:** Bright, youthful, energetic (Product Hunt / student project feel)
- **Colors:** White/light-gray base, vibrant gradients (purple-pink, blue-cyan), unique color per category
- **Typography:** Bold headlines, large sizes, Inter font
- **Components:** Deal cards with logo/badges/value, gradient buttons, hover animations, category icons

## Tech Stack

- Next.js 14+ (App Router, SSG)
- Tailwind CSS
- MDX for blog
- Data in TypeScript file (`data/deals.ts`)
- Client-side filtering (useState)
- SEO via generateMetadata + generateStaticParams

## Project Structure

```
src/
  app/
    page.tsx
    deals/
      page.tsx
      [slug]/page.tsx
    about/page.tsx
    blog/
      page.tsx
      [slug]/page.tsx
  components/
    Header.tsx
    Footer.tsx
    DealCard.tsx
    CategoryFilter.tsx
    SearchBar.tsx
    AudienceBadge.tsx
  data/
    deals.ts
  content/
    blog/
```

## Architecture

Fully static (SSG). All pages generated at build time from TS data file. Free hosting on Vercel/Netlify. Can migrate to headless CMS later without rewriting frontend.
