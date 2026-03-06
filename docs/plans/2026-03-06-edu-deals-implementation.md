# EduDeals Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an MVP aggregator of free perks/deals for students, startups, and open source projects.

**Architecture:** Fully static Next.js (App Router, SSG). Deal data lives in a TypeScript file. Blog powered by MDX. Client-side filtering with React state. Deployed to Vercel.

**Tech Stack:** Next.js 15, Tailwind CSS v4, TypeScript, MDX, Inter font (next/font)

---

### Task 1: Project Scaffolding

**Files:**
- Create: project root via `create-next-app`
- Modify: `tailwind.config.ts` (custom theme)
- Modify: `src/app/layout.tsx` (Inter font, global layout)
- Modify: `src/app/globals.css` (base styles)

**Step 1: Initialize Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Clean up boilerplate**

Remove default content from `src/app/page.tsx`, replace with placeholder:

```tsx
export default function Home() {
  return <main><h1>EduDeals</h1></main>;
}
```

Clean `src/app/globals.css` — keep only Tailwind directives:

```css
@import "tailwindcss";
```

**Step 3: Configure layout with Inter font**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduDeals — Free Perks for Students, Startups & Open Source",
  description:
    "Discover free tools, services, and discounts available for students, startups, and open source projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 4: Verify dev server runs**

Run: `npm run dev`
Expected: App running at localhost:3000 with "EduDeals" heading.

**Step 5: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with Tailwind"
```

---

### Task 2: Data Model & Sample Data

**Files:**
- Create: `src/data/deals.ts`

**Step 1: Create data file with types and sample deals**

`src/data/deals.ts`:

```typescript
export type Category =
  | "Dev"
  | "AI"
  | "SaaS"
  | "Learning"
  | "Cloud"
  | "Design"
  | "Entertainment";

export type Audience = "students" | "startups" | "opensource";

export type Deal = {
  slug: string;
  name: string;
  logo: string;
  category: Category;
  audiences: Audience[];
  tagline: string;
  description: string;
  value: string;
  steps: string[];
  url: string;
  featured: boolean;
};

export const CATEGORY_CONFIG: Record<
  Category,
  { color: string; gradient: string; icon: string }
> = {
  Dev: { color: "blue", gradient: "from-blue-500 to-cyan-400", icon: "🛠" },
  AI: {
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    icon: "🤖",
  },
  SaaS: {
    color: "pink",
    gradient: "from-pink-500 to-rose-400",
    icon: "☁️",
  },
  Learning: {
    color: "amber",
    gradient: "from-amber-500 to-orange-400",
    icon: "📚",
  },
  Cloud: {
    color: "sky",
    gradient: "from-sky-500 to-blue-400",
    icon: "🌐",
  },
  Design: {
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    icon: "🎨",
  },
  Entertainment: {
    color: "red",
    gradient: "from-red-500 to-orange-400",
    icon: "🎮",
  },
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  students: "Students",
  startups: "Startups",
  opensource: "Open Source",
};

