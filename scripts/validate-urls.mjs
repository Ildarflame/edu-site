import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

async function fetchAll() {
  let pages = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.results) { console.error(data); break; }
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) StudentPerks-Validator/1.0' },
    });
    clearTimeout(timeout);
    return { status: res.status, finalUrl: res.url, ok: res.ok };
  } catch (e) {
    clearTimeout(timeout);
    return { status: 0, finalUrl: url, ok: false, error: e.message };
  }
}

const EDU_KEYWORDS = ['education', 'student', 'academic', 'startup', 'free', 'open-source', 'github-student', 'for-education', 'edu', 'campus', 'activate', 'oss', 'early-stage', 'pack'];

// Known correct URLs for specific student/edu programs
const BETTER_URLS = {
  'mongodb-students': 'https://www.mongodb.com/students',
  'docker-students': 'https://www.docker.com/community/open-source/application/',
  'digitalocean-students': 'https://www.digitalocean.com/github-students/',
  'slack-startups': 'https://slack.com/intl/en-us/solutions/startups',
  'cloudflare-startups': 'https://www.cloudflare.com/forstartups/',
  'supabase-startups': 'https://supabase.com/partners/integrations',
  'linear-startups': 'https://linear.app/startups',
  'sentry-oss': 'https://sentry.io/for/education/',
};

async function updatePage(pageId, properties) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) console.error(`  Update failed: ${res.status} ${await res.text()}`);
  return res.ok;
}

async function main() {
  const pages = await fetchAll();
  console.log(`Validating ${pages.length} deals...\n`);

  let broken = 0, redirected = 0, fixed = 0, ok = 0;

  for (const p of pages) {
    const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '';
    const name = p.properties.Name?.title?.[0]?.plain_text || '';
    const url = p.properties.URL?.url || '';

    if (!url) {
      console.log(`[NO URL] ${slug} — ${name}`);
      broken++;
      continue;
    }

    // Check if we have a known better URL
    if (BETTER_URLS[slug] && url !== BETTER_URLS[slug]) {
      console.log(`[FIX] ${slug}`);
      console.log(`  Old: ${url}`);
      console.log(`  New: ${BETTER_URLS[slug]}`);
      await updatePage(p.id, { URL: { url: BETTER_URLS[slug] } });
      fixed++;
      continue;
    }

    const result = await checkUrl(url);

    if (!result.ok) {
      console.log(`[BROKEN ${result.status}] ${slug} — ${url}${result.error ? ` (${result.error})` : ''}`);
      broken++;
      continue;
    }

    // Check if redirected to a different domain or path
    const origHost = new URL(url).hostname;
    const finalHost = new URL(result.finalUrl).hostname;
    if (result.finalUrl !== url && origHost !== finalHost) {
      console.log(`[REDIRECT] ${slug}`);
      console.log(`  From: ${url}`);
      console.log(`  To:   ${result.finalUrl}`);
      redirected++;
    }

    // Check if URL looks like it points to specific edu page
    const urlLower = url.toLowerCase();
    const hasEduKeyword = EDU_KEYWORDS.some(kw => urlLower.includes(kw));
    if (!hasEduKeyword) {
      // URL might just be a homepage
      const path = new URL(url).pathname;
      if (path === '/' || path === '') {
        console.log(`[HOMEPAGE?] ${slug} — ${url} (might not point to specific edu page)`);
      }
    }

    ok++;

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Summary ===`);
  console.log(`OK: ${ok}`);
  console.log(`Broken: ${broken}`);
  console.log(`Redirected: ${redirected}`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Total: ${pages.length}`);
}

main().catch(console.error);
