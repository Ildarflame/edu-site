import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

const newDeals = [
  {
    slug: "vaadin-students",
    name: "Vaadin",
    logo: "/logos/vaadin-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Pro subscription for Java web development",
    description: "Vaadin gives students a free Pro subscription worth $600/year for building modern Java web applications through the student program.",
    value: "$600/year",
    steps: "Go to vaadin.com/student-program\nVerify your student status\nGet free Pro subscription for building Java web apps",
    url: "https://vaadin.com/student-program",
    featured: false,
  },
  {
    slug: "deepscan-students",
    name: "DeepScan",
    logo: "/logos/deepscan-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "6 months premium code analysis",
    description: "DeepScan offers students 6 months of premium static analysis for JavaScript and TypeScript through the GitHub Student Developer Pack.",
    value: "$180/year",
    steps: "Go to deepscan.io/github-student-pack\nConnect your GitHub account\nGet 6 months of premium static analysis",
    url: "https://deepscan.io/github-student-pack",
    featured: false,
  },
  {
    slug: "poeditor-students",
    name: "POEditor",
    logo: "/logos/poeditor-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "1 year premium localization platform",
    description: "POEditor provides students with 1 year of premium access to their localization platform with unlimited strings for translating apps and websites.",
    value: "$180/year",
    steps: "Go to poeditor.com education page\nSign up with your student email\nGet 1 year premium with unlimited strings",
    url: "https://poeditor.com/blog/translation-localization-educational-projects/",
    featured: false,
  },
  {
    slug: "lingohub-students",
    name: "LingoHub",
    logo: "/logos/lingohub-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Professional plan with 10K text segments",
    description: "LingoHub gives students the Professional Plan with 10,000 text segments for app and website localization through the GitHub Student Developer Pack.",
    value: "$200/year",
    steps: "Go to lingohub.com/github-students\nConnect your GitHub student account\nGet Professional Plan with 10,000 text segments",
    url: "https://lingohub.com/github-students",
    featured: false,
  },
  {
    slug: "eversql-students",
    name: "EverSQL",
    logo: "/logos/eversql-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "6 months SQL optimization for students",
    description: "EverSQL offers students 6 months of automatic SQL query optimization through the GitHub Student Developer Pack.",
    value: "$120/year",
    steps: "Go to eversql.com/github-students\nConnect your GitHub account\nGet 6 months of automatic SQL query optimization",
    url: "https://www.eversql.com/github-students/",
    featured: false,
  },
  {
    slug: "transloadit-students",
    name: "Transloadit",
    logo: "/logos/transloadit-students.svg",
    category: "Dev",
    audiences: ["Students", "Startups"],
    tagline: "10 GB Startup plan for file processing",
    description: "Transloadit gives students and startups a 10 GB Startup Plan for file uploading, encoding, and processing through the GitHub Student Developer Pack.",
    value: "$200/year",
    steps: "Go to transloadit.com/github-students\nSign up with your GitHub student account\nGet 10 GB Startup Plan for file uploading and encoding",
    url: "https://transloadit.com/github-students/",
    featured: false,
  },
  {
    slug: "raygun-students",
    name: "Raygun",
    logo: "/logos/raygun-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Error and performance monitoring for students",
    description: "Raygun provides students with free crash reporting and real user performance monitoring for web and mobile apps through the GitHub Student Developer Pack.",
    value: "$288/year",
    steps: "Go to raygun.com GitHub student page\nSign up with your GitHub Education account\nGet free crash and performance monitoring for your apps",
    url: "https://raygun.com/rg/campaign/github-student-developer-pack",
    featured: false,
  },
  {
    slug: "kaltura-students",
    name: "Kaltura",
    logo: "/logos/kaltura-students.svg",
    category: "SaaS",
    audiences: ["Students", "Startups"],
    tagline: "$10K/year in video platform credits",
    description: "Kaltura offers students and startups $10,000 per year in video platform credits for hosting, streaming, and managing video content.",
    value: "$10,000/year",
    steps: "Go to corp.kaltura.com registration page\nApply with your educational institution details\nGet $10K in video platform credits",
    url: "https://corp.kaltura.com/video-paas/registration/",
    featured: true,
  },
  {
    slug: "vertabelo-students",
    name: "Vertabelo",
    logo: "/logos/vertabelo-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free database design tool for students",
    description: "Vertabelo gives students free access to their visual database design tool for creating ER diagrams and managing database schemas.",
    value: "$120/year",
    steps: "Go to vertabelo.com academic sign-up\nRegister with your .edu email\nGet free access to visual database design tool",
    url: "https://my.vertabelo.com/sign-up/create-academic",
    featured: false,
  },
  {
    slug: "astah-students",
    name: "Astah",
    logo: "/logos/astah-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "1 year professional UML diagramming license",
    description: "Astah offers students a 1-year Professional license for creating UML diagrams, flowcharts, and ER diagrams for software design.",
    value: "$120/year",
    steps: "Go to astah.net/products/free-student-license\nApply with your student email\nGet 1 year Professional license for UML diagrams",
    url: "https://astah.net/products/free-student-license/",
    featured: false,
  },
  {
    slug: "pomodone-students",
    name: "PomoDone",
    logo: "/logos/pomodone-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "2 years free Lite plan for productivity",
    description: "PomoDone gives students 2 years of free Lite plan access for Pomodoro-based time tracking integrated with popular task management tools.",
    value: "$60 value",
    steps: "Go to pomodoneapp.com student page\nVerify your student status via GitHub Education\nGet PomoDone Lite plan free for 2 years",
    url: "https://pomodoneapp.com/pomodoro-timer-for-students.html",
    featured: false,
  },
  {
    slug: "arduino-students",
    name: "Arduino",
    logo: "/logos/arduino-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "6 months Arduino Create Maker plan + hardware discounts",
    description: "Arduino gives students 6 months of Arduino Create Maker plan and hardware discounts through the GitHub Student Developer Pack.",
    value: "$80 value",
    steps: "Go to arduino.cc/github/students\nConnect your GitHub student account\nGet 6 months Arduino Create Maker plan and hardware discounts",
    url: "https://www.arduino.cc/github/students",
    featured: false,
  },
  {
    slug: "gliffy-students",
    name: "Gliffy",
    logo: "/logos/gliffy-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free diagram and flowchart tool for students",
    description: "Gliffy provides students with a free online account for creating diagrams, flowcharts, org charts, and wireframes.",
    value: "$96/year",
    steps: "Go to Gliffy student page\nRegister with your .edu email\nGet free Gliffy Online account for diagrams",
    url: "https://help.gliffy.com/online/Content/GliffyOnline/free_for_students.htm",
    featured: false,
  },
  {
    slug: "kodika-students",
    name: "Kodika.io",
    logo: "/logos/kodika-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "6 months unlimited Pro plan for iOS development",
    description: "Kodika.io offers students 6 months of unlimited Pro plan for building iOS apps with drag-and-drop through the GitHub Student Developer Pack.",
    value: "$300/year",
    steps: "Go to kodika.io/github-student-pack\nConnect your GitHub Education account\nBuild iOS apps with drag-and-drop for 6 months free",
    url: "https://kodika.io/github-student-pack/",
    featured: false,
  },
  {
    slug: "symfonycasts-students",
    name: "SymfonyCasts",
    logo: "/logos/symfonycasts-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "3 months free PHP & Symfony video tutorials",
    description: "SymfonyCasts gives students 3 months of free access to all PHP and Symfony video tutorials through the GitHub Student Developer Pack.",
    value: "$135 value",
    steps: "Go to symfonycasts.com/github-student\nSign in with your GitHub student account\nGet 3 months free access to all Symfony courses",
    url: "https://symfonycasts.com/github-student",
    featured: false,
  },
  {
    slug: "semaphore-students",
    name: "Semaphore",
    logo: "/logos/semaphore-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free CI/CD account with 25% institutional discount",
    description: "Semaphore gives students a free CI/CD account with 25% institutional discount for continuous integration and deployment pipelines.",
    value: "$120/year",
    steps: "Go to semaphoreci.com student discount page\nApply with your educational institution\nGet free student account for CI/CD pipelines",
    url: "https://docs.semaphoreci.com/account-management/discounts/",
    featured: false,
  },
  {
    slug: "acm-students",
    name: "ACM Digital Library",
    logo: "/logos/acm-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "ACM membership + O'Reilly Learning for $42/year (vs $198)",
    description: "ACM Student Membership at $42/year includes access to ACM Digital Library and O'Reilly Online Learning platform, saving $156/year compared to regular pricing.",
    value: "$156/year savings",
    steps: "Go to acm.org membership options\nSelect Student Membership ($42/year)\nGet access to ACM Digital Library and O'Reilly Online Learning",
    url: "https://www.acm.org/membership/membership-options",
    featured: true,
  },
  {
    slug: "enscape-students",
    name: "Enscape",
    logo: "/logos/enscape-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "Free educational license for real-time 3D rendering",
    description: "Enscape provides students with a free educational license for real-time 3D rendering and architectural visualization integrated with Revit, SketchUp, and Rhino.",
    value: "$500/year",
    steps: "Go to enscape3d.com/educational-license\nApply with your educational institution email\nGet free Enscape license for architectural visualization",
    url: "https://enscape3d.com/educational-license/",
    featured: false,
  },
  {
    slug: "ynab-students",
    name: "YNAB (You Need A Budget)",
    logo: "/logos/ynab-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free budgeting app for college students",
    description: "YNAB offers college students 12 months of free access to their budgeting app, normally $99/year, to help manage finances during school.",
    value: "$99/year",
    steps: "Go to youneedabudget.com/college\nSign up with your .edu email\nGet YNAB free for 12 months (normally $99/year)",
    url: "https://www.youneedabudget.com/college/",
    featured: false,
  },
  {
    slug: "surfshark-students",
    name: "Surfshark VPN",
    logo: "/logos/surfshark-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "81% off VPN subscription for students",
    description: "Surfshark offers students 81% off their VPN subscription on the 24-month plan, providing privacy and security online at a steep student discount.",
    value: "$150 savings",
    steps: "Go to surfshark.com student deal\nVerify your student status\nGet Surfshark VPN at 81% off (24-month plan)",
    url: "https://surfshark.com/deal/student",
    featured: false,
  },
  {
    slug: "codecov-students",
    name: "Codecov",
    logo: "/logos/codecov-students.svg",
    category: "Dev",
    audiences: ["Students", "Opensource"],
    tagline: "Free code coverage for public & private repos",
    description: "Codecov gives students and open-source projects free code coverage reports for all repositories, helping improve code quality and testing.",
    value: "$120/year",
    steps: "Go to codecov.io for education\nSign up with your GitHub account\nGet free code coverage reports for all your repositories",
    url: "https://about.codecov.io/for/education/",
    featured: false,
  },
  {
    slug: "astra-students",
    name: "Astra Security",
    logo: "/logos/astra-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "6 months website security suite",
    description: "Astra Security gives students 6 months of free website security suite including firewall, malware scanner, and security audit through the GitHub Student Developer Pack.",
    value: "$150 value",
    steps: "Go to getastra.com GitHub student page\nConnect your GitHub Education account\nGet 6 months of firewall, malware scanner, and security audit",
    url: "https://www.getastra.com/github-student-developer-pack",
    featured: false,
  },
  {
    slug: "taskade-students",
    name: "Taskade",
    logo: "/logos/taskade-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "50% permanent discount on Pro plans",
    description: "Taskade offers students a permanent 50% discount on Pro plans for AI-powered task management, notes, and team collaboration.",
    value: "$60/year savings",
    steps: "Go to taskade.com/pricing\nUse coupon code students50 at checkout\nGet 50% off Taskade Pro permanently",
    url: "https://www.taskade.com/pricing",
    featured: false,
  },
  {
    slug: "flatiron-students",
    name: "Flatiron School",
    logo: "/logos/flatiron-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "1 month free coding bootcamp access",
    description: "Flatiron School gives students 1 month of free access to their Community-Powered Bootcamp through the GitHub Student Developer Pack.",
    value: "$1,500 value",
    steps: "Go to flatironschool.com free lessons\nSign up with your GitHub student account\nGet 1 month free access to Community-Powered Bootcamp",
    url: "https://flatironschool.com/free-lessons/",
    featured: false,
  },
  {
    slug: "neve-students",
    name: "Neve WordPress Theme",
    logo: "/logos/neve-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "1 year free agency WordPress theme",
    description: "Neve by ThemeIsle gives students 1 year of free Starter Plan and agency WordPress theme through the GitHub Student Developer Pack.",
    value: "$100/year",
    steps: "Go to themeisle.com/github-students\nConnect your GitHub Education account\nGet 1 year free Starter Plan and agency theme for WordPress",
    url: "https://themeisle.com/github-students/",
    featured: false,
  },
];

