# Deal Auto-Discovery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-discover new student/startup deals weekly from GitHub Education Pack + SaaS education pages, create PR for review.

**Architecture:** Node.js scripts run via GitHub Actions cron. Two parsers (GitHub Pack HTML + SaaS URL checker) feed into a diff engine that outputs new deals as JSON. PR created via `gh` CLI.

**Tech Stack:** Node.js 20, native fetch, GitHub Actions, gh CLI

---

### Task 1: Companies list + SaaS education parser

**Files:**
- Create: `scripts/sources/companies.json`
- Create: `scripts/sources/saas-education.mjs`

- [ ] Create `companies.json` with ~50 SaaS companies and their education/student page URLs
- [ ] Create `saas-education.mjs` — for each company, try URLs, extract title/meta, return candidates
- [ ] Test locally: `node -e "import('./scripts/sources/saas-education.mjs').then(m => m.discover().then(console.log))"`

### Task 2: GitHub Pack parser

**Files:**
- Create: `scripts/sources/github-pack.mjs`

- [ ] Fetch and parse `education.github.com/pack/offers`
- [ ] Extract partner names, descriptions, URLs
- [ ] Test locally

### Task 3: Orchestrator + diff

**Files:**
- Create: `scripts/discover-deals.mjs`

- [ ] Fetch existing deals from production API
- [ ] Run both parsers
- [ ] Diff by slug/name similarity
- [ ] Write `scripts/discovered-deals.json` if new deals found
- [ ] Exit with code 0 (no new) or 1 (found new)

### Task 4: Import script

**Files:**
- Create: `scripts/import-discovered.mjs`

- [ ] Read `discovered-deals.json`
- [ ] Download logos from Iconify
- [ ] Create deals in Notion
- [ ] Report results

### Task 5: GitHub Action workflow

**Files:**
- Create: `.github/workflows/discover-deals.yml`

- [ ] Cron Monday 9:00 UTC + manual dispatch
- [ ] Run discover script
- [ ] If new deals → create PR
- [ ] Commit
