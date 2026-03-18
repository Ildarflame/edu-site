# SEO & CTR Optimization Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan.

**Goal:** Increase organic CTR from 0.58% to 3-5% and grow search traffic by optimizing meta tags, adding targeted content, and fixing structural SEO issues.

**Architecture:** Direct edits to metadata exports, SEO content data, blog frontmatter, and Next.js config. No new components or API changes.

**Tech Stack:** Next.js metadata API, MDX frontmatter, structured data (JSON-LD)

**Data source:** Google Search Console + Vercel Analytics (Feb 16 — Mar 18, 2026)

---

## Task 1: Optimize Meta Tags for High-Impression Pages

**Rationale:** 15 pages with 2600+ combined impressions and <1% CTR. Fixing titles to match actual search queries is the highest-ROI change.

### 1.1 Homepage (layout.tsx)

**File:** `src/app/layout.tsx:9-30`

- [ ] Title: `"150+ Free Developer Tools for Students & Startups (2026)"` ← was "StudentPerks — Free Tools..."
- [ ] Description: `"Free JetBrains, GitHub Copilot, Azure $100, AWS $100K — 150+ verified deals for students, startups & open source projects. Claim in minutes."`
- [ ] Update OG + Twitter to match

**Why:** Unknown brand name "StudentPerks" as title prefix wastes chars. Numbers + year + specifics drive clicks.

### 1.2 /student-discount index

**File:** `src/app/student-discount/page.tsx:9-21`

- [ ] Title: `"Best Student Discounts on Software (2026) — 120+ Free Tools"` ← matches top query "student discounts on software"
- [ ] Description: `"120+ verified student discounts: JetBrains free, GitHub Copilot, Azure $100 credit, Notion Plus. Claim with .edu email — step-by-step guides included."`

**Why:** Queries "student discounts on software" (4 imp, pos 20), "best student software discounts 2026" (3 imp, pos 2) — front-load these keywords.

### 1.3 /deals

**File:** `src/app/deals/page.tsx:9-13`

- [ ] Title: `"150+ Free Tools for Students & Startups — Verified Deals 2026"`
- [ ] Description: `"Browse 150+ free developer tools, cloud credits & pro plans. Filter by category, audience & region. Every deal verified with step-by-step instructions."`

### 1.4 /student-discount/[tool] template

**File:** `src/app/student-discount/[tool]/page.tsx:27-28`

- [ ] Title: `` `${deal.name} Student Discount 2026 — ${deal.value}` `` ← was `"...${deal.value} Free 2026"` (awkward double "free")
- [ ] Description: `` `Claim ${deal.name} free as a student in 2026. ${deal.tagline}. Verified deal with step-by-step claim guide.` ``

### 1.5 /guides index

**File:** `src/app/guides/page.tsx:5-16`

- [ ] Title: `"Free Developer Tool Guides 2026 — JetBrains, Copilot, Azure & More"`
- [ ] Description: `"Step-by-step guides to claim free developer tools: JetBrains ($649 value), GitHub Copilot, Azure $100, AWS $100K. Eligibility + FAQ for each."`

**Why:** Remove hardcoded "27" (now 32 guides). Add "Azure" (221 impressions on azure guide). Add year.

### 1.6 Guide: Namecheap domain

**File:** `src/data/seo-content.ts` — GUIDE_SEO entry `how-to-get-namecheap-domain-free`

- [ ] Title: `"Namecheap Free Domain for Students — .me, .tech & .co (2026)"` ← was "Free Domain for Students..."
- [ ] Description: `"Get a free .me domain from Namecheap via GitHub Student Pack. Plus .tech and .co domains. Free SSL & WHOIS privacy. 5-minute setup with .edu email."`

**Why:** "namecheap student free domain" (16 imp) and "namecheap student" (16 imp) — brand name must be in title.

### 1.7 Guide: Azure credits

**File:** `src/data/seo-content.ts` — GUIDE_SEO entry `how-to-get-azure-student-credits`

- [ ] Title: keep as-is (already good)
- [ ] Description: `"Get $100 Azure credits + 25 free cloud services with just a .edu email. No credit card required. Step-by-step 5-minute setup guide with screenshots."`

### 1.8 Guide: Sentry

**File:** `src/data/seo-content.ts` — GUIDE_SEO entry `how-to-get-sentry-free`

- [ ] Title: `"How to Get Sentry Free — Student & Open Source Plans (2026)"` ← was "Sentry Free for Open Source..."
- [ ] Description: `"Sentry Business plan free for open source projects + student access via GitHub Pack. 500K events/month, performance monitoring. Apply in 5 minutes."`

