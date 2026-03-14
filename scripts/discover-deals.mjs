import { writeFileSync } from 'fs';
import { discover as discoverGithubPack } from './sources/github-pack.mjs';
import { discover as discoverSaas } from './sources/saas-education.mjs';

const API_URL = 'https://www.studentperks.dev/api/deals';

async function fetchExistingDeals() {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    return data.deals || [];
  } catch (err) {
    console.error('Failed to fetch existing deals: ' + err.message);
    return [];
  }
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isDuplicate(candidate, existingDeals) {
  const candidateSlug = normalize(candidate.slug);
  const candidateName = normalize(candidate.name);

  return existingDeals.some(deal => {
    const dealSlug = normalize(deal.slug);
    const dealName = normalize(deal.name);
    return dealSlug === candidateSlug
      || dealName === candidateName
      || dealSlug.includes(candidateName)
      || candidateSlug.includes(dealName);
  });
}

async function main() {
  console.log('=== Deal Auto-Discovery ===\n');

  // 1. Fetch existing deals
  console.log('Fetching existing deals...');
  const existing = await fetchExistingDeals();
  console.log('Existing deals: ' + existing.length + '\n');

  // 2. Run parsers
  const githubDeals = await discoverGithubPack();
  console.log('');
  const saasDeals = await discoverSaas();

  // 3. Combine and deduplicate
  const allCandidates = [...githubDeals, ...saasDeals];
  console.log('\n--- Summary ---');
  console.log('GitHub Pack candidates: ' + githubDeals.length);
  console.log('SaaS education candidates: ' + saasDeals.length);
  console.log('Total candidates: ' + allCandidates.length);

  // 4. Filter out existing deals
  const newDeals = allCandidates.filter(c => !isDuplicate(c, existing));

  // Also deduplicate within new deals
  const seen = new Set();
  const uniqueNew = newDeals.filter(d => {
    const key = normalize(d.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log('New deals found: ' + uniqueNew.length);

  if (uniqueNew.length === 0) {
    console.log('\nNo new deals discovered. Exiting.');
    process.exit(0);
  }

  // 5. Add discovery timestamp
  const dated = uniqueNew.map(d => ({
    ...d,
    discoveredAt: new Date().toISOString().split('T')[0],
  }));

  // 6. Write results
  const outPath = 'scripts/discovered-deals.json';
  writeFileSync(outPath, JSON.stringify(dated, null, 2));
  console.log('\nWritten ' + dated.length + ' new deals to ' + outPath);

  // Print summary for PR description
  console.log('\n--- New Deals ---');
  for (const d of dated) {
    console.log('- ' + d.name + ' (' + d.category + ') — ' + d.source);
  }

  // Exit with 1 to signal "new deals found" to GitHub Action
  process.exit(1);
}

main().catch(err => {
  console.error('Fatal error: ' + err.message);
  process.exit(2);
});
