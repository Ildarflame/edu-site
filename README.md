# StudentPerks

> 153+ free tools, cloud credits, and pro plans for students, startups, and open source developers.

**[studentperks.dev](https://studentperks.dev)** — curated directory with $500K+ in total value. Every deal is verified with direct signup links and step-by-step instructions.

## Features

- **153+ verified deals** across 7 categories (Cloud, Dev Tools, AI, Design, Learning, SaaS, Entertainment)
- **Smart filters** — search, category, audience, value type + sort by newest/value/A-Z
- **AI Deal Finder** — describe your situation, get matched deals
- **Stack Builder** — select your tech stack, see relevant deals
- **Deal comparison** — compare up to 3 deals side-by-side
- **Submit a deal** — community submissions via form → Notion
- **Blog** — SEO guides (GitHub Student Pack, cloud credits, startup tools)
- **Ratings & reviews** — star ratings and helpful votes on every deal
- **Newsletter** — weekly/monthly digest with interest preferences
- **PWA** — installable with offline support

## Tech Stack

- **Next.js 16** (App Router, SSG/ISR)
- **Tailwind CSS v4**
- **TypeScript**
- **Notion** as CMS
- **MDX** (blog via next-mdx-remote)
- **Vercel** (hosting, analytics, speed insights)

## Getting Started

```bash
npm install
cp .env.example .env.local  # add your Notion token and database ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Notion integration token |
| `NOTION_DEALS_DATABASE_ID` | Notion deals database ID |

## Build

```bash
npm run build   # 172 pages statically generated
npm start
```

## Project Structure

```
src/
  app/
    deals/           # Catalog + [slug] detail + compare
    blog/            # Blog list + [slug] posts
    discover/        # AI Deal Finder
    stack/           # Stack Builder
    submit/          # Submit a deal form
    about/           # About page
    api/
      submit-deal/   # POST — create deal in Notion
      subscribe/     # POST — newsletter signup
  components/        # UI components (DealsGrid, DealCard, DealFinder, StackBuilder, etc.)
  data/              # Fallback deal data and types
  lib/               # Notion API client, blog loader, utilities
  content/
    blog/            # MDX blog posts
docs/
  awesome-list/      # GitHub awesome-list (separate repo)
  articles/          # dev.to / Medium article drafts
  content-strategy.md
scripts/             # Notion bulk import/audit/fix scripts
```

## Adding Deals

Deals are managed in Notion. Required properties: Name, Slug, URL, Category, Audiences (Students/Startups/Opensource), Tagline, Description, Value, Steps, Logo, Featured.

Users can also submit deals via the `/submit` form.

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

## Related

- **[awesome-student-developer-deals](https://github.com/Ildarflame/awesome-student-developer-deals)** — GitHub awesome-list with 50+ top deals

## Deploy

Hosted on [Vercel](https://vercel.com). Push to `main` triggers automatic deployment. All pages are statically generated with 5-min ISR revalidation.

## License

MIT
