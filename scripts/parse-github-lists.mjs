import { readFileSync, writeFileSync } from 'fs';

// Parse both GitHub markdown files and extract all deals
const file1 = readFileSync('/tmp/student-offers.md', 'utf8');
const file2 = readFileSync('/tmp/free-for-students.md', 'utf8');

const deals = [];

// Parse student-offers.md table format: |[Name](URL)|Benefits|Type|
const tableRegex = /\|\[([^\]]+)\]\(([^)]+)\)\|([^|]*)\|([^|]*)\|/g;
let match;
while ((match = tableRegex.exec(file1)) !== null) {
  const [, name, url, benefits, type] = match;
  if (url && url !== 'https://' && url.length > 10) {
    deals.push({ source: 'student-offers', name: name.trim(), url: url.trim(), benefits: benefits.trim(), type: type.trim() });
  }
}

// Parse free-for-students.md list format: * [Name](URL) - Description
const listRegex = /\*\s+\[([^\]]+)\]\(([^)]+)\)\s*[-–—]?\s*(.*)/g;
while ((match = listRegex.exec(file2)) !== null) {
  const [, name, url, desc] = match;
  if (url && url.length > 10) {
    deals.push({ source: 'free-for-students', name: name.trim(), url: url.trim(), benefits: desc.trim(), type: '' });
  }
}

// Deduplicate by domain
const seen = new Set();
const unique = [];
for (const d of deals) {
  try {
    const domain = new URL(d.url).hostname.replace('www.', '');
    const key = domain + '|' + d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(d);
    }
  } catch {
    // skip invalid URLs
  }
}

console.log(`Parsed: ${deals.length} total, ${unique.length} unique\n`);

unique.forEach((d, i) => {
  console.log(`${i+1}. ${d.name} | ${d.url.slice(0, 60)} | ${d.benefits.slice(0, 60)}`);
});

writeFileSync('/tmp/parsed-deals.json', JSON.stringify(unique, null, 2));
console.log(`\nSaved to /tmp/parsed-deals.json`);