export const deals: Deal[] = [
  {
    slug: "github-education",
    name: "GitHub Student Developer Pack",
    logo: "/logos/github.svg",
    category: "Dev",
    audiences: ["students"],
    tagline: "Free access to 100+ developer tools",
    description:
      "The GitHub Student Developer Pack gives students free access to the best developer tools in one place. Includes GitHub Pro, free domains, cloud credits, and more.",
    value: "$200+/year",
    steps: [
      "Go to education.github.com",
      "Verify your student status with .edu email",
      "Get instant access to all partner offers",
    ],
    url: "https://education.github.com/pack",
    featured: true,
  },
  {
    slug: "notion-education",
    name: "Notion",
    logo: "/logos/notion.svg",
    category: "SaaS",
    audiences: ["students"],
    tagline: "Free Plus plan for students & educators",
    description:
      "Notion offers its Plus plan completely free for students and educators. Get unlimited blocks, file uploads, and 30-day version history.",
    value: "$96/year",
    steps: [
      "Sign up with your .edu email",
      "Go to Settings & Members",
      "Click 'Get free Education plan'",
    ],
    url: "https://www.notion.so/product/notion-for-education",
    featured: true,
  },
  {
    slug: "figma-education",
    name: "Figma",
    logo: "/logos/figma.svg",
    category: "Design",
    audiences: ["students"],
    tagline: "Free Professional plan for students",
    description:
      "Figma provides free access to its Professional plan for verified students. Includes unlimited projects, version history, and team libraries.",
    value: "$144/year",
    steps: [
      "Create a Figma account",
      "Apply at figma.com/education",
      "Verify with your .edu email",
    ],
    url: "https://www.figma.com/education/",
    featured: true,
  },
  {
    slug: "jetbrains-students",
    name: "JetBrains",
    logo: "/logos/jetbrains.svg",
    category: "Dev",
    audiences: ["students", "opensource"],
    tagline: "Free access to all JetBrains IDEs",
    description:
      "Get free access to all JetBrains professional developer tools including IntelliJ IDEA, PyCharm, WebStorm, and more.",
    value: "$649/year",
    steps: [
      "Go to jetbrains.com/student",
      "Apply with your .edu email or ISIC card",
      "Download any JetBrains IDE",
    ],
    url: "https://www.jetbrains.com/community/education/",
    featured: true,
  },
  {
    slug: "vercel-pro",
    name: "Vercel",
    logo: "/logos/vercel.svg",
    category: "Cloud",
    audiences: ["startups", "opensource"],
    tagline: "Free Pro plan for open source & startups",
    description:
      "Vercel offers sponsorship for open source projects and startup programs with Pro plan features including more bandwidth, builds, and team features.",
    value: "$240/year",
    steps: [
      "Apply at vercel.com/contact/sales",
      "Describe your open source or startup project",
      "Get approved for Pro plan",
    ],
    url: "https://vercel.com/guides/can-i-get-vercel-pro-for-open-source",
    featured: false,
  },
  {
    slug: "aws-activate",
    name: "AWS Activate",
    logo: "/logos/aws.svg",
    category: "Cloud",
    audiences: ["startups"],
    tagline: "Up to $100K in AWS credits for startups",
    description:
      "AWS Activate provides startups with credits, training, and support to get started on AWS. Founders tier gives $1K credits, Portfolio tier up to $100K.",
    value: "$100,000",
    steps: [
      "Go to aws.amazon.com/activate",
      "Choose Founders or Portfolio tier",
      "Apply with your startup details",
    ],
    url: "https://aws.amazon.com/activate/",
    featured: true,
  },
  {
    slug: "copilot-students",
    name: "GitHub Copilot",
    logo: "/logos/copilot.svg",
    category: "AI",
    audiences: ["students", "opensource"],
    tagline: "Free AI pair programming for students",
    description:
      "GitHub Copilot is free for verified students and open source maintainers. Get AI-powered code suggestions directly in your IDE.",
    value: "$100/year",
    steps: [
      "Verify student status on GitHub Education",
      "Enable Copilot in your GitHub settings",
      "Install the extension in your IDE",
    ],
    url: "https://github.com/features/copilot",
    featured: true,
  },
  {
    slug: "spotify-student",
    name: "Spotify Premium Student",
    logo: "/logos/spotify.svg",
    category: "Entertainment",
    audiences: ["students"],
    tagline: "Premium at half price for students",
    description:
      "Get Spotify Premium, Hulu, and SHOWTIME all for $5.99/month with a valid student email. Save over 50% compared to regular Premium.",
    value: "$72/year savings",
    steps: [
      "Go to spotify.com/student",
      "Verify your student status via SheerID",
      "Start your discounted subscription",
    ],
    url: "https://www.spotify.com/student/",
    featured: false,
  },
  {
    slug: "coursera-students",
    name: "Coursera for Campus",
    logo: "/logos/coursera.svg",
    category: "Learning",
    audiences: ["students"],
    tagline: "Free access to 3,800+ courses",
    description:
      "Coursera for Campus provides students with free access to over 3,800 courses from top universities and companies worldwide.",
    value: "$400+/year",
    steps: [
      "Check if your university is a Coursera partner",
      "Sign up with your .edu email",
      "Access courses through your campus portal",
    ],
    url: "https://www.coursera.org/campus/",
    featured: false,
  },
  {
    slug: "openai-api-startups",
    name: "OpenAI Startup Program",
    logo: "/logos/openai.svg",
    category: "AI",
    audiences: ["startups"],
    tagline: "API credits and support for AI startups",
    description:
      "OpenAI offers API credits, technical guidance, and go-to-market support for early-stage startups building with their API.",
    value: "$2,500+ credits",
    steps: [
      "Apply at openai.com/startups",
      "Describe your AI startup and use case",
      "Get approved for credits and support",
    ],
    url: "https://openai.com/",
    featured: false,
  },
];

