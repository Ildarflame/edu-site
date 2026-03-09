# Traffic Growth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Grow organic search traffic from ~36 visitors to 3,000+/month through technical SEO, 35+ new programmatic pages, 3 blog posts, and better internal linking.

**Architecture:** Add new SEO data arrays to `seo-content.ts`, create 4 new route types (compare, best, guides, tags), convert 3 article drafts to MDX blog posts, enhance JSON-LD/meta across existing pages, and restructure the sitemap. All pages are SSG with ISR revalidation.

**Tech Stack:** Next.js 16 (App Router, SSG), TypeScript, Tailwind CSS v4, MDX (next-mdx-remote/rsc), Notion CMS

---

## Phase 1: Technical SEO (Tasks 1–5)

### Task 1: Add SoftwareApplication JSON-LD to Deal Pages

**Files:**
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Add SoftwareApplication schema**

In `src/app/deals/[slug]/page.tsx`, find the existing JSON-LD script block and add a second one with SoftwareApplication schema. Follow the same pattern used in `src/app/alternatives/[slug]/page.tsx:49-61` for JSON-LD serialization (JSON.stringify + replace `<` with `\\u003c` + script tag with `type="application/ld+json"`).

```typescript
const softwareAppLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: deal.name,
  applicationCategory: deal.category,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: deal.value,
  },
  description: deal.tagline,
}).replace(/</g, "\\u003c");
```

Add the script tag in the JSX return using the same inline-script pattern as `alternatives/[slug]/page.tsx:122`.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds, deal pages render.

**Step 3: Commit**

```bash
git add src/app/deals/[slug]/page.tsx
git commit -m "feat(seo): add SoftwareApplication JSON-LD to deal pages"
```

---

### Task 2: Add BreadcrumbList JSON-LD to Missing Pages

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/submit/page.tsx`
- Modify: `src/app/discover/page.tsx`
- Modify: `src/app/stack/page.tsx`
- Modify: `src/app/blog/page.tsx`

**Step 1: Add BreadcrumbList to each page**

For each page, add a BreadcrumbList JSON-LD script following the same pattern as `alternatives/[slug]/page.tsx:63-71`. Each breadcrumb has Home → Page Name.

Example for about page:
```typescript
const breadcrumbLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
    { "@type": "ListItem", position: 2, name: "About" },
  ],
}).replace(/</g, "\\u003c");
```

Add the inline script tag at the end of the `<main>` using the same pattern as `alternatives/[slug]/page.tsx:123`.

Repeat for submit (name: "Submit a Deal"), discover (name: "Discover"), stack (name: "Stack Builder"), blog (name: "Blog").

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/about/page.tsx src/app/submit/page.tsx src/app/discover/page.tsx src/app/stack/page.tsx src/app/blog/page.tsx
git commit -m "feat(seo): add BreadcrumbList JSON-LD to about, submit, discover, stack, blog"
```

---

### Task 3: Add dns-prefetch Hints

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add dns-prefetch link tags**

In the `<head>` section of `layout.tsx`, add:
```html
<link rel="dns-prefetch" href="https://api.notion.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: add dns-prefetch for Notion API, Google Fonts, Vercel Analytics"
```

---

### Task 4: Add Article OpenGraph Meta to Blog Posts

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Enhance blog post metadata**

In `generateMetadata`, add `article:published_time` and `article:tag` to the OpenGraph metadata:

```typescript
openGraph: {
  title: post.title,
  description: post.description,
  type: "article",
  publishedTime: post.date,
  tags: post.tags,
  url: `https://studentperks.dev/blog/${slug}`,
},
```

Also update the sitemap priority for blog posts from 0.6 to 0.7 in `src/app/sitemap.ts:23`.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/app/blog/[slug]/page.tsx src/app/sitemap.ts
git commit -m "feat(seo): add article OpenGraph meta to blog posts, bump sitemap priority"
```

---

### Task 5: Add Internal Cross-Links to Deal Pages

**Files:**
- Modify: `src/app/deals/[slug]/page.tsx`

**Step 1: Add "Also popular with" links**

After the deal detail content, add a section showing audience landing page links for audiences the deal applies to:

```tsx
{/* Cross-links to audience pages */}
<div className="mt-8 flex flex-wrap gap-2">
  <span className="text-[13px] text-zinc-600">Also popular with:</span>
  {deal.audiences.map((aud) => (
    <Link
      key={aud}
      href={`/for/${aud}`}
      className="text-[13px] text-orange-400 hover:text-orange-300 transition-colors"
    >
      {aud === "students" ? "Students" : aud === "startups" ? "Startups" : "Open Source"}
    </Link>
  ))}
</div>
```

**Step 2: Add related category link**

```tsx
<Link
  href={`/category/${deal.category.toLowerCase()}`}
  className="text-[13px] text-zinc-500 hover:text-orange-400 transition-colors"
>
  Browse all {deal.category} deals →
</Link>
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git add src/app/deals/[slug]/page.tsx
git commit -m "feat(seo): add internal cross-links on deal pages (audience + category)"
```

---

## Phase 2: Blog Content (Tasks 6–9)

### Task 6: Convert "Free Cloud Credits" Article to MDX

**Files:**
- Create: `src/content/blog/free-cloud-credits-2026.mdx`
- Reference: `docs/articles/free-cloud-credits-2026.md`

**Step 1: Create MDX file with frontmatter**

Read `docs/articles/free-cloud-credits-2026.md` and convert to MDX. Add frontmatter:

```yaml
---
title: "I Found $200K+ in Free Cloud Credits — Here's How to Claim Them"
date: "2026-03-09"
description: "A comprehensive guide to claiming free cloud credits from AWS, Google Cloud, Azure, DigitalOcean, Vercel, Railway, and more in 2026."
tags: ["cloud", "aws", "gcp", "azure", "startup", "student", "free-credits"]
---
```

