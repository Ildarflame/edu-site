# Viral Community Posts — StudentPerks Launch

## General Tips

- **Reddit**: пости в будний день, 9-11am EST. Ссылка только в первом комменте (Reddit фильтрует URL в теле поста). Целевые сабреддиты: r/college, r/computerscience, r/webdev, r/learnprogramming, r/sidehustle
- **Hacker News**: пости в будний день, 8-10am EST. Заголовок "Show HN:" обязателен для своих проектов. Технический тон, минимум маркетинга.
- **Twitter/X**: пости thread утром (8-9am по часовому поясу аудитории). Первый tweet — hook без ссылки. Ссылка в последнем твите.
- **Product Hunt**: запуск во вторник-четверг, 00:01 PST. Попроси 5-10 людей оставить upvote с комментарием в первые 2 часа. Maker comment сразу после запуска.

---

## Reddit

### Post

**Title:** I spent 2 weeks verifying every free tool students can actually get in 2026. Here's 126 of them.

**Body:**

I'm a developer and I got tired of those "free stuff for students" lists that are either outdated, full of dead links, or just list free tiers anyone can get.

So I went through every major education program myself — GitHub Education, JetBrains, Adobe, AWS, Azure, Apple, Spotify, you name it — and verified what's actually available right now.

Some things I learned:

- The GitHub Student Developer Pack alone is worth $200+/year and unlocks ~100 partner offers with a single verification
- JetBrains gives you ALL their IDEs free ($649/year value). Not a trial. The full thing.
- Adobe CC is 60% off for students — that's Photoshop, Premiere, the whole suite for ~$23/month
- Azure gives $100 credits with NO credit card. AWS Educate is separate from AWS Activate (different programs, different credits)
- Apple Education Pricing saves up to $400 on hardware + free AirPods during back-to-school
- Spotify + Hulu + SHOWTIME bundle is $5.99/month for students

The biggest surprise: most students I talked to only knew about 2-3 of these. There's easily $500K+ in combined value if you claim everything relevant to you.

I organized them all by category (dev tools, cloud, AI, design, learning, entertainment) with step-by-step claim instructions for each one.

Happy to answer questions about any specific deal or verification process.

**EDIT:** Link in first comment since Reddit filters URLs in posts.

### First comment (OP)

> Here's the full list with claim guides: studentperks.dev/free-tools-for-students
>
> It's open source, no affiliate links, no paywalls. Just the deals.

### Prepared reply — "Is X still working?"

> Just re-verified last week. {Tool} still works — you need to {specific step}. The trick most people miss is {detail}. I update the list every few weeks to catch anything that expires.

### Prepared reply — "Why not just use the free tier?"

> Free tiers ≠ student deals. For example, JetBrains free = Community Edition (limited). Student = Ultimate with all plugins ($649 value). Same with Figma — free plan is 3 projects, education plan is unlimited. Big difference.

### Prepared reply — "How is this different from the GitHub Pack?"

> The GitHub Pack is amazing but it's ~100 tools. There are another 50+ student deals from companies that aren't GitHub partners — Adobe, Apple, Spotify, Amazon Prime, Coursera, and others with their own education programs. This lists everything in one place.

---

## Hacker News

### Post

**Title:** Show HN: StudentPerks — 126 verified free tools and credits for students

**Body:**

Hey HN,

I built a directory of free tools for students after realizing how fragmented this information is. Every "student deals" list I found was either a markdown file last updated in 2023 or a blog post with affiliate links.

The site: studentperks.dev

What it does:
- Lists 126+ verified deals (JetBrains, GitHub, AWS, Azure, Adobe, etc.)
- Step-by-step claim guides for each
- Filters by category (dev, cloud, AI, design) and audience (students, startups, OSS)
- Programmatic SEO pages so each tool is independently searchable

Tech: Next.js 16 (App Router, SSG), Tailwind v4, Notion as CMS, Vercel. All deals are fetched from a Notion database at build time with ISR. No backend, no auth, no tracking beyond Vercel Analytics.

What I learned building this:
- Notion API as a CMS works surprisingly well for < 500 records
- `useSyncExternalStore` is the right way to handle localStorage in React 19 (not useState + useEffect)
- Programmatic SEO with Next.js generateStaticParams scales well — we prerender 300+ pages

