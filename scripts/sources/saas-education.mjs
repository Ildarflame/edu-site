import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const companies = JSON.parse(readFileSync(join(__dirname, 'companies.json'), 'utf8'));

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StudentPerksBot/1.0)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    return {
      title: titleMatch?.[1]?.trim() || '',
      description: descMatch?.[1]?.trim() || '',
      url: res.url,
      status: res.status,
    };
  } catch {
    return null;
  }
}

function hasEducationSignal(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const signals = ['student', 'education', 'academic', 'free for', 'campus', '.edu', 'school', 'university', 'learn', 'discount'];
  return signals.some(s => text.includes(s));
}

export async function discover() {
  const results = [];
  console.log(`Checking ${companies.length} companies...\n`);

  for (const company of companies) {
    let found = null;
    for (const url of company.urls) {
      const result = await checkUrl(url);
      if (result) {
        found = { ...result, originalUrl: url };
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    if (found) {
      const isEducation = hasEducationSignal(found.title, found.description);
      console.log(`${isEducation ? '✅' : '⚠️ '} ${company.name}: ${found.url}`);
      results.push({
        slug: company.slug,
        name: company.name,
        source: 'saas-education',
        sourceUrl: found.url,
        category: company.category,
        audiences: ['Students'],
        tagline: found.description?.slice(0, 120) || `${company.name} for students`,
        value: 'Free for students',
        url: found.url,
        hasEducationSignal: isEducation,
      });
    } else {
      console.log(`❌ ${company.name}: no reachable URL`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  return results;
}
