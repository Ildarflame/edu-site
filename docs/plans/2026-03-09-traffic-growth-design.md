# Traffic Growth Design: SEO + Programmatic Pages + Blog Content

**Goal:** Grow organic search traffic from ~36 visitors to 3,000+/month through technical SEO improvements, 55-80 new programmatic landing pages, 3 blog posts, and better internal linking.

**Context:** Site launched 3 days ago. 36 visitors, 315 page views, 61% bounce rate. 172 existing pages. No manual distribution planned — pure organic/SEO focus.

**Stack:** Next.js 16 (SSG), Tailwind CSS v4, TypeScript, Notion CMS, Vercel.

---

## Section 1: Technical SEO

### 1.1 robots.txt
- Add explicit `Sitemap: https://studentperks.dev/sitemap.xml`
- Block `/api/` endpoints from crawling
- Allow all useful paths

### 1.2 Structured Data Expansion
- Add `SoftwareApplication` JSON-LD schema on each deal page (name, applicationCategory, offers with price "0")
- Add `BreadcrumbList` JSON-LD to all pages that don't have it yet (blog posts, about, submit, discover, stack, compare)

### 1.3 Internal Linking Network
- Deal pages: add "Also popular with [other audiences]" links to audience landing pages
- Deal pages: add "Read our guide" link to relevant blog post if one exists
- Blog posts: inline links from tool mentions to corresponding deal pages
- Category/audience pages: cross-link to related pages

### 1.4 Meta Optimization
- Add `keywords` meta tag to programmatic SEO pages (category, audience, alternatives, top)
- Add `article:published_time` and `article:tag` OpenGraph meta to blog posts

### 1.5 Performance Hints
- `dns-prefetch` for `api.notion.com`, `fonts.googleapis.com`, `va.vercel-scripts.com`
- `preconnect` already exists for Google Fonts — verify it's working

---

## Section 2: New Programmatic Pages (+55-80 pages)

All page content generated from data in `src/data/seo-content.ts` (new arrays).

### 2.1 "X vs Y" Comparison Pages (~20-30 pages)
- **Route:** `/compare/[slug1]-vs-[slug2]`
- **Content:** Side-by-side comparison table (category, value, audiences, steps), intro paragraph explaining both, "Which is better for you?" section, links to both deal pages
- **Data:** New `COMPARISON_SEO` array in seo-content.ts with pairs of popular deals in same category
- **Target queries:** "vercel vs railway free", "supabase vs mongodb free tier", "github copilot vs cursor free"

### 2.2 "Best tools for [use-case]" Pages (~15-20 pages)
- **Route:** `/best/[slug]`
- **Content:** Heading, intro, filtered deals grid, FAQ section
- **Data:** New `USE_CASE_SEO` array with slug, title, description, filter criteria (category + keywords), FAQs
- **Examples:** "best-free-databases-for-side-projects", "best-free-cicd-for-open-source", "best-free-design-tools-for-prototyping", "best-free-hosting-for-students"
- **Target queries:** long-tail "best free [x] for [y]" searches

### 2.3 "How to get [tool] for free" Pages (~10-15 pages)
- **Route:** `/guides/[slug]`
- **Content:** Step-by-step guide (expanded from deal.steps), eligibility info, estimated value, FAQ, link to deal page
- **Data:** New `GUIDE_SEO` array referencing deal slugs with expanded intro, eligibility notes, FAQs
- **Examples:** "how-to-get-jetbrains-free", "how-to-get-github-copilot-free", "how-to-get-aws-credits"
- **Target queries:** "how to get jetbrains free student", "github copilot free for students"

### 2.4 Tag Pages (~10-15 pages)
- **Route:** `/tag/[slug]`
- **Content:** Tag heading, description, filtered deals, related tags
- **Data:** New `TAG_SEO` array with slug, label, description, keyword matcher
- **Examples:** "database", "hosting", "ide", "cicd", "monitoring", "api", "design", "analytics"
- **Target queries:** "free database tools", "free hosting for developers"

---

## Section 3: Blog Content (3 posts + linking)

### 3.1 Publish 3 Existing Articles
Move from `docs/articles/` to `src/content/blog/` as MDX:
- `free-cloud-credits-2026.mdx` — "I Found $200K+ in Free Cloud Credits"
- `github-student-pack-alternatives.mdx` — "Beyond GitHub Student Pack: 150+ Free Tools"
- `startup-free-tools-2026.mdx` — "Launch Your Startup for $0"

Each article needs:
- MDX frontmatter (title, date, description, tags)
- Inline links to deal pages for every tool mentioned
- Internal links to relevant category/audience pages

### 3.2 Related Articles Block
- End of each blog post: "Related articles" section (2-3 posts)
- Deal pages: if a relevant blog post exists, show "Read our guide →" link

### 3.3 Blog Meta Enhancement
- Increase sitemap priority from 0.6 to 0.7
- Add `article:published_time` and `article:tag` to OpenGraph

---

## Section 4: Sitemap & Indexing

### 4.1 Structured Sitemap
Split single sitemap into sitemap index:
- `sitemap-main.xml` — static pages (home, deals, about, blog, submit, etc.)
- `sitemap-deals.xml` — all deal pages
- `sitemap-blog.xml` — all blog posts
- `sitemap-seo.xml` — category, audience, top, alternatives, comparisons, best, guides, tags
Google processes smaller sitemaps more efficiently.

### 4.2 lastModified Accuracy
- Deals: use ISR revalidation date (keep `new Date()` since Notion doesn't expose edit timestamps easily)
- Blog posts: use `post.date` (already done)
- SEO pages: keep `new Date()` (content is dynamic based on deals)

### 4.3 Canonical URLs
Every new page type (compare, best, guides, tags) gets explicit `alternates.canonical` in metadata.

---

## What's NOT in Scope
- Manual distribution (dev.to, Reddit, Twitter, Product Hunt)
- User accounts or authentication
- i18n / multilingual
- Paid ads or sponsored content
- New blog content creation (only publishing existing drafts)

---

## Expected Impact

| Metric | Current | Target (3 months) |
|--------|---------|-------------------|
| Indexed pages | ~172 | ~250-300 |
| Monthly organic visits | ~360 (projected) | 3,000+ |
| Long-tail keyword coverage | ~50 | ~200+ |
| Internal links per page | ~3-5 | ~8-12 |
| Blog posts | 4 | 7 |
