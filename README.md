# StudentPerks

Curated directory of free tools, services, and perks for students, startups, and open source projects.

## Tech Stack

- **Next.js 16** (App Router, fully static SSG)
- **Tailwind CSS v4**
- **TypeScript**
- **MDX** (blog via next-mdx-remote)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/           # Next.js App Router pages
    deals/       # Deals catalog + [slug] detail pages
    blog/        # Blog list + [slug] post pages
    about/       # About page
  components/    # Reusable UI components
  data/          # Deal data and types (deals.ts)
  lib/           # Utilities (blog.ts - MDX loading)
  content/
    blog/        # MDX blog posts
```

## Adding Deals

Add an entry to the `deals` array in `src/data/deals.ts`. Each deal has: slug, name, category, audiences, tagline, description, value, steps, url, featured flag.

## Adding Blog Posts

Create a `.mdx` file in `src/content/blog/` with frontmatter:

```yaml
---
title: "Post Title"
date: "2026-03-01"
description: "Short description"
tags: ["tag1", "tag2"]
---
```

## Deploy

Optimized for [Vercel](https://vercel.com). Connect the repo and deploy — all pages are statically generated at build time.

## License

MIT
