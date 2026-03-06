import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

// Deals to delete — no real student/startup program
const DELETE_SLUGS = new Set([
  'brilliant',     // just free tier + vague "student discount"
  'edx-students',  // free audit is available to everyone
  'planetscale',   // shut down free tier, no student program
  'zeplin-education', // just free tier, no real edu program
]);

// Deals to update with better value/description
const UPDATES = {
  'asana-startups': {
    value: '$1,200/year',
    description: 'Asana offers startups in partner accelerator programs free access to Business plan features. Manage projects with timelines, goals, portfolios, and advanced integrations for your growing team.',
    tagline: 'Free Business plan for accelerator startups',
  },
  'bitbucket-education': {
    value: '$180/year',
    description: 'Bitbucket offers free academic licenses with unlimited private repositories, CI/CD pipelines, and up to 5 users for students and educators. Part of the Atlassian education program.',
    tagline: 'Free academic license with unlimited private repos',
  },
  'codacy': {
    value: '$180/year',
    description: 'Codacy provides free automated code review and quality analysis for open source projects. Get code coverage, duplication detection, and security analysis across 40+ languages — free for public repos.',
    tagline: 'Free code quality analysis for open source',
  },
  'comet-ml': {
    value: '$500/year',
    description: 'Comet offers free academic access to its ML experiment management platform. Students and researchers can log, compare, and reproduce ML experiments with unlimited tracking, team collaboration, and GPU monitoring.',
    tagline: 'Free ML experiment tracking for students & researchers',
  },
  'jetbrains-students': {
    value: '$649/year',
    description: 'JetBrains gives students and educators free access to all professional IDEs — IntelliJ IDEA Ultimate, PyCharm Pro, WebStorm, CLion, DataGrip, and more. Renew annually while enrolled.',
    tagline: 'All pro IDEs free for students & educators',
  },
  'linkedin-learning': {
    value: '$360/year',
    description: 'LinkedIn Learning is available free to students through many university subscriptions. Access 16,000+ expert-led courses in development, business, and creative skills with certificates of completion.',
    tagline: 'Free access through university subscriptions',
  },
  'monday-startups': {
    value: '$1,080/year',
    description: 'Monday.com offers startups up to $6,000 in credits through their startup program for VC-backed companies. Get Pro plan features including time tracking, formulas, and advanced integrations.',
    tagline: 'Up to $6,000 in credits for VC-backed startups',
  },
  'mongodb-students': {
    value: '$200+ credits',
    description: 'MongoDB Atlas offers students free credits and learning resources through the MongoDB for Academia program. Beyond the free M0 cluster, get access to Atlas credits, MongoDB University courses, and certification exams.',
    tagline: 'Free credits + MongoDB University for students',
  },
  'travis-ci': {
    value: '$700/year',
    description: 'Travis CI offers unlimited free CI/CD minutes for open source projects on GitHub. Automated testing and deployment with parallel builds, multi-language support, and easy GitHub integration.',
    tagline: 'Unlimited free CI/CD for open source projects',
  },
  'visual-studio-enterprise': {
    value: '$5,999/year',
    description: 'Microsoft offers Visual Studio Enterprise free to students through Azure Dev Tools for Teaching (formerly Imagine). Includes the full IDE, advanced debugging, code analysis, architecture tools, and Azure credits.',
    tagline: 'Free Enterprise IDE for students via Azure Dev Tools',
  },
  'webflow-students': {
    value: '$192/year',
    description: 'Webflow offers students a free CMS site plan through their education program. Build responsive, production-grade websites with a visual editor, CMS, hosting, and custom code — ideal for portfolio projects.',
    tagline: 'Free CMS site plan for students',
  },
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

async function archivePage(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ archived: true }),
  });
  return res.ok;
}

async function updatePage(pageId, updates) {
  const properties = {};
  if (updates.value) {
    properties.Value = { rich_text: [{ text: { content: updates.value } }] };
  }
  if (updates.description) {
    properties.Description = { rich_text: [{ text: { content: updates.description } }] };
  }
  if (updates.tagline) {
    properties.Tagline = { rich_text: [{ text: { content: updates.tagline } }] };
  }
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) console.error(`  Failed: ${res.status} ${await res.text()}`);
  return res.ok;
}

const pages = await fetchAll();
console.log(`Total: ${pages.length}`);

let deleted = 0, updated = 0;

for (const p of pages) {
  const slug = p.properties.Slug?.rich_text?.[0]?.plain_text || '';
  const name = p.properties.Name?.title?.[0]?.plain_text || '';

  if (DELETE_SLUGS.has(slug)) {
    console.log(`DELETE: ${slug} (${name})`);
    await archivePage(p.id);
    deleted++;
    continue;
  }

  if (UPDATES[slug]) {
    console.log(`UPDATE: ${slug} (${name})`);
    await updatePage(p.id, UPDATES[slug]);
    updated++;
  }
}

console.log(`\nDone. Deleted: ${deleted}, Updated: ${updated}, Remaining: ${pages.length - deleted}`);