Convert the markdown content. Add internal links: wherever a tool is mentioned that has a deal page, link to `/deals/{slug}`. For example:
- "AWS Activate" → `[AWS Activate](/deals/aws-activate)`
- "Google Cloud" → `[Google Cloud](/deals/google-cloud)`
- "DigitalOcean" → `[DigitalOcean](/deals/digitalocean)`
- "Vercel" → `[Vercel](/deals/vercel)`
- "Railway" → `[Railway](/deals/railway)`

Add at the bottom:
```markdown
---

**Looking for more free tools?** Browse our [full catalog of 150+ deals](/deals) or check out tools [for students](/for/students), [for startups](/for/startups), or [for open source](/for/opensource).
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Blog post appears in build output.

**Step 3: Commit**

```bash
git add src/content/blog/free-cloud-credits-2026.mdx
git commit -m "content: add 'Free Cloud Credits 2026' blog post with deal links"
```

---

### Task 7: Convert "GitHub Student Pack Alternatives" Article to MDX

**Files:**
- Create: `src/content/blog/github-student-pack-alternatives.mdx`
- Reference: `docs/articles/github-student-pack-alternatives.md`

**Step 1: Create MDX file with frontmatter**

```yaml
---
title: "Beyond GitHub Student Pack: 150+ Free Tools You're Missing"
date: "2026-03-09"
description: "GitHub Student Developer Pack is just the beginning. Discover 150+ additional free tools for student developers in 2026."
tags: ["github", "student", "tools", "alternatives", "guide"]
---
```

Convert content from the draft. Add internal links to deal pages for every tool mentioned (same pattern as Task 6). Add footer links to `/deals`, `/for/students`, `/for/opensource`.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/content/blog/github-student-pack-alternatives.mdx
git commit -m "content: add 'Beyond GitHub Student Pack' blog post with deal links"
```

---

### Task 8: Convert "Startup Free Tools" Article to MDX

**Files:**
- Create: `src/content/blog/startup-free-tools-2026.mdx`
- Reference: `docs/articles/startup-free-tools-2026.md`

**Step 1: Create MDX file with frontmatter**

```yaml
---
title: "Launch Your Startup for $0: The Complete Free Tools Guide 2026"
date: "2026-03-09"
description: "Everything you need to launch a startup without spending money. Free tools for hosting, databases, design, analytics, and more."
tags: ["startup", "free-tools", "launch", "saas", "guide"]
---
```

Convert content, add internal deal links, add footer links. Same pattern as Tasks 6–7.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/content/blog/startup-free-tools-2026.mdx
git commit -m "content: add 'Launch Your Startup for $0' blog post with deal links"
```

---

### Task 9: Add Related Articles Block to Blog Posts

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Add related articles section**

After the MDX content render, add a related articles section. Get all posts, filter out current, take first 3 by date:

```tsx
import { getAllPosts } from "@/lib/blog";

// Inside the component:
const allPosts = getAllPosts();
const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

// In JSX, after article content:
{related.length > 0 && (
  <section className="mt-16 pt-8 border-t border-white/[0.06]">
    <h2 className="text-lg font-bold text-zinc-100 mb-4">Related Articles</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {related.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-4 hover:border-white/[0.12] transition-all">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">{post.title}</h3>
          <p className="text-xs text-zinc-500 line-clamp-2">{post.description}</p>
        </Link>
      ))}
    </div>
  </section>
)}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: add related articles section to blog posts"
```

---

## Phase 3: SEO Data Arrays (Tasks 10–13)

### Task 10: Add COMPARISON_SEO Data

**Files:**
- Modify: `src/data/seo-content.ts`

**Step 1: Add ComparisonSEO type and data**

```typescript
export type ComparisonSEO = {
  slug: string;       // "vercel-vs-railway"
  deal1Slug: string;  // "vercel"
  deal2Slug: string;  // "railway"
  title: string;
  metaDescription: string;
  intro: string;
  verdict: string;
};

