import { readFileSync } from 'fs';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('='))
);
const TOKEN = env.NOTION_TOKEN;
const DB_ID = env.NOTION_DEALS_DATABASE_ID;

// Existing slugs — do NOT duplicate
const EXISTING_SLUGS = new Set([
  '1password-students','adobe-creative-cloud-students','algolia-startups','alibaba-cloud','amazon-prime-student',
  'amplitude-startups','anthropic-api-credits','apple-developer-student','apple-music-student','asana-startups',
  'autodesk-students','aws-activate','axure-students','azure-students','bitbucket-education',
  'bootstrap-studio-students','browserstack-students','calm-students','canva-education','circleci',
  'cloudflare-startups','codacy','codecademy-students','comet-ml','configcat-students',
  'coursera-students','dashlane-students','datacamp-students','datadog-students','datagrip-students',
  'deepl-pro','digitalocean-students','discord-nitro','docker-students','educative',
  'evernote-students','figma-education','freecodecamp','frontend-masters-students','copilot-students',
  'github-education','gitkraken','gitpod-students','gitlab-education','google-cloud-ai',
  'google-cloud-startups','grammarly-students','headspace-students','heroku-students','hubspot-startups',
  'hulu-students','intercom-startups','jasper-ai','jetbrains-students','lambdatest-students',
  'lastpass-students','linear-startups','linkedin-learning','linode-akamai','mapbox-students',
  'microsoft-365-education','monday-startups','mongodb-students','namecheap-students','notion-education',
  'openai-api-startups','perplexity-students','pluralsight-students','popsql','postman-students',
  'protopie','railway-oss','roboform-students','scaleway','segment-startups',
  'sentry-oss','sketch-students','slack-startups','spotify-student','squarespace-students',
  'stripe-atlas','supabase-startups','tableplus','tabnine','tableau-students',
  'termius','tower-git','travis-ci','twilio-startups','unity-student',
  'unreal-engine','vercel-pro','visual-studio-enterprise','vultr','wandb',
  'webflow-students','youtube-premium-student','zendesk-startups',
]);