export function getDealBySlug(slug: string): Deal | undefined {
  return deals.find((d) => d.slug === slug);
}

export function getDealsByCategory(category: Category): Deal[] {
  return deals.filter((d) => d.category === category);
}

export function getDealsByAudience(audience: Audience): Deal[] {
  return deals.filter((d) => d.audiences.includes(audience));
}

export function getFeaturedDeals(): Deal[] {
  return deals.filter((d) => d.featured);
}
```

**Step 2: Commit**

```bash
git add src/data/deals.ts && git commit -m "feat: add deal data model and sample deals"
```

---

### Task 3: Layout — Header & Footer

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx` (add Header/Footer)

**Step 1: Create Header**

`src/components/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          EduDeals
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/deals"
            className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            Browse Deals
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
```

**Step 2: Create Footer**

`src/components/Footer.tsx`:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-extrabold text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              EduDeals
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Discover free tools and perks for students, startups, and open
              source projects.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Links</h4>
            <div className="space-y-2">
              <Link href="/deals" className="block text-sm text-gray-500 hover:text-gray-700">Deals</Link>
              <Link href="/blog" className="block text-sm text-gray-500 hover:text-gray-700">Blog</Link>
              <Link href="/about" className="block text-sm text-gray-500 hover:text-gray-700">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"].map((cat) => (
                <span key={cat} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} EduDeals. Made for students, by students.
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Add to layout**

Update `src/app/layout.tsx` to include Header and Footer wrapping `{children}`.

**Step 4: Verify**

Run: `npm run dev`
Expected: Header with logo + nav, footer visible on page.

**Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add Header and Footer components"
```

---

### Task 4: DealCard & Badge Components

**Files:**
- Create: `src/components/DealCard.tsx`
- Create: `src/components/AudienceBadge.tsx`
- Create: `src/components/CategoryBadge.tsx`

**Step 1: Create CategoryBadge**

`src/components/CategoryBadge.tsx`:

```tsx
import { Category, CATEGORY_CONFIG } from "@/data/deals";

export default function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${config.gradient}`}
    >
      {config.icon} {category}
    </span>
  );
}
```

**Step 2: Create AudienceBadge**

`src/components/AudienceBadge.tsx`:

```tsx
import { Audience, AUDIENCE_LABELS } from "@/data/deals";

export default function AudienceBadge({ audience }: { audience: Audience }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
      {AUDIENCE_LABELS[audience]}
    </span>
  );
}
```

**Step 3: Create DealCard**

`src/components/DealCard.tsx`:

```tsx
import Link from "next/link";
import { Deal } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl overflow-hidden">
          {/* Placeholder for logo — use first letter if no image */}
          <span className="font-bold text-gray-400">{deal.name[0]}</span>
        </div>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          {deal.value}
        </span>
      </div>

      <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
        {deal.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{deal.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={deal.category} />
        {deal.audiences.map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
    </Link>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add DealCard, CategoryBadge, and AudienceBadge components"
```

---

