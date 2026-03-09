# SEO Articles Design

**Goal:** 18 high-traffic blog articles in 5 thematic clusters, targeting high-volume search queries and cross-linking to existing programmatic SEO pages.

**Approach:** Cluster strategy — 3-4 articles per cluster with internal cross-links for topical authority. Each article targets a specific search query, links to `/deals/[slug]` pages and programmatic routes (`/best/`, `/compare/`, `/guides/`, `/tag/`, `/for/`, `/alternatives/`).

**Language:** English

**Format:** MDX files in `src/content/blog/` with frontmatter (title, date, description, tags).

**Article length:** 1000-1500 words each.

---

## Cluster 1: AI & ML Tools (4 articles)

| # | Slug | Title | Target Query | Format |
|---|------|-------|-------------|--------|
| 1 | best-free-ai-tools-students-2026 | Best Free AI Tools for Students in 2026 | free ai tools students | Listicle |
| 2 | github-copilot-free-student-guide | How to Get GitHub Copilot Free as a Student | github copilot free student | How-to |
| 3 | free-gpu-access-students-2026 | Free GPU Access for Students & Researchers 2026 | free gpu students | Listicle + guide |
| 4 | chatgpt-vs-copilot-students | ChatGPT vs GitHub Copilot for Students: Which One Do You Actually Need? | chatgpt vs copilot students | Comparison |

Internal links: `/best/best-free-ai-coding`, `/compare/github-copilot-vs-cursor`, `/guides/how-to-get-copilot-free`, `/for/students`

## Cluster 2: Cloud & Hosting (4 articles)

| # | Slug | Title | Target Query | Format |
|---|------|-------|-------------|--------|
| 5 | free-hosting-students-2026 | Free Hosting for Students: Deploy Your Projects for $0 | free hosting students | Listicle + tutorial |
| 6 | vercel-vs-railway-vs-render | Vercel vs Railway vs Render: Best Free Hosting for Side Projects | vercel vs railway vs render | Comparison |
| 7 | free-aws-credits-startup-guide | How to Get $10,000+ in Free AWS Credits for Your Startup | free aws credits startup | How-to |
| 8 | best-free-databases-2026 | Best Free Databases in 2026: MongoDB, Supabase, PlanetScale & More | free database hosting | Listicle |

Internal links: `/best/best-free-hosting`, `/best/best-free-databases`, `/compare/vercel-vs-railway`, `/compare/supabase-vs-mongodb`, `/guides/how-to-get-aws-activate`

## Cluster 3: Dev Tools & Productivity (4 articles)

| # | Slug | Title | Target Query | Format |
|---|------|-------|-------------|--------|
| 9 | best-free-ides-students-2026 | Best Free IDEs for Students in 2026: JetBrains, VS Code & More | free ide students | Listicle |
| 10 | jetbrains-student-license-guide | How to Get JetBrains IDEs Free with a Student License | jetbrains student license free | How-to |
| 11 | free-ci-cd-tools-developers | Free CI/CD Tools for Developers: GitHub Actions, Railway & Beyond | free ci cd tools | Listicle |
| 12 | notion-vs-linear-vs-slack-students | Notion vs Linear vs Slack: Best Free Productivity Stack for Student Teams | notion free students | Comparison |

Internal links: `/best/best-free-ides`, `/guides/how-to-get-jetbrains-free`, `/tag/ide`, `/tag/ci-cd`, `/compare/notion-vs-linear`, `/alternatives/slack`

## Cluster 4: Design Tools (3 articles)

| # | Slug | Title | Target Query | Format |
|---|------|-------|-------------|--------|
| 13 | best-free-design-tools-students-2026 | Best Free Design Tools for Students in 2026 | free design tools students | Listicle |
| 14 | figma-free-student-education-plan | How to Get Figma Free as a Student (Education Plan) | figma free student | How-to |
| 15 | free-adobe-alternatives-students | Free Alternatives to Adobe Creative Cloud for Students | free adobe alternatives students | Alternatives listicle |

Internal links: `/category/design`, `/for/students/design`, `/alternatives/figma`, `/guides/how-to-get-figma-free`

## Cluster 5: Startup Launch (3 articles)

| # | Slug | Title | Target Query | Format |
|---|------|-------|-------------|--------|
| 16 | launch-saas-free-tools-2026 | How to Launch a SaaS for $0: Complete Free Tools Stack 2026 | launch saas free tools | Guide + listicle |
| 17 | best-free-monitoring-analytics-startups | Best Free Monitoring & Analytics Tools for Startups | free monitoring tools startups | Listicle |
| 18 | stripe-vs-lemonsqueezy-indie-hackers | Stripe vs LemonSqueezy: Best Payment Platform for Indie Hackers | stripe vs lemonsqueezy | Comparison |

Internal links: `/for/startups`, `/best/best-free-monitoring`, `/tag/monitoring`, `/compare/stripe-vs-lemonsqueezy`, `/stack`

---

## Article Structure (template)

Each article follows this structure:

1. **Frontmatter:** title, date, description (meta), tags (for filtering)
2. **Intro:** 2-3 paragraphs — hook, context, what reader will learn
3. **Main content:** Lists/steps/comparison tables with links to `/deals/[slug]`
4. **Cross-links:** Related posts from same cluster + programmatic pages
5. **CTA:** "Browse all deals on StudentPerks"

## Cross-linking Strategy

- Articles within same cluster link to each other
- Every deal mention links to `/deals/[slug]`
- Category/audience references link to programmatic pages
- Comparison articles link to `/compare/` pages
- How-to articles link to `/guides/` pages
- Listicles link to `/best/` and `/tag/` pages