export const COMPARISON_SEO: ComparisonSEO[] = [
  {
    slug: "vercel-vs-railway",
    deal1Slug: "vercel",
    deal2Slug: "railway",
    title: "Vercel vs Railway: Free Hosting Comparison 2026 | StudentPerks",
    metaDescription: "Compare Vercel and Railway free tiers for students and startups. Side-by-side features, pricing, and which is better for your project.",
    intro: "Both Vercel and Railway offer generous free tiers for developers. Vercel excels at frontend and serverless deployment, while Railway provides full-stack hosting with databases included.",
    verdict: "Choose Vercel for frontend/Next.js projects. Choose Railway for full-stack apps that need databases and background workers.",
  },
  {
    slug: "supabase-vs-mongodb",
    deal1Slug: "supabase",
    deal2Slug: "mongodb",
    title: "Supabase vs MongoDB Atlas: Free Database Comparison 2026 | StudentPerks",
    metaDescription: "Compare Supabase and MongoDB Atlas free tiers. PostgreSQL vs NoSQL, real-time vs aggregation, and which is better for students and startups.",
    intro: "Supabase offers a free PostgreSQL database with real-time subscriptions and auth. MongoDB Atlas provides a free NoSQL cluster with flexible schema and powerful aggregation pipeline.",
    verdict: "Choose Supabase for relational data with real-time needs. Choose MongoDB for flexible schemas and document-oriented workloads.",
  },
  {
    slug: "github-copilot-vs-cursor",
    deal1Slug: "github-copilot",
    deal2Slug: "cursor",
    title: "GitHub Copilot vs Cursor: Free AI Coding Tools 2026 | StudentPerks",
    metaDescription: "Compare GitHub Copilot (free for students) and Cursor free tier. AI code completion, features, and which is better for student developers.",
    intro: "GitHub Copilot is free for verified students and offers inline AI completions in VS Code. Cursor is an AI-first editor with a generous free tier that includes chat and code generation.",
    verdict: "Students should start with Copilot (completely free). Try Cursor's free tier if you want an integrated AI-first editing experience.",
  },
  {
    slug: "aws-vs-google-cloud",
    deal1Slug: "aws-activate",
    deal2Slug: "google-cloud",
    title: "AWS Activate vs Google Cloud Credits: Free Cloud Comparison 2026 | StudentPerks",
    metaDescription: "Compare AWS Activate and Google Cloud free credit programs for startups and students. Credits amount, eligibility, and which cloud to choose.",
    intro: "AWS Activate offers up to $100,000 in credits for startups. Google Cloud for Startups provides up to $200,000. Both have student programs with smaller but still significant credits.",
    verdict: "AWS has a larger ecosystem. Google Cloud offers more credits. Choose based on your tech stack and which services you need most.",
  },
  {
    slug: "figma-vs-framer",
    deal1Slug: "figma",
    deal2Slug: "framer",
    title: "Figma vs Framer: Free Design Tools 2026 | StudentPerks",
    metaDescription: "Compare Figma and Framer free plans for students and startups. Design capabilities, prototyping, and which is better for your workflow.",
    intro: "Figma is the industry-standard collaborative design tool with a generous free plan. Framer combines design with code-powered interactions and can publish directly to the web.",
    verdict: "Use Figma for team-based UI/UX design. Use Framer when you want design-to-production website building with interactions.",
  },
  {
    slug: "notion-vs-linear",
    deal1Slug: "notion",
    deal2Slug: "linear",
    title: "Notion vs Linear: Free Project Management 2026 | StudentPerks",
    metaDescription: "Compare Notion and Linear free plans for startups. Flexible workspace vs focused issue tracking, and which suits your team better.",
    intro: "Notion is an all-in-one workspace for docs, databases, and project management. Linear is a focused issue tracker built for speed and developer workflows.",
    verdict: "Use Notion for docs and flexible project management. Use Linear for fast, developer-centric issue tracking and sprint planning.",
  },
  {
    slug: "sentry-vs-datadog",
    deal1Slug: "sentry",
    deal2Slug: "datadog",
    title: "Sentry vs Datadog: Free Monitoring Tools 2026 | StudentPerks",
    metaDescription: "Compare Sentry and Datadog free tiers for error tracking and monitoring. Features, limits, and which is better for startups.",
    intro: "Sentry specializes in error tracking and performance monitoring with a generous free tier. Datadog offers full-stack observability with infrastructure monitoring, APM, and log management.",
    verdict: "Start with Sentry for error tracking. Add Datadog when you need infrastructure monitoring and APM at scale.",
  },
  {
    slug: "stripe-vs-lemonsqueezy",
    deal1Slug: "stripe",
    deal2Slug: "lemonsqueezy",
    title: "Stripe vs Lemon Squeezy: Free Payment Processing 2026 | StudentPerks",
    metaDescription: "Compare Stripe and Lemon Squeezy for startups. Payment processing features, pricing, and which is easier to set up.",
    intro: "Stripe is the most popular payment platform with startup credits available. Lemon Squeezy is an all-in-one platform handling payments, taxes, and subscriptions with simpler setup.",
    verdict: "Use Stripe for maximum flexibility and ecosystem. Use Lemon Squeezy for simplicity and built-in tax handling.",
  },
  {
    slug: "docker-vs-podman",
    deal1Slug: "docker",
    deal2Slug: "podman",
    title: "Docker vs Podman: Free Container Tools 2026 | StudentPerks",
    metaDescription: "Compare Docker (free for students) and Podman (always free). Container features, security, and which to choose for development.",
    intro: "Docker is the standard container platform with free access for students and open source. Podman is a daemonless, rootless container engine that's always free and compatible with Docker commands.",
    verdict: "Use Docker for ecosystem compatibility and Docker Desktop features. Use Podman for rootless security and no daemon requirement.",
  },
  {
    slug: "jetbrains-vs-vscode",
    deal1Slug: "jetbrains",
    deal2Slug: "vscode",
    title: "JetBrains vs VS Code: Free IDE Comparison 2026 | StudentPerks",
    metaDescription: "Compare JetBrains IDEs (free for students) and VS Code (always free). Features, performance, and which IDE is better for your workflow.",
    intro: "JetBrains offers professional IDEs free for students — IntelliJ, WebStorm, PyCharm, and more. VS Code is a free, lightweight editor with a massive extension ecosystem.",
    verdict: "Use JetBrains for deep language-specific features and refactoring. Use VS Code for lightweight editing and extension flexibility.",
  },
];
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors in seo-content.ts.

**Step 3: Commit**

```bash
git add src/data/seo-content.ts
git commit -m "feat(seo): add COMPARISON_SEO data (10 tool comparisons)"
```

---

### Task 11: Add USE_CASE_SEO Data

**Files:**
- Modify: `src/data/seo-content.ts`

**Step 1: Add UseCaseSEO type and data**