const newDeals = [
  {
    slug: "polypane-students",
    name: "Polypane",
    logo: "/logos/polypane-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free browser dev tool for 1 year via GitHub Education",
    description: "Polypane gives students 1 year free access to their responsive design browser through the GitHub Student Developer Pack. Test multiple viewports, accessibility, and SEO simultaneously.",
    value: "$108/year",
    steps: "Go to polypane.app/github-students\nSign in with your GitHub student account\nActivate your free 1-year license",
    url: "https://polypane.app/github-students/",
    featured: false,
  },
  {
    slug: "icons8-students",
    name: "Icons8",
    logo: "/logos/icons8-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "3 months free access to icons, photos & illustrations",
    description: "Icons8 offers students 3 months of free access to their full library of icons, stock photos, illustrations, and music through the GitHub Student Developer Pack.",
    value: "$90 (3 months)",
    steps: "Go to icons8.com/github-students\nSign in with your GitHub student account\nActivate your 3-month subscription",
    url: "https://icons8.com/github-students",
    featured: false,
  },
  {
    slug: "iconscout-students",
    name: "Iconscout",
    logo: "/logos/iconscout-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "1 year free access to 6M+ design assets",
    description: "Iconscout gives students 1 year of free access to over 6 million icons, illustrations, 3D assets, and Lottie animations through the GitHub Student Developer Pack.",
    value: "$144/year",
    steps: "Go to iconscout.com/github-students\nSign in with your GitHub student account\nActivate your free 1-year plan",
    url: "https://iconscout.com/github-students",
    featured: false,
  },
  {
    slug: "typeform-students",
    name: "Typeform",
    logo: "/logos/typeform-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free Professional plan for 1 year via GitHub Education",
    description: "Typeform provides students with 1 year of free Professional plan through the GitHub Student Developer Pack. Create beautiful surveys, quizzes, and forms with logic jumps.",
    value: "$300/year",
    steps: "Go to product.typeform.com/github\nSign in with your GitHub student account\nActivate your free Professional plan",
    url: "https://product.typeform.com/github/",
    featured: false,
  },
  {
    slug: "mailgun-students",
    name: "Mailgun",
    logo: "/logos/mailgun-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "12 months free with 20,000 emails/month via GitHub Education",
    description: "Mailgun gives students 12 months of free email API service with 20,000 emails per month through the GitHub Student Developer Pack. Send transactional and marketing emails via API.",
    value: "$420/year",
    steps: "Go to mailgun.com/github-students\nSign in with your GitHub student account\nActivate your free 12-month plan",
    url: "https://www.mailgun.com/github-students/",
    featured: false,
  },
  {
    slug: "honeybadger-students",
    name: "Honeybadger",
    logo: "/logos/honeybadger-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Small plan for 1 year — error monitoring",
    description: "Honeybadger provides students with 1 year of free error monitoring through the GitHub Student Developer Pack. Track exceptions, uptime, and check-ins for your applications.",
    value: "$348/year",
    steps: "Go to honeybadger.io/github-students\nSign in with your GitHub student account\nActivate your free 1-year Small plan",
    url: "https://www.honeybadger.io/github-students/",
    featured: false,
  },
  {
    slug: "simple-analytics-students",
    name: "Simple Analytics",
    logo: "/logos/simple-analytics-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free privacy-first analytics for 1 year",
    description: "Simple Analytics offers students 1 year of free privacy-friendly website analytics. No cookies, fully GDPR compliant, with a clean dashboard and API access.",
    value: "$108/year",
    steps: "Go to simpleanalytics.com/students\nVerify your student status\nActivate your free 1-year Starter plan",
    url: "https://simpleanalytics.com/students",
    featured: false,
  },
  {
    slug: "crowdin-students",
    name: "Crowdin",
    logo: "/logos/crowdin-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Bronze plan for 12 months — localization platform",
    description: "Crowdin gives students 12 months of free Bronze plan through the GitHub Student Developer Pack. Translate and localize your apps with collaborative tools and integrations.",
    value: "$480/year",
    steps: "Go to crowdin.com/page/github-students\nSign in with your GitHub student account\nActivate your free 12-month Bronze plan",
    url: "https://crowdin.com/page/github-students",
    featured: false,
  },
  {
    slug: "adafruit-students",
    name: "Adafruit",
    logo: "/logos/adafruit-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Adafruit IO+ for 1 year — IoT platform",
    description: "Adafruit gives students 1 year of free IO+ access through the GitHub Student Developer Pack. Build IoT projects with dashboards, data logging, and MQTT support.",
    value: "$120/year",
    steps: "Go to adafruit.com/github-students\nSign in with your GitHub student account\nActivate your free Adafruit IO+ plan",
    url: "https://www.adafruit.com/github-students",
    featured: false,
  },
  {
    slug: "xojo-students",
    name: "Xojo",
    logo: "/logos/xojo-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free cross-platform IDE via GitHub Education",
    description: "Xojo offers students a free Desktop license through the GitHub Student Developer Pack. Build native cross-platform apps for macOS, Windows, and Linux with one codebase.",
    value: "$150/year",
    steps: "Go to xojo.com/githubstudent\nSign in with your GitHub student account\nDownload Xojo and activate your free license",
    url: "https://www.xojo.com/githubstudent/",
    featured: false,
  },
  {
    slug: "codescene-students",
    name: "CodeScene",
    logo: "/logos/codescene-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free code analysis tool via GitHub Education",
    description: "CodeScene provides students with free access to behavioral code analysis through the GitHub Student Developer Pack. Identify hotspots, technical debt, and team coordination issues.",
    value: "$150/year",
    steps: "Go to codescene.com/github-students\nSign in with your GitHub student account\nActivate your free student account",
    url: "https://codescene.com/github-students",
    featured: false,
  },
  {
    slug: "baremetrics-students",
    name: "Baremetrics",
    logo: "/logos/baremetrics-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free SaaS analytics via GitHub Education",
    description: "Baremetrics gives students free access to subscription analytics through the GitHub Student Developer Pack. Track MRR, churn, LTV, and other SaaS metrics for your projects.",
    value: "$200/year",
    steps: "Go to baremetrics.com/github-students\nSign in with your GitHub student account\nConnect your Stripe account for free analytics",
    url: "https://baremetrics.com/github-students",
    featured: false,
  },
  {
    slug: "gorails-students",
    name: "GoRails",
    logo: "/logos/gorails-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "12 months free Ruby on Rails tutorials",
    description: "GoRails offers students 12 months of free access to their Ruby on Rails screencasts and tutorials through the GitHub Student Developer Pack. Learn Rails from beginner to advanced.",
    value: "$228/year",
    steps: "Go to gorails.com/github-students\nSign in with your GitHub student account\nActivate your free 12-month subscription",
    url: "https://gorails.com/github-students",
    featured: false,
  },
  {
    slug: "interview-cake-students",
    name: "Interview Cake",
    logo: "/logos/interview-cake-students.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "3 weeks free access to coding interview prep",
    description: "Interview Cake provides students with 3 weeks of free access to their full course of coding interview practice problems through the GitHub Student Developer Pack.",
    value: "$150 (3 weeks)",
    steps: "Go to interviewcake.com/github-students\nSign in with your GitHub student account\nActivate your free 3-week access",
    url: "https://www.interviewcake.com/github-students",
    featured: false,
  },
  {
    slug: "working-copy-students",
    name: "Working Copy",
    logo: "/logos/working-copy-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free Pro upgrade for iOS Git client",
    description: "Working Copy offers students a free Pro upgrade for their powerful iOS Git client. Clone repos, make commits, push changes, and manage branches directly from your iPad or iPhone.",
    value: "$30 license",
    steps: "Go to workingcopy.app/education\nRequest a free Pro license with your .edu email\nActivate Pro features in the app",
    url: "https://workingcopy.app/education/",
    featured: false,
  },
  {
    slug: "coveralls-students",
    name: "Coveralls",
    logo: "/logos/coveralls-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free unlimited code coverage for private repos",
    description: "Coveralls gives students unlimited private repo access through the GitHub Student Developer Pack. Track test coverage, identify untested code, and improve code quality.",
    value: "$120/year",
    steps: "Go to coveralls.io/github-students\nSign in with your GitHub student account\nActivate unlimited private repos",
    url: "https://coveralls.io/github-students",
    featured: false,
  },
  {
    slug: "name-com-students",
    name: "Name.com",
    logo: "/logos/name-com-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free domain + Advanced Security SSL for 1 year",
    description: "Name.com gives students a free domain registration and Advanced Security SSL certificate for 1 year through the GitHub Student Developer Pack.",
    value: "$30/year",
    steps: "Go to name.com/partner/github-students\nSign in with your GitHub student account\nRegister your free domain and SSL",
    url: "https://www.name.com/partner/github-students",
    featured: false,
  },
  {
    slug: "dot-tech-domains",
    name: ".tech Domains",
    logo: "/logos/dot-tech-domains.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free .tech domain for 1 year via GitHub Education",
    description: ".tech Domains offers students a free .tech domain for 1 year through the GitHub Student Developer Pack. Perfect for portfolio sites and tech projects.",
    value: "$25/year",
    steps: "Go to get.tech/github-student-developer-pack\nSign in with your GitHub student account\nRegister your free .tech domain",
    url: "https://get.tech/github-student-developer-pack",
    featured: false,
  },
  {
    slug: "envato-elements-students",
    name: "Envato Elements",
    logo: "/logos/envato-elements-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "50% off unlimited creative assets for students",
    description: "Envato Elements offers students 50% off their subscription with unlimited downloads of templates, graphics, fonts, stock photos, videos, and music for creative projects.",
    value: "50% off ($198/year savings)",
    steps: "Go to elements.envato.com/pricing/students\nVerify your student status\nGet 50% off your subscription",
    url: "https://elements.envato.com/pricing/students",
    featured: false,
  },
  {
    slug: "rhino3d-students",
    name: "Rhino 3D",
    logo: "/logos/rhino3d-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "80% off educational license for 3D modeling",
    description: "Rhino 3D offers students an educational license at 80% off the commercial price. Industry-standard NURBS-based 3D modeling for architecture, product design, and jewelry.",
    value: "80% off ($795 vs $995)",
    steps: "Go to rhino3d.com/for/education\nVerify your student status\nPurchase educational license at discounted price",
    url: "https://www.rhino3d.com/for/education/",
    featured: false,
  },
  {
    slug: "chaos-vray-students",
    name: "Chaos V-Ray",
    logo: "/logos/chaos-vray-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "Free student license for V-Ray rendering",
    description: "Chaos offers students a free educational license for V-Ray, the industry-standard rendering engine. Create photorealistic renders for architecture, VFX, and product visualization.",
    value: "$600+/year",
    steps: "Go to chaos.com/education/students\nRegister with your .edu email\nDownload V-Ray for your 3D application",
    url: "https://www.chaos.com/education/students",
    featured: false,
  },
  {
    slug: "shapr3d-students",
    name: "Shapr3D",
    logo: "/logos/shapr3d-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "1 year free Business plan for 3D CAD modeling",
    description: "Shapr3D gives students 1 year of free Business plan access. Create 3D CAD models on iPad, Mac, and Windows with an intuitive interface for engineering and design.",
    value: "$300/year",
    steps: "Go to shapr3d.com/education\nApply with your .edu email\nActivate your free 1-year Business plan",
    url: "https://www.shapr3d.com/education",
    featured: false,
  },
  {
    slug: "qt-students",
    name: "Qt",
    logo: "/logos/qt-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free educational license for cross-platform development",
    description: "Qt offers students a free educational license for their cross-platform development framework. Build desktop, mobile, and embedded applications with C++ and QML.",
    value: "$500+/year",
    steps: "Go to qt.io/qt-educational-license\nApply with your .edu email\nDownload Qt with full commercial features",
    url: "https://www.qt.io/qt-educational-license",
    featured: false,
  },
  {
    slug: "ptc-creo-students",
    name: "PTC Creo",
    logo: "/logos/ptc-creo-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "Free download of professional CAD software",
    description: "PTC offers students a free download of Creo, their industry-leading 3D CAD software. Design, analyze, and manufacture products with parametric and direct modeling tools.",
    value: "$2,310/year",
    steps: "Go to ptc.com/en/products/education/free-software/creo-college-download\nRegister with your .edu email\nDownload and install Creo for free",
    url: "https://www.ptc.com/en/products/education/free-software/creo-college-download",
    featured: true,
  },
  {
    slug: "gurobi-students",
    name: "Gurobi",
    logo: "/logos/gurobi-students.svg",
    category: "Dev",
    audiences: ["Students"],
    tagline: "Free academic license for optimization solver",
    description: "Gurobi provides students with a free academic license for their mathematical optimization solver. Solve linear, quadratic, and mixed-integer programming problems.",
    value: "$12,000+/year",
    steps: "Go to gurobi.com/academia/academic-program-and-licenses\nRegister with your .edu email\nDownload Gurobi with full academic license",
    url: "https://www.gurobi.com/academia/academic-program-and-licenses/",
    featured: false,
  },
  {
    slug: "minecraft-education",
    name: "Minecraft Education",
    logo: "/logos/minecraft-education.svg",
    category: "Learning",
    audiences: ["Students"],
    tagline: "Free for schools with qualifying Microsoft 365 licenses",
    description: "Minecraft Education is available free for students and educators at schools with qualifying Microsoft 365 licenses. Learn coding, STEM, history, and collaboration through gameplay.",
    value: "Free (with M365 edu license)",
    steps: "Go to education.minecraft.net/en-us/licensing\nCheck if your school has a qualifying M365 license\nDownload and sign in with your school account",
    url: "https://education.minecraft.net/en-us/licensing",
    featured: false,
  },
  {
    slug: "basecamp-students",
    name: "Basecamp",
    logo: "/logos/basecamp-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free for students and teachers",
    description: "Basecamp offers free accounts for students and teachers. Get project management, team communication, file sharing, and to-do lists for your academic projects.",
    value: "$180/year",
    steps: "Go to basecamp.com/discounts\nApply with your .edu email\nGet a free Basecamp account",
    url: "https://basecamp.com/discounts",
    featured: false,
  },
  {
    slug: "prezi-students",
    name: "Prezi",
    logo: "/logos/prezi-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Edu Plus plan at student pricing",
    description: "Prezi offers students discounted access to Edu Plus with dynamic presentations, video features, and analytics. Create engaging zoomable presentations for classes and projects.",
    value: "50% off ($60/year savings)",
    steps: "Go to prezi.com/pricing/edu\nVerify your student status with .edu email\nGet the Edu Plus plan at student pricing",
    url: "https://prezi.com/pricing/edu/",
    featured: false,
  },
  {
    slug: "lucidchart-students",
    name: "Lucidchart",
    logo: "/logos/lucidchart-students.svg",
    category: "SaaS",
    audiences: ["Students"],
    tagline: "Free educational upgrade for diagramming",
    description: "Lucidchart provides students with a free upgrade to their educational plan. Create flowcharts, UML diagrams, wireframes, and technical diagrams with real-time collaboration.",
    value: "$108/year",
    steps: "Go to lucidchart.com/pages/usecase/education\nRegister with your .edu email\nGet free educational plan upgrade",
    url: "https://www.lucidchart.com/pages/usecase/education",
    featured: false,
  },
  {
    slug: "mubi-students",
    name: "Mubi",
    logo: "/logos/mubi-students.svg",
    category: "Entertainment",
    audiences: ["Students"],
    tagline: "90 days free indie cinema streaming",
    description: "Mubi offers students 90 days of free access to their curated collection of independent, classic, and award-winning films from around the world.",
    value: "90 days free ($36 value)",
    steps: "Go to mubi.com/promos/student\nVerify your student status\nStart your 90-day free trial",
    url: "https://mubi.com/promos/student",
    featured: false,
  },
  {
    slug: "lumion-students",
    name: "Lumion",
    logo: "/logos/lumion-students.svg",
    category: "Design",
    audiences: ["Students"],
    tagline: "Free educational license for 3D rendering",
    description: "Lumion provides students with a free educational license for their real-time 3D rendering software. Create stunning architectural visualizations with drag-and-drop simplicity.",
    value: "$1,500+/year",
    steps: "Go to lumion.com/educational-licenses.html\nApply through your educational institution\nDownload Lumion with free educational license",
    url: "https://lumion.com/educational-licenses.html",
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

  // Filter out duplicates
  const toAdd = newDeals.filter(d => {
    if (existingSlugs.has(d.slug) || EXISTING_SLUGS.has(d.slug)) {
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
    // Rate limit — Notion API allows ~3 requests/sec
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\nDone. Added ${added}/${toAdd.length} deals.`);
  console.log(`Total deals should now be: ${existingSlugs.size + added}`);
}

main().catch(console.error);