### Task 5: Home Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build home page with Hero, Stats, Featured Deals, Audience sections**

`src/app/page.tsx`:

```tsx
import Link from "next/link";
import { deals, getFeaturedDeals, CATEGORY_CONFIG, Category } from "@/data/deals";
import DealCard from "@/components/DealCard";

const stats = [
  { label: "Free Deals", value: deals.length + "+" },
  { label: "Categories", value: Object.keys(CATEGORY_CONFIG).length.toString() },
  { label: "Potential Savings", value: "$10,000+" },
];

const audiences = [
  {
    title: "Students",
    description: "Got a .edu email? Unlock free pro plans, credits, and tools from top companies.",
    emoji: "🎓",
    href: "/deals?audience=students",
  },
  {
    title: "Startups",
    description: "Building something? Get cloud credits, free SaaS tools, and accelerator perks.",
    emoji: "🚀",
    href: "/deals?audience=startups",
  },
  {
    title: "Open Source",
    description: "Maintaining OSS? Access free CI/CD, hosting, and developer tools.",
    emoji: "💻",
    href: "/deals?audience=opensource",
  },
];

export default function Home() {
  const featured = getFeaturedDeals();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Free tools for{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              builders
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover {deals.length}+ free perks, tools, and discounts available for students,
            startups, and open source projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
            >
              Browse All Deals
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 text-base font-semibold text-gray-700 rounded-full border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-3 bg-white rounded-2xl shadow-lg shadow-gray-100 divide-x divide-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center py-6">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Featured{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Deals
            </span>
          </h2>
          <p className="mt-3 text-gray-500">The most popular perks our community loves</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((deal) => (
            <DealCard key={deal.slug} deal={deal} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            View all deals &rarr;
          </Link>
        </div>
      </section>

      {/* Audiences */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Who is this for?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all"
              >
                <div className="text-4xl mb-4">{a.emoji}</div>
                <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{a.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
            ([cat, config]) => (
              <Link
                key={cat}
                href={`/deals?category=${cat}`}
                className={`group flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all`}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  {cat}
                </span>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}
```

**Step 2: Verify**

Run: `npm run dev`
Expected: Full home page with hero, stats, featured deals grid, audience cards, categories.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build home page with hero, featured deals, and categories"
```

---

### Task 6: Deals Catalog Page with Filtering

**Files:**
- Create: `src/components/CategoryFilter.tsx`
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/DealsGrid.tsx` (client component with filtering logic)
- Create: `src/app/deals/page.tsx`

**Step 1: Create SearchBar**

`src/components/SearchBar.tsx`:

```tsx
"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search deals..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-sm"
      />
    </div>
  );
}
```

**Step 2: Create CategoryFilter**

`src/components/CategoryFilter.tsx`:

```tsx
"use client";

import { Category, CATEGORY_CONFIG } from "@/data/deals";

const categories = Object.keys(CATEGORY_CONFIG) as Category[];

export default function CategoryFilter({
  selected,
  onChange,
}: {
  selected: Category | null;
  onChange: (c: Category | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === null
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(selected === cat ? null : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? `bg-gradient-to-r ${CATEGORY_CONFIG[cat].gradient} text-white shadow-md`
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {CATEGORY_CONFIG[cat].icon} {cat}
        </button>
      ))}
    </div>
  );
}
```

**Step 3: Create DealsGrid (client component with all filtering)**