```typescript
export type UseCaseSEO = {
  slug: string;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  filterCategory?: Category;
  filterKeywords: string[];
  faqs: FAQ[];
};

export const USE_CASE_SEO: UseCaseSEO[] = [
  {
    slug: "best-free-databases-for-side-projects",
    title: "Best Free Databases for Side Projects 2026 | StudentPerks",
    metaDescription: "Find the best free databases for your side projects. Supabase, MongoDB Atlas, PlanetScale, and more with generous free tiers.",
    heading: "Best Free Databases for Side Projects",
    intro: "Building a side project? You don't need to pay for a database. These free-tier databases give you production-ready storage for hobby and side projects.",
    filterKeywords: ["database", "supabase", "mongodb", "postgres", "sql"],
    faqs: [
      { question: "What's the best free database for a beginner?", answer: "Supabase is great for beginners — it's PostgreSQL with a dashboard, auth, and real-time built in. MongoDB Atlas is also beginner-friendly if you prefer NoSQL." },
      { question: "Are free database tiers reliable for production?", answer: "Yes, for small to medium traffic. Most free tiers include automatic backups and 99.9% uptime SLAs. Upgrade when you outgrow the free limits." },
    ],
  },
  {
    slug: "best-free-hosting-for-students",
    title: "Best Free Hosting for Students 2026 | StudentPerks",
    metaDescription: "Free hosting platforms for student developers. Deploy your projects on Vercel, Railway, Render, and more with zero cost.",
    heading: "Best Free Hosting for Students",
    intro: "Deploy your projects for free. These hosting platforms offer generous free tiers perfect for student portfolios, class projects, and side projects.",
    filterCategory: "Cloud",
    filterKeywords: ["hosting", "deploy", "vercel", "railway", "render", "cloud"],
    faqs: [
      { question: "Can I host a full-stack app for free?", answer: "Yes! Railway and Render both support full-stack apps with databases on their free tiers. Vercel is best for frontend and serverless." },
      { question: "Will my free hosting handle traffic?", answer: "Free tiers handle moderate traffic well. For student projects and portfolios, you'll rarely hit limits. Most platforms allow easy scaling when needed." },
    ],
  },
  {
    slug: "best-free-design-tools-for-prototyping",
    title: "Best Free Design Tools for Prototyping 2026 | StudentPerks",
    metaDescription: "Free design and prototyping tools for students and startups. Figma, Framer, Canva, and more with free plans.",
    heading: "Best Free Design Tools for Prototyping",
    intro: "Create professional designs and prototypes without spending a dime. These design tools offer powerful free tiers for UI/UX design, prototyping, and graphics.",
    filterCategory: "Design",
    filterKeywords: ["design", "figma", "framer", "canva", "prototype", "ui"],
    faqs: [
      { question: "Is Figma still free for students?", answer: "Yes, Figma offers a free plan with up to 3 projects and unlimited personal files. Students can also apply for Figma for Education for additional features." },
      { question: "What's the best free tool for interactive prototypes?", answer: "Figma for standard prototyping, Framer for code-powered interactions and animations. Both have generous free tiers." },
    ],
  },
  {
    slug: "best-free-cicd-for-open-source",
    title: "Best Free CI/CD for Open Source 2026 | StudentPerks",
    metaDescription: "Free CI/CD pipelines for open source projects. GitHub Actions, GitLab CI, and more with unlimited builds for public repos.",
    heading: "Best Free CI/CD for Open Source Projects",
    intro: "Open source projects get the best CI/CD deals. Most platforms offer unlimited build minutes for public repositories, making automated testing and deployment completely free.",
    filterKeywords: ["ci", "cd", "pipeline", "github-actions", "gitlab", "build", "deploy"],
    faqs: [
      { question: "Is GitHub Actions free for open source?", answer: "Yes, GitHub Actions provides unlimited minutes for public repositories. It's the most popular choice for open source CI/CD." },
      { question: "What's the easiest CI/CD to set up?", answer: "GitHub Actions if you're already on GitHub — just add a YAML file. Vercel has zero-config deployments for frontend projects." },
    ],
  },
  {
    slug: "best-free-ai-tools-for-developers",
    title: "Best Free AI Tools for Developers 2026 | StudentPerks",
    metaDescription: "Free AI tools for developers. GitHub Copilot, OpenAI API credits, Cursor, and more AI-powered coding tools with free access.",
    heading: "Best Free AI Tools for Developers",
    intro: "AI is transforming development. Access the best AI coding tools for free through student programs, startup credits, and open source sponsorships.",
    filterCategory: "AI",
    filterKeywords: ["ai", "copilot", "openai", "cursor", "machine-learning", "gpt"],
    faqs: [
      { question: "Is GitHub Copilot free for students?", answer: "Yes, GitHub Copilot is completely free for verified students through the GitHub Student Developer Pack." },
      { question: "Can I get free OpenAI API credits?", answer: "Yes, OpenAI offers startup credits through their programs. Students can also access free tiers with limited usage." },
    ],
  },
  {
    slug: "best-free-monitoring-for-startups",
    title: "Best Free Monitoring Tools for Startups 2026 | StudentPerks",
    metaDescription: "Free monitoring and observability tools for startups. Sentry, Datadog, New Relic, and more with free startup credits.",
    heading: "Best Free Monitoring Tools for Startups",
    intro: "Don't fly blind. These monitoring tools offer free tiers and startup credits to help you track errors, performance, and infrastructure from day one.",
    filterKeywords: ["monitoring", "sentry", "datadog", "observability", "error", "apm"],
    faqs: [
      { question: "What monitoring should a startup set up first?", answer: "Start with error tracking (Sentry) and uptime monitoring. Add APM and infrastructure monitoring as you scale." },
      { question: "Are free monitoring tiers enough for early-stage?", answer: "Absolutely. Sentry's free tier handles 5K errors/month, which is plenty for pre-launch and early traction." },
    ],
  },
  {
    slug: "best-free-learning-platforms",
    title: "Best Free Learning Platforms for Developers 2026 | StudentPerks",
    metaDescription: "Free learning platforms for developers. Coursera, freeCodeCamp, and more with certificates and courses at no cost.",
    heading: "Best Free Learning Platforms for Developers",
    intro: "Level up your skills for free. These learning platforms offer free courses, certifications, and hands-on projects for developer education.",
    filterCategory: "Learning",
    filterKeywords: ["learning", "course", "education", "tutorial", "certification"],
    faqs: [
      { question: "Can I get free certificates?", answer: "Yes. freeCodeCamp offers free certificates. Coursera offers financial aid for certificates, and many platforms have free certificate tracks for students." },
      { question: "What's the best free platform for web development?", answer: "freeCodeCamp for structured curriculum, Coursera for university-level courses, and The Odin Project for project-based learning." },
    ],
  },
  {
    slug: "best-free-tools-for-hackathons",
    title: "Best Free Tools for Hackathons 2026 | StudentPerks",
    metaDescription: "Essential free tools for hackathons. Deploy fast with Vercel, build with Supabase, design with Figma — all free.",
    heading: "Best Free Tools for Hackathons",
    intro: "Win your next hackathon with the right free tools. Fast deployment, instant databases, collaborative design, and AI assistance — all at zero cost.",
    filterKeywords: ["hackathon", "deploy", "fast", "prototype", "team"],
    faqs: [
      { question: "What's the fastest way to deploy at a hackathon?", answer: "Vercel for frontend (zero-config deploys from Git), Railway for full-stack with databases. Both deploy in under a minute." },
      { question: "What backend should I use for a hackathon?", answer: "Supabase gives you a PostgreSQL database with auth and real-time in minutes. Perfect for hackathon speed." },
    ],
  },
  {
    slug: "best-free-saas-tools-for-mvp",
    title: "Best Free SaaS Tools to Build Your MVP 2026 | StudentPerks",
    metaDescription: "Free SaaS tools to build and launch your MVP. Authentication, payments, email, analytics, and more without spending money.",
    heading: "Best Free SaaS Tools to Build Your MVP",
    intro: "Build your MVP without a budget. These SaaS tools offer free tiers that cover everything from auth to payments to analytics.",
    filterCategory: "SaaS",
    filterKeywords: ["saas", "mvp", "auth", "payment", "email", "analytics"],
    faqs: [
      { question: "How much does it cost to build an MVP?", answer: "With free tools from StudentPerks, you can build and launch an MVP for $0. Hosting, database, auth, payments — all have free tiers." },
      { question: "What tools do I need for an MVP?", answer: "At minimum: hosting (Vercel/Railway), database (Supabase), auth (built into Supabase), and analytics (Vercel Analytics). All free." },
    ],
  },
  {
    slug: "best-free-tools-for-portfolio-websites",
    title: "Best Free Tools for Portfolio Websites 2026 | StudentPerks",
    metaDescription: "Build a stunning portfolio website for free. Hosting, domains, design tools, and deployment platforms at zero cost for students.",
    heading: "Best Free Tools for Portfolio Websites",
    intro: "Your portfolio is your first impression. Build and host a professional portfolio website for free using these developer tools and hosting platforms.",
    filterKeywords: ["portfolio", "website", "hosting", "domain", "design", "deploy"],
    faqs: [
      { question: "Can I get a free custom domain for my portfolio?", answer: "Yes! GitHub Student Developer Pack includes free .me and .tech domains. Namecheap also offers free .me domains for students." },
      { question: "What's the best free hosting for a portfolio?", answer: "Vercel or Netlify for static/Next.js sites. Both offer free HTTPS, global CDN, and custom domain support." },
    ],
  },
];
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1 | tail -10`

