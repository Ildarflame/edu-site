import { readFileSync, writeFileSync } from 'fs';
import { existsSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

const DEALS_FILE = 'scripts/discovered-deals.json';

if (!existsSync(DEALS_FILE)) {
  console.error('No discovered-deals.json found. Run discover-deals.mjs first.');
  process.exit(1);
}

const deals = JSON.parse(readFileSync(DEALS_FILE, 'utf8'));
console.log('Importing ' + deals.length + ' deals into Notion...\n');

async function downloadLogo(slug) {
  const name = slug.replace(/-students|-education|-oss|-cloud|-startups/g, '');
  const url = 'https://api.iconify.design/simple-icons/' + name + '.svg?width=64&height=64';
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const svg = await res.text();
    if (!svg.includes('<svg')) return false;
    writeFileSync('public/logos/' + slug + '.svg', svg);
    return true;
  } catch {
    return false;
  }
}

async function createDeal(deal) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        Name: { title: [{ text: { content: deal.name } }] },
        Slug: { rich_text: [{ text: { content: deal.slug } }] },
        Logo: { rich_text: [{ text: { content: '/logos/' + deal.slug + '.svg' } }] },
        Category: { select: { name: deal.category } },
        Audiences: { multi_select: deal.audiences.map(a => ({ name: a })) },
        Tagline: { rich_text: [{ text: { content: deal.tagline || '' } }] },
        Description: { rich_text: [{ text: { content: deal.tagline || deal.name + ' for students' } }] },
        Value: { rich_text: [{ text: { content: deal.value || 'Free for students' } }] },
        Steps: { rich_text: [{ text: { content: 'Visit ' + deal.url + '\nVerify your student status\nActivate the free plan' } }] },
        URL: { url: deal.url },
        Featured: { checkbox: false },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('  Notion error: ' + err.slice(0, 100));
    return false;
  }
  return true;
}

let success = 0;
let failed = 0;

for (const deal of deals) {
  // Download logo
  const hasLogo = await downloadLogo(deal.slug);

  // Create in Notion
  const created = await createDeal(deal);

  if (created) {
    console.log('✅ ' + deal.name + (hasLogo ? '' : ' (no logo)'));
    success++;
  } else {
    console.log('❌ ' + deal.name);
    failed++;
  }

  await new Promise(r => setTimeout(r, 350));
}

console.log('\nDone! ' + success + ' imported, ' + failed + ' failed.');
console.log('Run `npm run build` to regenerate pages.');
