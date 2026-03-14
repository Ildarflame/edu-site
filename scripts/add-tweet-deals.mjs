import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

const newDeals = [
  {
    slug: "cursor-students",
    name: "Cursor Pro",
    logo: "/logos/cursor-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "1 year Cursor Pro free for students",
    description: "Cursor is an AI-native code editor built on VS Code. Students get Cursor Pro free for 1 year — includes unlimited AI completions, GPT-4/Claude chat, and multi-file editing. The fastest way to code with AI.",
    value: "$192/year",
    steps: "Go to cursor.com/students\nSign up with your .edu email\nVerify student status\nDownload Cursor and start coding with AI",
    url: "https://www.cursor.com/students",
    featured: true,
  },
  {
    slug: "leetcode-students",
    name: "LeetCode",
    logo: "/logos/leetcode-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "Student discount on LeetCode Premium",
    description: "LeetCode Premium gives access to company-tagged problems, video solutions, and mock interviews. Students get a discount on the annual plan — essential for technical interview prep at FAANG and top companies.",
    value: "$40/year discount",
    steps: "Go to leetcode.com/student\nVerify your student status\nGet discounted Premium access",
    url: "https://leetcode.com/student/",
    featured: false,
  },
  {
    slug: "tryhackme-students",
    name: "TryHackMe",
    logo: "/logos/tryhackme-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "Student plan for hands-on cybersecurity labs",
    description: "TryHackMe provides interactive cybersecurity training through browser-based labs. Students get discounted access to 500+ rooms covering pentesting, web security, networking, and CTF challenges.",
    value: "$60/year discount",
    steps: "Go to tryhackme.com/r/student-discount\nVerify your student status\nGet discounted Premium subscription",
    url: "https://tryhackme.com/r/student-discount",
    featured: false,
  },
  {
    slug: "miro-education",
    name: "Miro",
    logo: "/logos/miro-education.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "Free Education plan — unlimited boards & collaborators",
    description: "Miro's Education plan gives students free access to the online whiteboard platform with unlimited boards, collaborators, and premium templates. Perfect for brainstorming, wireframing, and group projects.",
    value: "$96/year",
    steps: "Go to miro.com/education\nApply with your .edu email\nGet approved for the free Education plan",
    url: "https://miro.com/education/",
    featured: false,
  },
  {
    slug: "netlify-students",
    name: "Netlify",
    logo: "/logos/netlify-students.svg",
    category: "Cloud",
    audiences: ["Students"],
    tagline: "Free Pro plan via GitHub Student Developer Pack",
    description: "Netlify gives students the Pro plan free for 1 year through the GitHub Student Developer Pack. Deploy unlimited sites with serverless functions, forms, and identity management.",
    value: "$228/year",
    steps: "Get the GitHub Student Developer Pack\nSign up for Netlify with your GitHub account\nActivate the Pro plan benefit",
    url: "https://www.netlify.com/github-students/",
    featured: false,
  },
  {
    slug: "oracle-cloud",
    name: "Oracle Cloud",
    logo: "/logos/oracle-cloud.svg",
    category: "Cloud",
    audiences: ["Students", "Startups"],
    tagline: "Always-free cloud tier — no credit card needed",
    description: "Oracle Cloud offers an always-free tier with 2 AMD VMs, 4 ARM Ampere cores (24 GB RAM), 200 GB storage, and managed databases. No credit card required and the free tier never expires.",
    value: "Free forever",
    steps: "Go to cloud.oracle.com/free\nCreate an account (no credit card needed)\nStart using always-free resources",
    url: "https://www.oracle.com/cloud/free/",
    featured: false,
  },
  {
    slug: "hackthebox-students",
    name: "Hack The Box",
    logo: "/logos/hackthebox-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "Student labs for hands-on cybersecurity training",
    description: "Hack The Box provides students with access to cybersecurity training labs, challenges, and certifications. Practice real-world pentesting scenarios in a safe environment with 300+ machines and challenges.",
    value: "$100+/year discount",
    steps: "Go to hackthebox.com/hacker/student\nVerify your student status\nAccess student labs and challenges",
    url: "https://www.hackthebox.com/hacker/student",
    featured: false,
  },
  {
    slug: "google-gemini",
    name: "Google Gemini",
    logo: "/logos/google-gemini.svg",
    category: "AI",
    audiences: ["Students"],
    tagline: "Gemini Advanced via Google One AI Premium for students",
    description: "Students with Google Workspace for Education can access Gemini AI features including Gemini in Google Docs, Sheets, Slides, and Gmail. Some universities provide Google One AI Premium with Gemini Advanced.",
    value: "$240/year",
    steps: "Check if your university uses Google Workspace for Education\nAccess Gemini features in Google apps\nAsk your IT department about Google One AI Premium",
    url: "https://workspace.google.com/industries/education",
    featured: false,
  },
  {
    slug: "clickup-education",
    name: "ClickUp",
    logo: "/logos/clickup-education.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free Education plan — project management for students",
    description: "ClickUp offers a free Education plan for students with unlimited tasks, members, and integrations. Manage coursework, group projects, and personal tasks with docs, whiteboards, and time tracking.",
    value: "$84/year",
    steps: "Go to clickup.com/education\nApply with your .edu email\nGet free Education plan access",
    url: "https://clickup.com/for/education",
    featured: false,
  },
  {
    slug: "airtable-education",
    name: "Airtable",
    logo: "/logos/airtable-education.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free Education workspace with Pro features",
    description: "Airtable provides students with a free Education workspace including Pro-level features. Build databases, track projects, and collaborate with spreadsheet-database hybrid that powers workflows at top companies.",
    value: "$120/year",
    steps: "Go to airtable.com/education\nApply with your .edu email\nGet Education workspace with Pro features",
    url: "https://airtable.com/lp/education",
    featured: false,
  },
  {
    slug: "loom-education",
    name: "Loom",
    logo: "/logos/loom-education.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free Education plan — screen recording & video messaging",
    description: "Loom gives students the Education plan free with unlimited video recordings, transcriptions, and viewer insights. Record presentations, code walkthroughs, and project demos with one click.",
    value: "$150/year",
    steps: "Go to loom.com/education\nVerify with your .edu email\nStart recording unlimited videos",
    url: "https://www.loom.com/education",
    featured: false,
  },
  {
    slug: "replit-students",
    name: "Replit",
    logo: "/logos/replit-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Replit Pro via GitHub Student Developer Pack",
    description: "Replit gives students Pro access through the GitHub Student Developer Pack. Code in 50+ languages in your browser with AI assistance, multiplayer collaboration, and one-click deployment.",
    value: "$84/year",
    steps: "Get the GitHub Student Developer Pack\nConnect your Replit account to GitHub\nActivate the Pro plan benefit",
    url: "https://replit.com/github-students",
    featured: false,
  },
];

async function createDeal(deal) {
  const res = await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        Name: { title: [{ text: { content: deal.name } }] },
        Slug: { rich_text: [{ text: { content: deal.slug } }] },
        Logo: { rich_text: [{ text: { content: deal.logo } }] },
        Category: { select: { name: deal.category } },
        Audiences: { multi_select: deal.audiences.map(a => ({ name: a })) },
        Tagline: { rich_text: [{ text: { content: deal.tagline } }] },
        Description: { rich_text: [{ text: { content: deal.description } }] },
        Value: { rich_text: [{ text: { content: deal.value } }] },
        Steps: { rich_text: [{ text: { content: deal.steps } }] },
        URL: { url: deal.url },
        Featured: { checkbox: deal.featured || false },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ ${deal.name}: ${err}`);
    return;
  }
  console.log(`✅ ${deal.name}`);
}

console.log(`Adding ${newDeals.length} deals to Notion...\n`);
for (const deal of newDeals) {
  await createDeal(deal);
  await new Promise(r => setTimeout(r, 350)); // rate limit
}
console.log('\nDone! Run `npm run build` to regenerate pages.');