**Why:** "sentry free" (18 imp), "is sentry free" (6 imp), "sentry student" (2 imp) — broader than just OSS.

### 1.9 Blog: AI tools

**File:** `src/content/blog/best-free-ai-tools-students-2026.mdx` (frontmatter)

- [ ] Title: `"15+ Free AI Tools for Students in 2026 — Copilot, Claude & More"` ← remove "| StudentPerks" (unknown brand wastes chars)
- [ ] Description: `"Claim GitHub Copilot, ChatGPT Plus, Claude Pro, OpenAI $2500 API credits — all free for students. Step-by-step guide for each tool."`

### 1.10 Blog: Startup tools

**File:** `src/content/blog/best-free-tools-for-startups-2026.mdx` (frontmatter)

- [ ] Title: `"40+ Free Startup Tools Worth $200K+ in Credits (2026)"` ← remove "| StudentPerks"
- [ ] Description: `"AWS $100K, Stripe Atlas free, Vercel Pro, Notion free — 40+ verified startup programs. Step-by-step instructions to claim today."`

### 1.11 Blog: Learning platforms

**File:** `src/content/blog/best-free-learning-platforms-students-2026.mdx` (frontmatter)

- [ ] Title: `"10+ Free Learning Platforms for CS Students (2026 Guide)"` ← "Guide" instead of brand name
- [ ] Description: `"Coursera campus access, freeCodeCamp, MIT OCW, Codecademy Pro — best free platforms to learn programming in 2026. No credit card needed."`

---

## Task 2: New SEO Content for Query Gaps

Target query clusters with significant impressions but no well-optimized landing page.

### 2.1 New blog post: Free Cloud Credits for Students

**File:** Create `src/content/blog/free-cloud-credits-students-2026.mdx`

**Target queries:** "free cloud for students" (6 imp, pos 83), "free cloud credits for students 2026" (1 imp, pos 3), "azure for students" cluster (~30 imp), "aws credits" cluster

**Content plan:**
- Compare AWS Educate vs Azure Students vs GCP for Students vs DigitalOcean
- Include credit amounts, eligibility, expiration
- Link to individual guides for each provider
- ~800 words

### 2.2 New blog post: Free Domain for Students

**File:** Create `src/content/blog/free-domain-students-2026.mdx`

**Target queries:** "free domain for students" (6+4+4 imp, pos 15-19), "free domain with student email" (1 imp, pos 9), "namecheap student" cluster (48 imp)

**Content plan:**
- Compare Namecheap .me vs .tech domain vs .co via GitHub Pack vs GitHub Pages custom domain
- Include steps, TLD options, SSL, renewal
- Link to Namecheap guide
- ~600 words

### 2.3 New blog post: Student Software Discounts Directory

**File:** Create `src/content/blog/student-software-discounts-2026.mdx`

**Target queries:** "student discount software" (4 imp, pos 20), "student software deals" (1 imp, pos 49), "software student discount" (3 imp, pos 52), "best student software discounts 2026" (3 imp, pos 2)

**Content plan:**
- Overview of the student discount ecosystem
- Top picks by category (AI, Cloud, Dev, Design, Entertainment)
- Link heavily to /student-discount and /category pages
- ~1000 words

---

## Task 3: Structural SEO Fixes

### 3.1 Fix blog title template (remove "| StudentPerks" suffix)

**File:** `src/app/blog/[slug]/page.tsx:16`

- [ ] Change `${post.title} | StudentPerks` → `${post.title}`

**Why:** Brand suffix wastes 16 chars on an unknown brand. All 7 blog posts will benefit.

### 3.2 Add FAQ schema to /deals page

**File:** `src/app/deals/page.tsx`

- [ ] Add FAQPage JSON-LD with 3 common questions:
  - "Are these deals really free?"
  - "Do I need a .edu email?"
  - "How often are deals updated?"

### 3.3 Verify canonical tags handle non-www

All pages already have explicit canonical tags with `www.` prefix. The 307 redirect from non-www is in place. GSC shows split impressions (studentperks.dev vs www.studentperks.dev) — this will consolidate over time. No code change needed, but verify in GSC that the www property is set as preferred.

### 3.4 Verify /deals?* is properly handled

robots.txt already disallows `/deals?*` for general crawlers. Google still shows 158 impressions for `/deals?category=Cloud` — this will drop as Google respects the disallow. No code change needed.

---

## Commit Strategy

1. Commit meta tag optimizations (Task 1)
2. Commit new blog posts (Task 2)
3. Commit structural fixes (Task 3)
