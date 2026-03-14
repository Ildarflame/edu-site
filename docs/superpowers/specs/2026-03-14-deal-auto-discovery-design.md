# Deal Auto-Discovery System — Design Spec

## Overview

Automated weekly discovery of new student/startup deals from GitHub Education Pack and SaaS company education pages. Runs as a GitHub Action every Monday, creates a PR with discovered deals for human review.

## Architecture

### Components

| File | Purpose |
|------|---------|
| `.github/workflows/discover-deals.yml` | Cron schedule (Monday 9:00 UTC) + workflow |
| `scripts/discover-deals.mjs` | Orchestrator — runs parsers, diffs, outputs results |
| `scripts/sources/github-pack.mjs` | Parser for education.github.com/pack |
| `scripts/sources/saas-education.mjs` | Parser for SaaS education/student pages |
| `scripts/sources/companies.json` | Hardcoded list of SaaS company URLs to check |
| `scripts/import-discovered.mjs` | Imports approved deals from JSON into Notion |

### Data Flow

1. GitHub Action triggers (Monday 9:00 UTC)
2. `discover-deals.mjs` fetches current deals via production API (`/api/deals`)
3. Runs GitHub Pack parser → extracts partner list
4. Runs SaaS education parser → checks hardcoded company URLs
5. Diffs discovered deals against existing deals (by slug/name similarity)
6. If new deals found → commits `scripts/discovered-deals.json` → creates PR
7. Human reviews PR → merges → runs `node scripts/import-discovered.mjs`

### GitHub Pack Parser (`github-pack.mjs`)

- Fetches `https://education.github.com/pack`
- Extracts partner names, descriptions, URLs, and offer details
- Maps to deal schema: slug, name, tagline, value, url, category (best guess)
- Returns array of candidate deals

### SaaS Education Parser (`saas-education.mjs`)

- Reads `companies.json` — list of `{ name, slug, urls: ["/education", "/students", ...], category }`
- For each company: tries each URL pattern, checks if page exists (200 status)
- Extracts page title and meta description for tagline/value hints
- Returns array of candidate deals

### Companies List (`companies.json`)

Hardcoded ~50 SaaS companies with URL patterns to check:

```json
[
  {
    "name": "Cursor",
    "slug": "cursor-students",
    "category": "Dev",
    "urls": ["https://cursor.com/students", "https://cursor.com/education"]
  },
  {
    "name": "Webflow",
    "slug": "webflow-education",
    "category": "Design",
    "urls": ["https://webflow.com/for/education", "https://webflow.com/students"]
  }
]
```

### Discovered Deals Format (`discovered-deals.json`)

```json
[
  {
    "slug": "example-students",
    "name": "Example Tool",
    "source": "github-pack | saas-education",
    "sourceUrl": "https://example.com/students",
    "category": "Dev",
    "audiences": ["Students"],
    "tagline": "Extracted from page",
    "value": "Extracted or 'Free for students'",
    "url": "https://example.com/students",
    "discoveredAt": "2026-03-14"
  }
]
```

### Import Script (`import-discovered.mjs`)

- Reads `scripts/discovered-deals.json`
- For each deal: creates page in Notion database
- Downloads logo from Iconify API to `public/logos/{slug}.svg`
- Reports success/failure per deal

## GitHub Action Workflow

```yaml
name: Discover New Deals
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9:00 UTC
  workflow_dispatch: {}    # Manual trigger
```

Steps:
1. Checkout repo
2. Setup Node.js 20
3. Run `node scripts/discover-deals.mjs`
4. If `discovered-deals.json` has entries → create PR via `gh pr create`

## Error Handling

- Network failures: skip source, log warning, continue with others
- Parse failures: log error with URL, continue
- No new deals found: workflow exits successfully, no PR created
- GitHub Pack HTML structure changed: log error, skip parser, rely on SaaS parser

## Constraints

- No API keys needed for scraping (public pages only)
- Notion token only needed for `import-discovered.mjs` (runs locally)
- Rate limiting: 1-second delay between fetches to be polite
- GitHub Action free tier: sufficient for weekly runs

## Out of Scope (future additions)

- Twitter/Reddit monitoring
- AI-powered deal extraction (Claude API)
- Automatic Notion import (without PR review)
- Slack/Telegram notifications
