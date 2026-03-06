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
    const body = { page_size: 100, sorts: [{ property: "Name", direction: "ascending" }] };
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
    if (!data.results) { console.error(data); break; }
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

const pages = await fetchAll();
console.log(`Total deals: ${pages.length}\n`);

const lowQuality = [];
pages.forEach(p => {
  const name = p.properties.Name?.title?.[0]?.plain_text || '?';
  const value = p.properties.Value?.rich_text?.[0]?.plain_text || '?';
  const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '?';
  const desc = p.properties.Description?.rich_text?.[0]?.plain_text || '';
  const url = p.properties.URL?.url || '';

  const isLow =
    value.toLowerCase().includes('free tier') ||
    value.toLowerCase().includes('free plan') ||
    value === '?' || value === '' ||
    desc.toLowerCase().includes('free tier includes') ||
    desc.toLowerCase().includes('free plan includes') ||
    (!desc.toLowerCase().includes('student') && !desc.toLowerCase().includes('startup') && !desc.toLowerCase().includes('open source') && !desc.toLowerCase().includes('education') && !desc.toLowerCase().includes('credit'));

  const flag = isLow ? '  *** LOW' : '';
  console.log(`${slug} | ${value} | ${name}${flag}`);
  if (isLow) lowQuality.push({ id: p.id, slug, name, value, desc: desc.slice(0, 100) });
});

console.log(`\n--- Low quality: ${lowQuality.length} / ${pages.length} ---`);
lowQuality.forEach(d => console.log(`  ${d.slug}: "${d.value}" — ${d.desc}`));