**Step 3: Commit**

```bash
git add src/data/seo-content.ts
git commit -m "feat(seo): add USE_CASE_SEO data (10 use-case landing pages)"
```

---

### Task 12: Add GUIDE_SEO Data

**Files:**
- Modify: `src/data/seo-content.ts`

**Step 1: Add GuideSEO type and data**

```typescript
export type GuideSEO = {
  slug: string;
  dealSlug: string;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  eligibility: string[];
  faqs: FAQ[];
};

export const GUIDE_SEO: GuideSEO[] = [
  {
    slug: "how-to-get-jetbrains-free",
    dealSlug: "jetbrains",
    title: "How to Get JetBrains IDEs Free for Students 2026 | StudentPerks",
    metaDescription: "Step-by-step guide to getting JetBrains IntelliJ, WebStorm, PyCharm, and all IDEs free with a student license in 2026.",
    heading: "How to Get JetBrains IDEs Free",
    intro: "JetBrains offers all their professional IDEs completely free for students. This includes IntelliJ IDEA Ultimate, WebStorm, PyCharm Professional, and 10+ other tools worth $699/year.",
    eligibility: ["Active student with .edu email", "Enrolled in accredited institution", "Student ID or enrollment document", "ISIC card (international students)"],
    faqs: [
      { question: "How long does the JetBrains student license last?", answer: "One year, renewable annually while you're a student. After graduation, you get 25% off your first year of professional license." },
      { question: "Which JetBrains IDEs are included?", answer: "All of them: IntelliJ IDEA Ultimate, WebStorm, PyCharm Professional, CLion, GoLand, DataGrip, Rider, RubyMine, and more." },
    ],
  },
  {
    slug: "how-to-get-github-copilot-free",
    dealSlug: "github-copilot",
    title: "How to Get GitHub Copilot Free for Students 2026 | StudentPerks",
    metaDescription: "Step-by-step guide to activating GitHub Copilot for free as a student through the GitHub Student Developer Pack in 2026.",
    heading: "How to Get GitHub Copilot Free",
    intro: "GitHub Copilot is free for verified students. It provides AI-powered code suggestions directly in your editor, helping you write code faster and learn new patterns.",
    eligibility: ["GitHub account", "Verified student status via GitHub Education", ".edu email or student ID", "Enrolled in degree-granting institution"],
    faqs: [
      { question: "Is GitHub Copilot really free for students?", answer: "Yes, 100% free. It's included in the GitHub Student Developer Pack at no cost." },
      { question: "Does it work in VS Code and JetBrains?", answer: "Yes, GitHub Copilot has extensions for VS Code, JetBrains IDEs, Neovim, and Visual Studio." },
    ],
  },
  {
    slug: "how-to-get-aws-credits",
    dealSlug: "aws-activate",
    title: "How to Get AWS Credits Free in 2026 | StudentPerks",
    metaDescription: "Complete guide to getting free AWS credits through AWS Activate, AWS Educate, and the GitHub Student Developer Pack.",
    heading: "How to Get Free AWS Credits",
    intro: "AWS offers multiple free credit programs. Startups can get up to $100,000 through AWS Activate. Students get credits through AWS Educate and the GitHub Student Developer Pack.",
    eligibility: ["AWS account (any)", "For Activate: startup or side project", "For Educate: .edu email", "For Student Pack: GitHub Education verified"],
    faqs: [
      { question: "How much AWS credit can I get?", answer: "Students: $100+ through Educate/Student Pack. Startups: $1,000-$100,000 through AWS Activate depending on tier and accelerator." },
      { question: "Do AWS credits expire?", answer: "Yes, typically within 1-2 years. Check your specific program terms for exact expiration dates." },
    ],
  },
  {
    slug: "how-to-get-vercel-pro-free",
    dealSlug: "vercel",
    title: "How to Get Vercel Pro Free for Students & OSS 2026 | StudentPerks",
    metaDescription: "Guide to getting Vercel Pro features free through their hobby plan, student programs, and open source sponsorship.",
    heading: "How to Get Vercel Pro Free",
    intro: "Vercel's free Hobby plan is already generous for personal projects. But students and open source maintainers can get Pro features free through Vercel's sponsorship programs.",
    eligibility: ["Vercel account", "For student: GitHub Education verified", "For OSS: active open source project", "Hobby plan: anyone (free by default)"],
    faqs: [
      { question: "What's included in Vercel's free plan?", answer: "Unlimited deployments, 100GB bandwidth, serverless functions, edge functions, and preview deployments. Perfect for most student projects." },
      { question: "Can I use a custom domain on free Vercel?", answer: "Yes, custom domains are supported on all plans including the free Hobby plan." },
    ],
  },
  {
    slug: "how-to-get-figma-free",
    dealSlug: "figma",
    title: "How to Get Figma Free for Students 2026 | StudentPerks",
    metaDescription: "How to get Figma's free plan and education features. Create unlimited personal files and get team features through Figma for Education.",
    heading: "How to Get Figma Free",
    intro: "Figma offers a generous free plan for everyone, plus enhanced features through Figma for Education. Students get professional design tools at zero cost.",
    eligibility: ["Email address (free plan)", "For Education: .edu email", "Student or educator at accredited institution", "Figma for Education application"],
    faqs: [
      { question: "What's free in Figma?", answer: "Unlimited personal files, 3 team projects, unlimited collaborators on personal files, and access to the community with thousands of free templates." },
      { question: "Is Figma for Education different from the free plan?", answer: "Yes, it adds unlimited team projects, version history, and additional collaboration features — all free for verified students and educators." },
    ],
  },
  {
    slug: "how-to-get-notion-free",
    dealSlug: "notion",
    title: "How to Get Notion Free for Students 2026 | StudentPerks",
    metaDescription: "Get Notion's Plus plan free as a student. Unlimited blocks, file uploads, and team features with .edu email verification.",
    heading: "How to Get Notion Free for Students",
    intro: "Notion's free plan is already capable, but students get the Plus plan free — unlimited blocks, file uploads, and 30-day page history. Just verify with your .edu email.",
    eligibility: [".edu email address", "Active student enrollment", "Notion account"],
    faqs: [
      { question: "What extra do students get vs the free plan?", answer: "Students get the Plus plan free: unlimited blocks (free plan has a limit), unlimited file uploads, 30-day version history, and bulk export." },
      { question: "Does it work with non-.edu student emails?", answer: "Contact Notion support with proof of enrollment if your school doesn't use .edu emails. They often accommodate international students." },
    ],
  },
  {
    slug: "how-to-get-docker-free",
    dealSlug: "docker",
    title: "How to Get Docker Desktop Free for Students & OSS 2026 | StudentPerks",
    metaDescription: "Docker Desktop is free for students, education, and open source projects. Learn how to qualify and set up your free license.",
    heading: "How to Get Docker Desktop Free",
    intro: "Docker Desktop is free for personal use, education, small businesses, and open source projects. Students and open source contributors get full Docker Desktop features at no cost.",
    eligibility: ["Personal/education use: anyone", "Open source: active OSS project", "Small business: <250 employees & <$10M revenue", "Student: enrolled in educational institution"],
    faqs: [
      { question: "Is Docker Desktop really free?", answer: "Yes, for personal use, education, small businesses (<250 employees), and open source. Only large enterprises need a paid subscription." },
      { question: "What's the difference between Docker Desktop and Docker Engine?", answer: "Docker Engine (CLI) is always free on Linux. Docker Desktop adds a GUI, Docker Compose, Kubernetes, and Dev Environments for macOS/Windows." },
    ],
  },
];
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1 | tail -10`

