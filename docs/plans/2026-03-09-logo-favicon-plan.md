# Logo & Favicon Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a custom lightning bolt logo as favicon, PWA icons, header icon, and OG image accent.

**Architecture:** Create an SVG bolt icon, use it as `icon.svg` for favicon, generate PNGs for PWA/apple-touch via a sharp script, update Header component with inline bolt SVG, add bolt to OG image background.

**Tech Stack:** Next.js 16 (App Router), SVG, sharp (Next.js dependency), ImageResponse (next/og)

---

### Task 1: Create Bolt SVG Icon

**Files:**
- Create: `src/app/icon.svg`
- Delete: `src/app/favicon.ico`

**Step 1: Create the SVG bolt icon**

Create `src/app/icon.svg` — a lightning bolt with orange-to-amber gradient on transparent background, viewBox `0 0 32 32`, rounded line caps, slight tilt.

**Step 2: Delete old favicon**

```bash
rm src/app/favicon.ico
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -10`

**Step 4: Commit**

```bash
git add src/app/icon.svg
git rm src/app/favicon.ico
git commit -m "feat: add bolt SVG favicon, remove default ico"
```

---

### Task 2: Generate PWA & Apple Touch PNGs

**Files:**
- Create: `scripts/generate-icons.mjs`
- Create: `public/logos/icon-192.png`
- Create: `public/logos/icon-512.png`
- Create: `src/app/apple-icon.png`

**Step 1: Create icon generation script**

Create `scripts/generate-icons.mjs` that uses `sharp` to render the bolt SVG at 192x192, 512x512, and 180x180 (apple-touch) with a dark background (`#09090b`) and the bolt centered.

Read `src/app/icon.svg`, render to PNG at each size, save to the target paths.

**Step 2: Run the script**

```bash
node scripts/generate-icons.mjs
```

**Step 3: Verify files exist**

```bash
ls -la public/logos/icon-192.png public/logos/icon-512.png src/app/apple-icon.png
```

**Step 4: Verify build**

Run: `npm run build 2>&1 | tail -10`

**Step 5: Commit**

```bash
git add scripts/generate-icons.mjs public/logos/icon-192.png public/logos/icon-512.png src/app/apple-icon.png
git commit -m "feat: generate PWA and apple-touch icon PNGs from bolt SVG"
```

---

### Task 3: Update Header with Bolt Icon

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Replace the "S" square with inline bolt SVG**

In `Header.tsx:26-29`, replace the current `<div>` with rounded-md "S" badge with an inline SVG bolt icon (20x20) using the same gradient colors. Keep the `<Link>` wrapper.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -10`

**Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: replace header S-badge with bolt logo icon"
```

---

### Task 4: Update OG Image with Bolt Accent

**Files:**
- Modify: `src/app/opengraph-image.tsx`

**Step 1: Add bolt accent to OG image**

Add a large, semi-transparent bolt shape in the top-right corner of the OG image as a watermark. Use the same orange gradient at ~10% opacity. Render as an SVG path inside the ImageResponse JSX.

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -10`

**Step 3: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: add bolt watermark to OG image"
```

---

### Task 5: Final Verification

**Step 1: Full build**

Run: `npm run build 2>&1 | tail -20`

**Step 2: Verify all icon files**

```bash
ls -la src/app/icon.svg src/app/apple-icon.png public/logos/icon-192.png public/logos/icon-512.png
```

**Step 3: Commit if any fixes needed**