`src/components/DealsGrid.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { Deal, Category, Audience } from "@/data/deals";
import DealCard from "./DealCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

const audienceOptions: { value: Audience | null; label: string }[] = [
  { value: null, label: "Everyone" },
  { value: "students", label: "🎓 Students" },
  { value: "startups", label: "🚀 Startups" },
  { value: "opensource", label: "💻 Open Source" },
];

export default function DealsGrid({
  deals,
  initialCategory,
  initialAudience,
}: {
  deals: Deal[];
  initialCategory?: Category;
  initialAudience?: Audience;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(initialCategory ?? null);
  const [audience, setAudience] = useState<Audience | null>(initialAudience ?? null);

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      if (category && deal.category !== category) return false;
      if (audience && !deal.audiences.includes(audience)) return false;
      if (
        search &&
        !deal.name.toLowerCase().includes(search.toLowerCase()) &&
        !deal.tagline.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [deals, category, audience, search]);

  return (
    <div>
      <div className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAudience(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                audience === opt.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No deals found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} deal{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

**Step 4: Create deals page**

`src/app/deals/page.tsx`:

```tsx
import { Metadata } from "next";
import { deals } from "@/data/deals";
import DealsGrid from "@/components/DealsGrid";

export const metadata: Metadata = {
  title: "All Deals — EduDeals",
  description: "Browse all free tools and perks for students, startups, and open source projects.",
};

export default function DealsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          All{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Deals
          </span>
        </h1>
        <p className="mt-2 text-gray-500">
          Find the perfect perk for your project
        </p>
      </div>
      <DealsGrid deals={deals} />
    </main>
  );
}
```

**Step 5: Verify**

Run: `npm run dev`, go to `/deals`.
Expected: Catalog with search, category filters, audience filters, and deal cards.

**Step 6: Commit**

```bash
git add src/components/ src/app/deals/
git commit -m "feat: add deals catalog page with search and filtering"
```

---

### Task 7: Deal Detail Page

**Files:**
- Create: `src/app/deals/[slug]/page.tsx`

**Step 1: Create deal detail page with SSG**

`src/app/deals/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deals, getDealBySlug, getDealsByCategory } from "@/data/deals";
import CategoryBadge from "@/components/CategoryBadge";
import AudienceBadge from "@/components/AudienceBadge";
import DealCard from "@/components/DealCard";

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const deal = getDealBySlug(params.slug);
  if (!deal) return { title: "Deal Not Found" };
  return {
    title: `${deal.name} — ${deal.tagline} | EduDeals`,
    description: deal.description,
  };
}