**Step 3: Commit**

```bash
git add src/data/seo-content.ts
git commit -m "feat(seo): add GUIDE_SEO data (7 how-to guides)"
```

---

### Task 13: Add TAG_SEO Data

**Files:**
- Modify: `src/data/seo-content.ts`

**Step 1: Add TagSEO type and data**

```typescript
export type TagSEO = {
  slug: string;
  label: string;
  description: string;
  metaDescription: string;
  keywords: string[];
};

export const TAG_SEO: TagSEO[] = [
  {
    slug: "database",
    label: "Database",
    description: "Free database tools and services for developers. PostgreSQL, MongoDB, Redis, and more with generous free tiers.",
    metaDescription: "Free database tools for developers. Supabase, MongoDB Atlas, PlanetScale, and more with production-ready free tiers.",
    keywords: ["database", "sql", "postgres", "mongo", "redis", "supabase", "mongodb"],
  },
  {
    slug: "hosting",
    label: "Hosting",
    description: "Free hosting platforms for web applications. Deploy frontend, full-stack, and API projects at zero cost.",
    metaDescription: "Free hosting for developers. Vercel, Railway, Render, Netlify, and more with generous free tiers for web apps.",
    keywords: ["hosting", "deploy", "vercel", "railway", "render", "netlify", "cloud"],
  },
  {
    slug: "ide",
    label: "IDE & Editors",
    description: "Free IDEs and code editors for students and developers. Professional tools at zero cost.",
    metaDescription: "Free IDEs for developers. JetBrains (free for students), VS Code, Cursor, and more professional code editors.",
    keywords: ["ide", "editor", "jetbrains", "vscode", "cursor", "intellij", "webstorm"],
  },
  {
    slug: "ci-cd",
    label: "CI/CD",
    description: "Free CI/CD pipelines and deployment automation. Build, test, and deploy your code automatically.",
    metaDescription: "Free CI/CD tools for developers. GitHub Actions, GitLab CI, CircleCI, and more with free build minutes.",
    keywords: ["ci", "cd", "pipeline", "github-actions", "gitlab", "build", "deploy", "automation"],
  },
  {
    slug: "monitoring",
    label: "Monitoring",
    description: "Free monitoring and observability tools. Track errors, performance, and uptime for your applications.",
    metaDescription: "Free monitoring tools for developers. Sentry, Datadog, New Relic, and more with free error tracking and APM.",
    keywords: ["monitoring", "sentry", "datadog", "observability", "error", "apm", "logging"],
  },
  {
    slug: "api",
    label: "APIs & Backend",
    description: "Free API tools and backend services. Authentication, storage, messaging, and more for your applications.",
    metaDescription: "Free API and backend tools for developers. Auth, storage, queues, and more with generous free tiers.",
    keywords: ["api", "backend", "auth", "storage", "messaging", "serverless", "function"],
  },
  {
    slug: "design",
    label: "Design",
    description: "Free design tools for developers and designers. UI/UX design, prototyping, and graphics at zero cost.",
    metaDescription: "Free design tools for developers. Figma, Framer, Canva, and more professional design tools with free plans.",
    keywords: ["design", "figma", "framer", "canva", "ui", "ux", "prototype", "graphics"],
  },
  {
    slug: "analytics",
    label: "Analytics",
    description: "Free analytics tools for web applications. Track visitors, events, and user behavior without paying.",
    metaDescription: "Free analytics tools for developers. Privacy-friendly analytics, event tracking, and user insights at zero cost.",
    keywords: ["analytics", "tracking", "visitors", "events", "metrics", "vercel-analytics"],
  },
];
```

