import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

// Deals to DELETE completely — not real student/startup perks, just free tiers for everyone
const DELETE_SLUGS = new Set([
  'airtable',        // just free tier
  'auth0-startups',  // just free tier
  'back4app',        // just free tier
  'clickup',         // just free tier
  'codeium',         // free for everyone
  'cursor',          // free for everyone
  'duolingo-plus',   // free for everyone
  'firebase',        // free tier for everyone
  'fly-io',          // free tier for everyone
  'framer',          // just free plan
  'github-actions',  // free for all public repos
  'github-copilot-chat', // included with copilot
  'github-learning-lab', // free for everyone
  'hetzner',         // just cheap hosting, no student program
  'huggingface',     // free for everyone
  'ibm-cloud',       // just free tier
  'invision',        // just free tier, company struggling
  'kaggle',          // free for everyone
  'loom-startups',   // just free tier
  'mailchimp',       // just free tier
  'marvel-app',      // just free tier
  'neon-database',   // just free tier
  'neptune-ai',      // just free tier
  'netlify',         // just free tier for everyone
  'notion-calendar', // free for everyone
  'oracle-cloud',    // just always-free tier
  'render',          // just free tier
  'replicate',       // just free tier
  'replit',          // free for everyone
  'sendgrid',        // just free tier
  'spline',          // just free tier
  'turso',           // just free tier
  'udemy-student',   // just sales, not student program
  'insomnia',        // free for everyone
]);

// Deals to KEEP but they need better descriptions (will update separately)
// These have real student/startup programs despite "Free tier" label:
// - asana-startups (has real startup program)
// - bitbucket-education (real academic license)
// - codacy (free for OSS)
// - comet-ml (free for academics)
// - linkedin-learning (free via edu)
// - monday-startups (has startup program)
// - mongodb-students (has student program)
// - planetscale (had developer plan)
// - travis-ci (free for OSS)
// - webflow-students (has student program)
// - zeplin-education (has education program)

async function fetchAll() {
  let pages = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function archivePage(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ archived: true }),
  });
  return res.ok;
}

const pages = await fetchAll();
console.log(`Total deals in Notion: ${pages.length}`);

// Find duplicates and deletions
const seen = new Map();
let deleted = 0;
let deduped = 0;

for (const p of pages) {
  const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '';
  const name = p.properties.Name?.title?.[0]?.plain_text || '';

  // Delete low quality
  if (DELETE_SLUGS.has(slug)) {
    console.log(`DELETE: ${slug} (${name}) — not a real perk`);
    await archivePage(p.id);
    deleted++;
    continue;
  }

  // Deduplicate
  if (seen.has(slug)) {
    console.log(`DEDUP: ${slug} (${name}) — duplicate removed`);
    await archivePage(p.id);
    deduped++;
    continue;
  }
  seen.set(slug, p.id);
}

console.log(`\nDone. Deleted: ${deleted}, Deduped: ${deduped}, Remaining: ${pages.length - deleted - deduped}`);
