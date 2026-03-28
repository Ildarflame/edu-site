/**
 * Submit all sitemap URLs to IndexNow (Bing, Yandex, etc.)
 * Usage: node scripts/indexnow.mjs [--dry-run]
 *
 * Fetches the live sitemap.xml, extracts all URLs, and submits them
 * to IndexNow API in batches of 10,000 (API limit).
 */

const KEY = "786026f8e1a74181b3675dd490aea555";
const HOST = "www.studentperks.dev";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BATCH_SIZE = 10_000;

const dryRun = process.argv.includes("--dry-run");

async function fetchSitemapUrls() {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();

  // Extract all <loc>...</loc> URLs
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`Found ${urls.length} URLs in sitemap`);
  return urls;
}

async function submitBatch(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  if (dryRun) {
    console.log(`[DRY RUN] Would submit ${urls.length} URLs`);
    return { status: 200 };
  }

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return { status: res.status, statusText: res.statusText };
}

async function main() {
  const urls = await fetchSitemapUrls();
  if (!urls.length) {
    console.error("No URLs found in sitemap!");
    process.exit(1);
  }

  // Submit in batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE);

    console.log(`Submitting batch ${batchNum}/${totalBatches} (${batch.length} URLs)...`);
    const result = await submitBatch(batch);

    if (result.status === 200 || result.status === 202) {
      console.log(`  ✓ Batch ${batchNum} accepted (${result.status})`);
    } else {
      console.error(`  ✗ Batch ${batchNum} failed: ${result.status} ${result.statusText}`);
    }
  }

  console.log(`\nDone! Submitted ${urls.length} URLs to IndexNow.`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