**Step 2: Verify TypeScript**

Run: `npx tsc --noEmit 2>&1 | tail -10`

**Step 3: Commit**

```bash
git add src/data/seo-content.ts
git commit -m "feat(seo): add TAG_SEO data (8 tag landing pages)"
```

---

## Phase 4: New Route Pages (Tasks 14–17)

### Task 14: Create /compare/[slug] Comparison Pages

**Files:**
- Create: `src/app/compare/[slug]/page.tsx`

**Step 1: Create the comparison page**

Follow the pattern of `src/app/alternatives/[slug]/page.tsx` for structure. Key elements:

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, getDealBySlug, CATEGORY_CONFIG } from "@/lib/deals";
import { COMPARISON_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return COMPARISON_SEO.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmp = COMPARISON_SEO.find((c) => c.slug === slug);
  if (!cmp) return { title: "Not Found" };
  return {
    title: cmp.title,
    description: cmp.metaDescription,
    alternates: { canonical: `https://studentperks.dev/compare/${slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmp = COMPARISON_SEO.find((c) => c.slug === slug);
  if (!cmp) notFound();

  const deals = await getDeals();
  const deal1 = deals.find((d) => d.slug === cmp.deal1Slug);
  const deal2 = deals.find((d) => d.slug === cmp.deal2Slug);
  if (!deal1 || !deal2) notFound();

  // Build comparison table rows
  const rows = [
    { label: "Category", v1: deal1.category, v2: deal2.category },
    { label: "Value", v1: deal1.value, v2: deal2.value },
    { label: "Audiences", v1: deal1.audiences.join(", "), v2: deal2.audiences.join(", ") },
    { label: "Steps to Claim", v1: `${deal1.steps.length} steps`, v2: `${deal2.steps.length} steps` },
  ];

  // JSON-LD: use same pattern as alternatives/[slug]/page.tsx:49-71
  // BreadcrumbList: Home → Compare → "{deal1} vs {deal2}"

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb nav */}
      {/* Header with title and intro */}
      {/* Comparison table */}
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 text-zinc-500 font-medium">Feature</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{deal1.name}</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{deal2.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.04]">
                <td className="py-3 text-zinc-500">{row.label}</td>
                <td className="py-3 text-zinc-300">{row.v1}</td>
                <td className="py-3 text-zinc-300">{row.v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict section */}
      <div className="card p-6 mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Which Should You Choose?</h2>
        <p className="text-sm text-zinc-400">{cmp.verdict}</p>
      </div>

      {/* Deal cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        <DealCard deal={deal1} />
        <DealCard deal={deal2} />
      </div>

      {/* Other comparisons links */}
      {/* JSON-LD scripts */}
    </main>
  );
}
```

Include JSON-LD (BreadcrumbList) following the inline-script pattern from `alternatives/[slug]/page.tsx:122-123`.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: 10 comparison pages generated.

**Step 3: Commit**

```bash
git add src/app/compare/[slug]/page.tsx
git commit -m "feat: add /compare/[slug] comparison pages (10 comparisons)"
```

---

### Task 15: Create /best/[slug] Use-Case Pages

**Files:**
- Create: `src/app/best/[slug]/page.tsx`

**Step 1: Create the use-case page**

Follow `alternatives/[slug]/page.tsx` pattern. Filter deals by `filterCategory` and `filterKeywords`:

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { USE_CASE_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return USE_CASE_SEO.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = USE_CASE_SEO.find((u) => u.slug === slug);
  if (!useCase) return { title: "Not Found" };
  return {
    title: useCase.title,
    description: useCase.metaDescription,
    alternates: { canonical: `https://studentperks.dev/best/${slug}` },
  };
}

export default async function BestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = USE_CASE_SEO.find((u) => u.slug === slug);
  if (!useCase) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => {
    if (useCase.filterCategory && d.category !== useCase.filterCategory) return false;
    const haystack = `${d.name} ${d.tagline} ${d.description} ${d.slug}`.toLowerCase();
    return useCase.filterKeywords.some((kw) => haystack.includes(kw));
  });

  // JSON-LD: ItemList + BreadcrumbList (Home → Best → heading)
  // FAQPage JSON-LD for the FAQ section

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      {/* Header with heading and intro */}
      {/* Deals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {/* FAQ section */}
      {useCase.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">FAQ</h2>
          <div className="space-y-4">
            {useCase.faqs.map((faq, i) => (
              <div key={i} className="card p-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{faq.question}</h3>
                <p className="text-sm text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD scripts */}
    </main>
  );
}
```

Include FAQPage JSON-LD:
```typescript
const faqLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: useCase.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}).replace(/</g, "\\u003c");
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: 10 use-case pages generated.

**Step 3: Commit**

```bash
git add src/app/best/[slug]/page.tsx
git commit -m "feat: add /best/[slug] use-case landing pages (10 pages)"
```

---

### Task 16: Create /guides/[slug] How-To Pages

**Files:**
- Create: `src/app/guides/[slug]/page.tsx`

**Step 1: Create the guide page**

Follow similar pattern. Load the referenced deal by `dealSlug` and expand its `steps` into a full guide:

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDealBySlug, CATEGORY_CONFIG } from "@/lib/deals";
import { GUIDE_SEO } from "@/data/seo-content";

export const revalidate = 300;

export function generateStaticParams() {
  return GUIDE_SEO.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_SEO.find((g) => g.slug === slug);
  if (!guide) return { title: "Not Found" };
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `https://studentperks.dev/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDE_SEO.find((g) => g.slug === slug);
  if (!guide) notFound();

  const deal = await getDealBySlug(guide.dealSlug);
  if (!deal) notFound();

  const config = CATEGORY_CONFIG[deal.category];

  // HowTo JSON-LD
  const howToLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.heading,
    description: guide.intro,
    step: deal.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  }).replace(/</g, "\\u003c");

  // BreadcrumbList + FAQPage JSON-LD (same pattern)

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb: Home → Guides → heading */}
      {/* Header with heading and intro */}

      {/* Eligibility section */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-zinc-100 mb-3">Eligibility</h2>
        <ul className="space-y-2">
          {guide.eligibility.map((item, i) => (
            <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Value pill */}
      <div className="mb-8">
        <span className="value-pill">{deal.value}</span>
      </div>

      {/* Step-by-step guide */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Step-by-Step Guide</h2>
        <ol className="space-y-4">
          {deal.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-300 pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA link to deal page */}
      <Link
        href={`/deals/${deal.slug}`}
        className="btn-primary inline-flex items-center gap-2"
      >
        View Full Deal Details →
      </Link>

      {/* FAQ section */}
      {/* JSON-LD scripts */}
    </main>
  );
}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: 7 guide pages generated.

**Step 3: Commit**

```bash
git add src/app/guides/[slug]/page.tsx
git commit -m "feat: add /guides/[slug] how-to pages (7 guides)"
```

---

### Task 17: Create /tag/[slug] Tag Pages

**Files:**
- Create: `src/app/tag/[slug]/page.tsx`

**Step 1: Create the tag page**

Filter deals by matching tag keywords against deal name, tagline, description, and slug:

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { TAG_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return TAG_SEO.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = TAG_SEO.find((t) => t.slug === slug);
  if (!tag) return { title: "Not Found" };
  return {
    title: `Free ${tag.label} Tools 2026 | StudentPerks`,
    description: tag.metaDescription,
    alternates: { canonical: `https://studentperks.dev/tag/${slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = TAG_SEO.find((t) => t.slug === slug);
  if (!tag) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => {
    const haystack = `${d.name} ${d.tagline} ${d.description} ${d.slug}`.toLowerCase();
    return tag.keywords.some((kw) => haystack.includes(kw));
  });

  const otherTags = TAG_SEO.filter((t) => t.slug !== slug);

  // JSON-LD: ItemList + BreadcrumbList (Home → Tags → tag.label)

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{tag.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Free {tag.label} Tools
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{tag.description}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} tools &middot; Updated March 2026
        </p>
      </div>

      {/* Deals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {/* Related tags */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Related Tags</h2>
        <div className="flex flex-wrap gap-2">
          {otherTags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD scripts */}
    </main>
  );
}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: 8 tag pages generated.

