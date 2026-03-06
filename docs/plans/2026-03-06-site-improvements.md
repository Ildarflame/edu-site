# EduDeals Site Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship 11 improvements to make EduDeals production-ready: deploy, SEO, UX filters, newsletter, submit form, animations, and content.

**Architecture:** All changes are additive — no rewrites. Server components fetch from Notion CMS via `src/lib/deals.ts`. Client components handle interactivity. Vercel handles deploy + ISR revalidation.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Notion API, TypeScript, Vercel

---

### Task 1: Bigger logos in deal cards (32x32)

**Files:**
- Modify: `src/components/DealCard.tsx` — change Image width/height from 20 to 32
- Modify: `src/app/deals/[slug]/page.tsx` — change Image width/height from 24 to 36

**Step 1:** In `DealCard.tsx`, change `width={20} height={20}` to `width={32} height={32}`, container `w-10 h-10` to `w-11 h-11`.

**Step 2:** In `deals/[slug]/page.tsx`, change `width={24} height={24}` to `width={36} height={36}`, container `w-12 h-12` to `w-14 h-14`.

**Step 3:** Verify visually at localhost:3000 and a deal page.

**Step 4:** Commit: `git commit -m "style: increase logo size in deal cards and pages"`

---

### Task 2: URL params for filters on /deals

**Files:**
- Modify: `src/components/DealsGrid.tsx` — sync state with URL searchParams via `useSearchParams` and `useRouter`
- Modify: `src/app/deals/page.tsx` — wrap DealsGrid in `<Suspense>`

**Step 1:** Add `useSearchParams`, `useRouter` imports. Initialize filter state from URL params (`q`, `category`, `audience`). Add `useEffect` to sync state changes back to URL via `router.replace`.

**Step 2:** Wrap `<DealsGrid>` in `<Suspense fallback={null}>` in deals/page.tsx.

**Step 3:** Verify — select filters, check URL updates. Copy URL → new tab → filters restored.

**Step 4:** Commit: `git commit -m "feat: sync deal filters with URL search params"`

---

### Task 3: Sort deals

**Files:**
- Modify: `src/components/DealsGrid.tsx` — add sort dropdown and sort logic

**Step 1:** Add sort options (Name A-Z, Name Z-A, Featured first). Add sort state synced to URL param `sort`. Add `useMemo` to sort filtered results. Add styled `<select>` element.

**Step 2:** Verify — change sort, check order and URL.

**Step 3:** Commit: `git commit -m "feat: add sort options to deals grid"`

---

### Task 4: Scroll animations with IntersectionObserver

**Files:**
- Create: `src/components/ScrollReveal.tsx`
- Modify: `src/app/page.tsx` — wrap sections

**Step 1:** Create `ScrollReveal` — client component using IntersectionObserver. On intersect, transition from `opacity-0 translate-y-8` to `opacity-100 translate-y-0` with `duration-700`.

**Step 2:** Wrap Featured Deals, Audiences, Categories, Stats sections in `<ScrollReveal>`.

**Step 3:** Verify — scroll page, sections fade in.

**Step 4:** Commit: `git commit -m "feat: add scroll-triggered reveal animations"`

---

### Task 5: OG images

**Files:**
- Create: `src/app/opengraph-image.tsx` — homepage OG
- Create: `src/app/deals/[slug]/opengraph-image.tsx` — per-deal OG

**Step 1:** Homepage OG — use `ImageResponse` from `next/og`. Dark background (#050507), "EduDeals" title, tagline. 1200x630.

**Step 2:** Deal OG — read slug from params, fetch deal, show deal name + value + category.

**Step 3:** Verify — visit `/opengraph-image` and `/deals/github-education/opengraph-image`.

**Step 4:** Commit: `git commit -m "feat: add OG images for homepage and deal pages"`

---

### Task 6: Sitemap.xml

**Files:**
- Create: `src/app/sitemap.ts`

**Step 1:** Export async function that returns MetadataRoute.Sitemap. Include /, /deals, /about, /blog, and all deal slugs from `getDeals()`. Use `changeFrequency` and `lastModified`.

**Step 2:** Verify — `npm run build` or visit `/sitemap.xml`.

**Step 3:** Commit: `git commit -m "feat: add auto-generated sitemap.xml"`

---

### Task 7: JSON-LD structured data

**Files:**
- Modify: `src/app/layout.tsx` — add WebSite schema
- Modify: `src/app/deals/[slug]/page.tsx` — add Product schema per deal

**Step 1:** Add `<script type="application/ld+json">` in layout.tsx `<head>` with WebSite schema (name, url, description). Use static trusted content only — no user input.

**Step 2:** Add Product JSON-LD in deal pages before `</main>`. Fields: name, description, url, offers (price: "0", priceCurrency: "USD"). All data comes from our trusted Notion CMS, not user input.

**Step 3:** Verify — view page source, check JSON-LD. Test with Google Rich Results Test.

**Step 4:** Commit: `git commit -m "feat: add JSON-LD structured data for SEO"`

---

### Task 8: "Submit a deal" page

**Files:**
- Create: `src/app/submit/page.tsx`
- Modify: `src/components/Footer.tsx` — add link

**Step 1:** Create form page with fields: Deal Name, URL, Description, Category (select), Audience (multi-select). Dark themed inputs. On submit, open `mailto:deals@edudeals.com` with pre-filled body. (MVP — no backend needed.)

**Step 2:** Add "Submit a Deal" link in Footer.

**Step 3:** Verify — visit /submit, fill form, test.

**Step 4:** Commit: `git commit -m "feat: add submit-a-deal page"`

---

### Task 9: Email newsletter signup

**Files:**
- Create: `src/components/NewsletterForm.tsx`
- Create: `src/app/api/subscribe/route.ts` — saves email to Notion
- Modify: `src/app/page.tsx` — add section
- Modify: `src/components/Footer.tsx` — add compact form

**Step 1:** Create `NewsletterForm` client component — email input + button. On submit, POST to `/api/subscribe`.

**Step 2:** Create API route that adds email to a new Notion database "Subscribers" (create via API if needed, or just add page to existing DB). Return success/error JSON.

**Step 3:** Add newsletter CTA section to homepage before stats. Heading: "Never miss a deal".

**Step 4:** Add compact version to Footer.

**Step 5:** Verify — enter email, check Notion.

**Step 6:** Commit: `git commit -m "feat: add email newsletter signup with Notion backend"`

---

### Task 10: Blog guides for SEO

**Files:**
- Create: `src/content/blog/how-to-get-github-student-pack.mdx`
- Create: `src/content/blog/best-free-tools-for-startups-2026.mdx`
- Create: `src/content/blog/aws-activate-guide.mdx`

**Step 1:** Write 3 posts (500-800 words each) with frontmatter (title, description, date). Practical step-by-step content with internal links to deal pages.

**Step 2:** Verify — /blog shows all posts, individual pages render.

**Step 3:** Commit: `git commit -m "content: add 3 SEO blog guides"`

---

### Task 11: Deploy to Vercel

**Step 1:** Install Vercel CLI: `npm i -g vercel`

**Step 2:** Deploy: `npx vercel --prod`

**Step 3:** Set env vars in Vercel dashboard: `NOTION_TOKEN`, `NOTION_DEALS_DATABASE_ID`.

**Step 4:** Trigger redeploy: `npx vercel --prod`

**Step 5:** Update `src/app/sitemap.ts` baseUrl with actual Vercel URL.

**Step 6:** Verify all pages on production.

**Step 7:** Commit and push: `git commit -m "chore: update sitemap with production URL" && git push`
