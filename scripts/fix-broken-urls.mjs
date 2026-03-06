import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

// Broken URLs to fix — verified correct URLs
const FIXES = {
  'twilio-startups': {
    url: 'https://www.twilio.com/en-us/startups',
    tagline: 'Startup credits for communications APIs',
  },
  'tableplus': {
    url: 'https://tableplus.com/pricing',
    tagline: '50% off for students with valid .edu email',
  },
  'lastpass-students': {
    url: 'https://www.lastpass.com/plans/education',
    tagline: 'Free Premium for students',
  },
  'gitpod-students': {
    url: 'https://www.gitpod.io/discover/education',
    tagline: 'Free cloud IDE plan for students',
  },
  'vercel-pro': {
    url: 'https://vercel.com/docs/accounts/plans/pro/open-source-submissions',
    tagline: 'Free Pro plan for open source & startups',
  },
  'slack-startups': {
    url: 'https://slack.com/partners',
    tagline: 'Pro plan credits through partner programs',
  },
  'mapbox-students': {
    url: 'https://www.mapbox.com/community/education',
    tagline: '5 GB storage for student map projects',
  },
  'datadog-students': {
    url: 'https://www.datadoghq.com/partner/education/',
    tagline: 'Pro account + 10 servers for students',
  },
};

// Deals to DELETE because program no longer exists
const DELETE_SLUGS = new Set([
  // Remove deals where the student program is confirmed dead
]);

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
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function updatePage(pageId, url, tagline) {
  const properties = { URL: { url } };
  if (tagline) properties.Tagline = { rich_text: [{ text: { content: tagline } }] };
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
  });
  return res.ok;
}

async function archivePage(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ archived: true }),
  });
  return res.ok;
}

const pages = await fetchAll();
let fixed = 0, deleted = 0;

for (const p of pages) {
  const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '';
  const name = p.properties.Name?.title?.[0]?.plain_text || '';

  if (DELETE_SLUGS.has(slug)) {
    console.log(`DELETE: ${slug} (${name})`);
    await archivePage(p.id);
    deleted++;
    continue;
  }

  if (FIXES[slug]) {
    const fix = FIXES[slug];
    console.log(`FIX: ${slug} → ${fix.url}`);
    await updatePage(p.id, fix.url, fix.tagline);
    fixed++;
  }
}

console.log(`\nDone. Fixed: ${fixed}, Deleted: ${deleted}`);
