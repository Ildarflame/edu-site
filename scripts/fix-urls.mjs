import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

// Correct URLs for known programs
const CORRECT_URLS = {
  'jetbrains-students': 'https://www.jetbrains.com/community/education/',
  'github-education': 'https://education.github.com/pack',
  'figma-education': 'https://www.figma.com/education/',
  'notion-education': 'https://www.notion.so/product/notion-for-education',
  'copilot-students': 'https://github.com/features/copilot',
  'docker-students': 'https://www.docker.com/community/open-source/application/',
  'spotify-student': 'https://www.spotify.com/student/',
  'canva-education': 'https://www.canva.com/education/',
  'gitkraken': 'https://www.gitkraken.com/github-student-developer-pack-bundle',
  'termius': 'https://termius.com/education',
  'datacamp-students': 'https://www.datacamp.com/github-students/',
  'postman-students': 'https://www.postman.com/company/student-program/',
  'tableplus': 'https://tableplus.com/blog/2018/06/educational-license.html',
  'tower-git': 'https://www.git-tower.com/students/',
  'sketch-students': 'https://www.sketch.com/store/edu/',
  'unity-student': 'https://unity.com/products/unity-student',
  'unreal-engine': 'https://www.unrealengine.com/en-US/license',
  'visual-studio-enterprise': 'https://visualstudio.microsoft.com/students/',
  'gitlab-education': 'https://about.gitlab.com/solutions/education/',
  'heroku-students': 'https://www.heroku.com/github-students',
  'mongodb-students': 'https://www.mongodb.com/students',
  'codecademy-students': 'https://www.codecademy.com/student-center',
  'educative': 'https://www.educative.io/github-students',
  'linkedin-learning': 'https://www.linkedin.com/learning/',
  'aws-activate': 'https://aws.amazon.com/activate/',
  'azure-students': 'https://azure.microsoft.com/en-us/free/students/',
  'google-cloud-startups': 'https://cloud.google.com/startup',
  'stripe-atlas': 'https://stripe.com/atlas',
  'digitalocean-students': 'https://www.digitalocean.com/github-students/',
  'hubspot-startups': 'https://www.hubspot.com/startups',
  'intercom-startups': 'https://www.intercom.com/early-stage',
  'sentry-oss': 'https://sentry.io/for/education/',
  'cloudflare-startups': 'https://www.cloudflare.com/forstartups/',
  'vercel-pro': 'https://vercel.com/guides/can-i-get-vercel-pro-for-open-source',
  'supabase-startups': 'https://supabase.com/partners/integrations',
  'slack-startups': 'https://slack.com/intl/en-us/solutions/startups',
  'adobe-creative-cloud-students': 'https://www.adobe.com/creativecloud/buy/students.html',
  'apple-music-student': 'https://support.apple.com/en-us/HT205928',
  'youtube-premium-student': 'https://www.youtube.com/premium/student',
  'amazon-prime-student': 'https://www.amazon.com/amazonprime?planOptimizationId=WLPStudentMonthlyElig498',
  'headspace-students': 'https://www.headspace.com/studentplan',
  'apple-developer-student': 'https://developer.apple.com/programs/',
  'grammarly-students': 'https://www.grammarly.com/edu',
  'amplitude-startups': 'https://amplitude.com/startups',
  'zendesk-startups': 'https://www.zendesk.com/startups/',
  'segment-startups': 'https://segment.com/industry/startups/',
};

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

async function updateUrl(pageId, url) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ properties: { URL: { url } } }),
  });
  if (!res.ok) console.error(`  Failed: ${res.status} ${await res.text()}`);
  return res.ok;
}

const pages = await fetchAll();
console.log(`Total deals: ${pages.length}`);

let fixed = 0;
for (const p of pages) {
  const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '';
  const name = p.properties.Name?.title?.[0]?.plain_text || '';
  const currentUrl = p.properties.URL?.url || '';

  if (CORRECT_URLS[slug] && currentUrl !== CORRECT_URLS[slug]) {
    console.log(`FIX: ${slug}`);
    console.log(`  OLD: ${currentUrl}`);
    console.log(`  NEW: ${CORRECT_URLS[slug]}`);
    await updateUrl(p.id, CORRECT_URLS[slug]);
    fixed++;
  }
}

console.log(`\nDone. Fixed ${fixed} URLs out of ${pages.length} deals.`);