**Step 3: Commit**

```bash
git add src/app/tag/[slug]/page.tsx
git commit -m "feat: add /tag/[slug] tag landing pages (8 tags)"
```

---

## Phase 5: Sitemap & Verification (Tasks 18–19)

### Task 18: Update Sitemap with All New Page Types

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Import new SEO arrays and add URL sections**

```typescript
import {
  CATEGORY_SEO, AUDIENCE_SEO, ALTERNATIVES_SEO,
  COMPARISON_SEO, USE_CASE_SEO, GUIDE_SEO, TAG_SEO,
} from "@/data/seo-content";

// Add these sections (same pattern as existing alternativesUrls):
const comparisonUrls: MetadataRoute.Sitemap = COMPARISON_SEO.map((c) => ({
  url: `${baseUrl}/compare/${c.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.7,
}));

const useCaseUrls: MetadataRoute.Sitemap = USE_CASE_SEO.map((u) => ({
  url: `${baseUrl}/best/${u.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.7,
}));

const guideUrls: MetadataRoute.Sitemap = GUIDE_SEO.map((g) => ({
  url: `${baseUrl}/guides/${g.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.7,
}));

const tagUrls: MetadataRoute.Sitemap = TAG_SEO.map((t) => ({
  url: `${baseUrl}/tag/${t.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.6,
}));
```

Add to the return array:
```typescript
return [
  // ... existing entries ...
  ...comparisonUrls,
  ...useCaseUrls,
  ...guideUrls,
  ...tagUrls,
];
```

Also update blog priority from `0.6` to `0.7` if not done in Task 4.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: Sitemap includes all new URLs. Total ~210+ pages.

**Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add comparison, best, guides, tag pages to sitemap"
```

---

### Task 19: Final Build Verification & Page Count

**Step 1: Run full build**

Run: `npm run build 2>&1 | tail -50`
Expected: Build succeeds. Page count should be ~210+ (was ~172).

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors.

**Step 3: Verify sitemap URL count**

Run: `npm run build 2>&1 | grep -c "\/"`
Or count the pages in build output.

**Step 4: Commit (if any fixes needed)**

```bash
git commit -m "fix: address build/lint issues from traffic growth implementation"
```

**Step 5: Final summary**

Report:
- Pages added
- Page types added
- Blog posts added
- Total indexed pages
- Any issues encountered