export default function DealPage({ params }: { params: { slug: string } }) {
  const deal = getDealBySlug(params.slug);
  if (!deal) notFound();

  const related = getDealsByCategory(deal.category)
    .filter((d) => d.slug !== deal.slug)
    .slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/deals" className="hover:text-purple-600">Deals</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{deal.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
          <span className="font-bold text-gray-400">{deal.name[0]}</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{deal.name}</h1>
          <p className="mt-2 text-lg text-gray-500">{deal.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CategoryBadge category={deal.category} />
            {deal.audiences.map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Value badge */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 mb-8">
        <div className="text-sm text-emerald-600 font-medium">Estimated Value</div>
        <div className="text-3xl font-extrabold text-emerald-700 mt-1">{deal.value}</div>
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none mb-8">
        <h2 className="text-xl font-bold">About this deal</h2>
        <p className="text-gray-600 leading-relaxed">{deal.description}</p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">How to get it</h2>
        <div className="space-y-3">
          {deal.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
      >
        Get this deal &rarr;
      </a>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((d) => (
              <DealCard key={d.slug} deal={d} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

**Step 2: Verify**

Run: `npm run dev`, click on a deal card.
Expected: Full deal page with description, steps, CTA, related deals.

**Step 3: Commit**

```bash
git add src/app/deals/
git commit -m "feat: add deal detail page with steps and related deals"
```

---

### Task 8: About Page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Create about page**

`src/app/about/page.tsx`:

```tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — EduDeals",
  description: "Learn about EduDeals and our mission to help students, startups, and open source projects.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        About{" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          EduDeals
        </span>
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed">
          EduDeals is a curated directory of free tools, services, and perks available for
          students, startups, and open source projects. We aggregate the best deals so you
          don&apos;t have to hunt for them.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Many amazing companies offer free or heavily discounted plans for students,
          early-stage startups, and open source maintainers. But these offers are scattered
          across hundreds of websites. We bring them all together in one place.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">Want to suggest a deal?</h2>
        <p className="text-gray-600 leading-relaxed">
          Know of a service that offers free perks? We&apos;d love to hear about it!
          Open an issue on our{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            GitHub repository
          </a>{" "}
          or reach out to us directly.
        </p>
      </div>

      <div className="mt-12">
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
        >
          Browse Deals &rarr;
        </Link>
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/about/
git commit -m "feat: add about page"
```

---

### Task 9: Blog with MDX

**Files:**
- Install: `next-mdx-remote`, `gray-matter`
- Create: `src/lib/blog.ts` (MDX loading utilities)
- Create: `src/content/blog/getting-started-github-student-pack.mdx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`

**Step 1: Install MDX dependencies**

```bash
npm install next-mdx-remote gray-matter
```

**Step 2: Create blog utility**

`src/lib/blog.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title ?? "",
        date: data.date ?? "",
        description: data.description ?? "",
        tags: data.tags ?? [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
```

**Step 3: Create sample blog post**

`src/content/blog/getting-started-github-student-pack.mdx`:

```mdx
---
title: "How to Get the GitHub Student Developer Pack"
date: "2026-03-01"
description: "A step-by-step guide to claiming your free GitHub Student Developer Pack with over 100 developer tools."
tags: ["guide", "github", "students"]
---

The GitHub Student Developer Pack is one of the best deals available for students. Here's how to get it.

## What's Included

The pack includes free access to over 100 developer tools, including:

- **GitHub Pro** — unlimited private repos, advanced code review
- **JetBrains IDEs** — all professional tools free
- **Namecheap** — free .me domain for a year
- **DigitalOcean** — $200 in cloud credits
- **And much more...**

## Requirements

- Be at least 13 years old
- Be currently enrolled in a degree-granting course of study
- Have a school-issued email address (.edu) or documents proving student status

## Steps to Apply

1. Visit [education.github.com](https://education.github.com)
2. Click "Get your pack"
3. Sign in with your GitHub account
4. Select your school email or add one
5. Upload proof of academic status if needed
6. Wait for verification (usually instant to a few days)

## Tips for Faster Approval

- Use your `.edu` email — it speeds up verification significantly
- If uploading documents, use a clear photo of your student ID
- Make sure your GitHub profile has a bio and profile picture

Once approved, head to the partner offers page to start claiming your free tools!
```

**Step 4: Create blog list page**

`src/app/blog/page.tsx`:

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — EduDeals",
  description: "Guides, tips, and roundups to help you get the most out of student and startup perks.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Blog
        </span>
      </h1>
      <p className="text-gray-500 mb-10">Guides and tips for getting the best deals</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
```

**Step 5: Create blog post page**

`src/app/blog/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | EduDeals Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/blog" className="hover:text-purple-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{post.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{post.title}</h1>
          <div className="mt-3 flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-a:text-purple-600 hover:prose-a:text-purple-700">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link href="/blog" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
          &larr; Back to all posts
        </Link>
      </div>
    </main>
  );
}
```

**Step 6: Verify**

Run: `npm run dev`, go to `/blog` and click the post.
Expected: Blog list with the sample post, clickable into full MDX-rendered article.

**Step 7: Commit**

```bash
git add src/lib/ src/content/ src/app/blog/ package.json package-lock.json
git commit -m "feat: add blog with MDX support and sample post"
```

---

### Task 10: Final Polish & Build Verification

**Files:**
- Modify: `src/app/layout.tsx` (add Header/Footer if not done in Task 3)
- Verify: all pages build correctly

**Step 1: Ensure layout includes Header and Footer**

Verify `src/app/layout.tsx` wraps children with Header and Footer.

**Step 2: Run production build**

```bash
npm run build
```

Expected: All pages generated successfully, no errors.

**Step 3: Test production build locally**

```bash
npm start
```

Walk through: Home → Deals → Deal detail → About → Blog → Blog post.

**Step 4: Final commit**

```bash
git add -A && git commit -m "chore: final polish and build verification"
```