async function fetchExistingSlugs() {
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
    if (!data.results) { console.error(data); break; }
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return new Set(pages.map(p => p.properties.Slug?.rich_text?.[0]?.plain_text).filter(Boolean));
}

async function createDeal(deal) {
  const res = await fetch(`https://api.notion.com/v1/pages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        "Name": { title: [{ text: { content: deal.name } }] },
        "Slug": { rich_text: [{ text: { content: deal.slug } }] },
        "Logo": { rich_text: [{ text: { content: deal.logo } }] },
        "Category": { select: { name: deal.category } },
        "Audiences": { multi_select: deal.audiences.map(a => ({ name: a })) },
        "Tagline": { rich_text: [{ text: { content: deal.tagline } }] },
        "Description": { rich_text: [{ text: { content: deal.description } }] },
        "Value": { rich_text: [{ text: { content: deal.value } }] },
        "Steps": { rich_text: [{ text: { content: deal.steps } }] },
        "URL": { url: deal.url },
        "Featured": { checkbox: deal.featured },
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  FAILED ${deal.slug}: ${res.status} ${text}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('Fetching existing deals from Notion...');
  const existingSlugs = await fetchExistingSlugs();
  console.log(`Found ${existingSlugs.size} existing deals.\n`);

  const toAdd = newDeals.filter(d => {
    if (existingSlugs.has(d.slug)) {
      console.log(`  SKIP (duplicate): ${d.slug}`);
      return false;
    }
    return true;
  });

  console.log(`\nAdding ${toAdd.length} new deals...\n`);

  let added = 0;
  for (const deal of toAdd) {
    const ok = await createDeal(deal);
    if (ok) {
      console.log(`  + ${deal.name} (${deal.slug})`);
      added++;
    }
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\nDone. Added ${added}/${toAdd.length} deals.`);
  console.log(`Total deals should now be: ${existingSlugs.size + added}`);
}

main().catch(console.error);