The hardest part wasn't the code — it was verifying each deal. Companies change their programs quietly, links rot, and "free for students" sometimes means "free trial with .edu email."

No affiliate links. Happy to discuss the tech or add tools I missed.

### Prepared reply — "Why not just a GitHub awesome-list?"

> I actually maintain one too (github.com/Ildarflame/awesome-student-developer-deals). But a static list can't do filtering, search, step-by-step guides, or SEO pages that rank for "[tool] student discount". The site and the list serve different purposes.

### Prepared reply — "Notion as CMS?"

> Works great for this scale. Direct fetch to Notion REST API, parsed with Zod, cached with unstable_cache + ISR (5 min). Fallback to hardcoded data if Notion is down. The editorial workflow is just editing a Notion table — no deploy needed.

---

## Twitter / X

### Thread

**Tweet 1 (hook):**

I verified every free tool students can get in 2026.

126 tools. $500K+ in total value.

Most students only know about 3-4 of them.

Here are the ones actually worth claiming: 🧵

**Tweet 2:**

Developer Tools (free, not "free tier"):

→ JetBrains — ALL IDEs, $649/yr value
→ GitHub Copilot — free with Student Pack
→ Docker Pro — free for students & OSS
→ MongoDB Atlas — free cluster forever + student credits

**Tweet 3:**

Cloud Credits (real money):

→ Azure — $100, no credit card needed
→ AWS Activate — up to $100K for startups
→ DigitalOcean — $200 via GitHub Education
→ Railway — free hosting for OSS projects

**Tweet 4:**

Design & Creative:

→ Adobe CC — 60% off (all 20+ apps)
→ Figma — free Professional plan
→ Canva — free Pro for students

**Tweet 5:**

The ones people always forget:

→ Apple Education — up to $400 off Mac + free AirPods
→ Amazon Prime Student — 6 months FREE then 50% off
→ Spotify + Hulu + SHOWTIME — $5.99/mo
→ YouTube Premium — student rate saves $66/yr

**Tweet 6:**

I built a site with all 126 deals, step-by-step claim guides, and filters by category.

No affiliate links. No paywall. Just the tools.

studentperks.dev/free-tools-for-students

If I missed one, reply and I'll add it.

### Prepared reply for engagement:

> Most underrated one IMO: the GitHub Student Developer Pack. You verify once and it unlocks ~100 partner tools. It's the single best starting point.

---

## Product Hunt

### Tagline

Free tools, credits & pro plans for students — 126 verified deals worth $500K+

### Description

**The Problem**

Student deals are scattered across hundreds of websites. Lists get outdated. Links break. "Free for students" often means a limited trial. Students miss thousands of dollars in tools they're eligible for.

**The Solution**

StudentPerks is a curated, verified directory of 126+ free tools for students. Every deal has step-by-step claim instructions, value estimates, and direct links to the education program (not the homepage).

**What's included:**
- 🛠 Developer tools (JetBrains, GitHub, Docker, Supabase)
- 🤖 AI tools (GitHub Copilot, OpenAI credits)
- 🌐 Cloud credits (AWS, Azure, DigitalOcean, Railway)
- 🎨 Design (Adobe CC 60% off, Figma Pro free)
- 📚 Learning (Coursera, DataCamp)
- 🎮 Entertainment (Spotify, Amazon Prime, Apple discounts)

**Built with:**
Next.js 16, Tailwind CSS v4, Notion CMS, Vercel

No affiliate links. No tracking. Open source.

### Maker comment

> Hey PH! I built this because I kept finding the same problem — fragmented student deals across dozens of sites, half of them outdated.
>
> The hardest part was actually verifying each deal. Companies quietly change programs, rename URLs, or add new restrictions. I re-verify every few weeks.
>
> I'd love feedback on:
> 1. Any tools I'm missing?
> 2. Which categories should I expand first?
>
> The site is free and always will be. Trying to be the "one link" students can bookmark.

### Prepared replies

**"How do you keep it updated?"**

> Notion CMS + ISR (auto-rebuilds every 5 min). For manual verification, I check each deal every 2-3 weeks. Community reports help too — there's a submit form on the site.

**"Will you add [country] deals?"**

> Right now it's mostly global/US programs. Country-specific deals are on the roadmap — I already have region filtering built in (US/EU/UK/Asia). If you know local programs, submit them and I'll verify.
