import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DEALS_DATABASE_ID;

// All deals to seed
const deals = [
  { slug: "github-education", name: "GitHub Student Developer Pack", logo: "/logos/github.svg", category: "Dev", audiences: ["Students", "Opensource"], tagline: "Free access to 100+ developer tools", description: "The GitHub Student Developer Pack gives students free access to the best developer tools in one place. Includes GitHub Pro, free domains, cloud credits, and more.", value: "$200+/year", steps: "Go to education.github.com\nVerify your student status with .edu email\nGet instant access to all partner offers", url: "https://education.github.com/pack", featured: true },
  { slug: "notion-education", name: "Notion", logo: "/logos/notion.svg", category: "SaaS", audiences: ["Students"], tagline: "Free Plus plan for students & educators", description: "Notion offers its Plus plan completely free for students and educators. Get unlimited blocks, file uploads, and 30-day version history.", value: "$96/year", steps: "Sign up with your .edu email\nGo to Settings & Members\nClick 'Get free Education plan'", url: "https://www.notion.so/product/notion-for-education", featured: true },
  { slug: "figma-education", name: "Figma", logo: "/logos/figma.svg", category: "Design", audiences: ["Students"], tagline: "Free Professional plan for students", description: "Figma provides free access to its Professional plan for verified students. Includes unlimited projects, version history, and team libraries.", value: "$144/year", steps: "Create a Figma account\nApply at figma.com/education\nVerify with your .edu email", url: "https://www.figma.com/education/", featured: true },
  { slug: "jetbrains-students", name: "JetBrains", logo: "/logos/jetbrains.svg", category: "Dev", audiences: ["Students", "Opensource"], tagline: "Free access to all JetBrains IDEs", description: "Get free access to all JetBrains professional developer tools including IntelliJ IDEA, PyCharm, WebStorm, and more.", value: "$649/year", steps: "Go to jetbrains.com/student\nApply with your .edu email or ISIC card\nDownload any JetBrains IDE", url: "https://www.jetbrains.com/community/education/", featured: true },
  { slug: "vercel-pro", name: "Vercel", logo: "/logos/vercel.svg", category: "Cloud", audiences: ["Startups", "Opensource"], tagline: "Free Pro plan for open source & startups", description: "Vercel offers sponsorship for open source projects and startup programs with Pro plan features including more bandwidth, builds, and team features.", value: "$240/year", steps: "Apply at vercel.com/contact/sales\nDescribe your open source or startup project\nGet approved for Pro plan", url: "https://vercel.com/guides/can-i-get-vercel-pro-for-open-source", featured: false },
  { slug: "aws-activate", name: "AWS Activate", logo: "/logos/aws.svg", category: "Cloud", audiences: ["Startups"], tagline: "Up to $100K in AWS credits for startups", description: "AWS Activate provides startups with credits, training, and support to get started on AWS. Founders tier gives $1K credits, Portfolio tier up to $100K.", value: "$100,000", steps: "Go to aws.amazon.com/activate\nChoose Founders or Portfolio tier\nApply with your startup details", url: "https://aws.amazon.com/activate/", featured: true },
  { slug: "copilot-students", name: "GitHub Copilot", logo: "/logos/copilot.svg", category: "AI", audiences: ["Students", "Opensource"], tagline: "Free AI pair programming for students", description: "GitHub Copilot is free for verified students and open source maintainers. Get AI-powered code suggestions directly in your IDE.", value: "$100/year", steps: "Verify student status on GitHub Education\nEnable Copilot in your GitHub settings\nInstall the extension in your IDE", url: "https://github.com/features/copilot", featured: true },
  { slug: "spotify-student", name: "Spotify Premium Student", logo: "/logos/spotify.svg", category: "Entertainment", audiences: ["Students"], tagline: "Premium at half price for students", description: "Get Spotify Premium, Hulu, and SHOWTIME all for $5.99/month with a valid student email. Save over 50% compared to regular Premium.", value: "$72/year savings", steps: "Go to spotify.com/student\nVerify your student status via SheerID\nStart your discounted subscription", url: "https://www.spotify.com/student/", featured: false },
  { slug: "coursera-students", name: "Coursera for Campus", logo: "/logos/coursera.svg", category: "Learning", audiences: ["Students"], tagline: "Free access to 3,800+ courses", description: "Coursera for Campus provides students with free access to over 3,800 courses from top universities and companies worldwide.", value: "$400+/year", steps: "Check if your university is a Coursera partner\nSign up with your .edu email\nAccess courses through your campus portal", url: "https://www.coursera.org/campus/", featured: false },
  { slug: "openai-api-startups", name: "OpenAI Startup Program", logo: "/logos/openai.svg", category: "AI", audiences: ["Startups"], tagline: "API credits and support for AI startups", description: "OpenAI offers API credits, technical guidance, and go-to-market support for early-stage startups building with their API.", value: "$2,500+ credits", steps: "Apply at openai.com/startups\nDescribe your AI startup and use case\nGet approved for credits and support", url: "https://openai.com/", featured: false },
  { slug: "linear-startups", name: "Linear", logo: "/logos/linear.svg", category: "SaaS", audiences: ["Startups"], tagline: "Free Standard plan for startups", description: "Linear offers its Standard plan free for early-stage startups. Includes unlimited issues, cycles, and project tracking for your team.", value: "$200/year", steps: "Go to linear.app/startups\nApply with your startup details\nGet approved for free Standard plan", url: "https://linear.app/", featured: false },
  { slug: "stripe-atlas", name: "Stripe Atlas", logo: "/logos/stripe.svg", category: "SaaS", audiences: ["Startups"], tagline: "Startup incorporation with $5K in credits", description: "Stripe Atlas helps you incorporate your company with a simple online process. Includes $5,000+ in partner credits from AWS, OpenAI, and more.", value: "$5,000+ credits", steps: "Go to stripe.com/atlas\nFill in your company details\nGet incorporated and receive partner credits", url: "https://stripe.com/atlas", featured: true },
  { slug: "digitalocean-students", name: "DigitalOcean", logo: "/logos/digitalocean.svg", category: "Cloud", audiences: ["Students", "Startups"], tagline: "Free cloud credits via GitHub Education", description: "DigitalOcean provides $200 in cloud credits through the GitHub Student Developer Pack, plus the Hatch program offers credits for startups.", value: "$200+ credits", steps: "Sign up via GitHub Student Developer Pack\nVerify your student status\nRedeem your $200 credit", url: "https://www.digitalocean.com/", featured: false },
  { slug: "mongodb-students", name: "MongoDB Atlas", logo: "/logos/mongodb.svg", category: "Dev", audiences: ["Students", "Opensource"], tagline: "Free M0 cluster forever + student credits", description: "MongoDB Atlas offers a free forever M0 cluster for everyone, plus additional credits and benefits for students through their education program.", value: "Free tier", steps: "Create a MongoDB Atlas account\nDeploy a free M0 cluster\nApply for student benefits with .edu email", url: "https://www.mongodb.com/", featured: false },
  { slug: "slack-startups", name: "Slack", logo: "/logos/slack.svg", category: "SaaS", audiences: ["Startups"], tagline: "Pro plan credits for startups", description: "Slack offers Pro plan credits for startups through various accelerator and partner programs. Get full messaging, integrations, and workflow features.", value: "$500/year", steps: "Check if your accelerator is a Slack partner\nApply through the startup program\nGet Pro plan credits applied to your workspace", url: "https://slack.com/", featured: false },
  { slug: "docker-students", name: "Docker", logo: "/logos/docker.svg", category: "Dev", audiences: ["Students", "Opensource"], tagline: "Free Docker Pro for students & OSS", description: "Docker provides free Pro subscriptions for verified students through GitHub Education and for open source project maintainers.", value: "$60/year", steps: "Verify student status via GitHub Education\nLink your Docker Hub account\nActivate Docker Pro features", url: "https://www.docker.com/", featured: false },
  { slug: "cloudflare-startups", name: "Cloudflare", logo: "/logos/cloudflare.svg", category: "Cloud", audiences: ["Startups", "Opensource"], tagline: "Free Pro plan and startup program", description: "Cloudflare offers its Pro plan features and Workers platform free for startups through their startup program, plus free plans for open source.", value: "$240/year", steps: "Apply at cloudflare.com/forstartups\nDescribe your startup or OSS project\nGet approved for Pro plan features", url: "https://www.cloudflare.com/", featured: false },
  { slug: "supabase-startups", name: "Supabase", logo: "/logos/supabase.svg", category: "Dev", audiences: ["Startups", "Opensource"], tagline: "Credits and free tier for builders", description: "Supabase offers generous free tier plus startup and open source programs with additional database credits and priority support.", value: "$2,500 credits", steps: "Sign up at supabase.com\nApply for startup or OSS program\nGet approved for additional credits", url: "https://supabase.com/", featured: true },
  { slug: "railway-oss", name: "Railway", logo: "/logos/railway.svg", category: "Cloud", audiences: ["Opensource", "Students"], tagline: "Free hosting for open source projects", description: "Railway provides free hosting credits for open source projects and students. Deploy databases, web services, and more with simple Git-based deploys.", value: "$60/year", steps: "Sign up at railway.app\nConnect your GitHub repository\nApply for OSS or student credits", url: "https://railway.app/", featured: false },
  { slug: "sentry-oss", name: "Sentry", logo: "/logos/sentry.svg", category: "Dev", audiences: ["Opensource", "Startups"], tagline: "Free error tracking for OSS & startups", description: "Sentry offers free error tracking and performance monitoring for open source projects, plus discounted plans for startups.", value: "$312/year", steps: "Sign up at sentry.io\nApply for OSS sponsorship or startup program\nGet free Team plan for your project", url: "https://sentry.io/", featured: false },
];

async function setupDatabase() {
  console.log("Setting up database properties...");

  await notion.databases.update({
    database_id: databaseId,
    properties: {
      "Name": { title: {} },
      "Slug": { rich_text: {} },
      "Logo": { rich_text: {} },
      "Category": {
        select: {
          options: [
            { name: "Dev", color: "blue" },
            { name: "AI", color: "purple" },
            { name: "SaaS", color: "pink" },
            { name: "Learning", color: "orange" },
            { name: "Cloud", color: "default" },
            { name: "Design", color: "green" },
            { name: "Entertainment", color: "red" },
          ],
        },
      },
      "Audiences": {
        multi_select: {
          options: [
            { name: "Students", color: "blue" },
            { name: "Startups", color: "orange" },
            { name: "Opensource", color: "green" },
          ],
        },
      },
      "Tagline": { rich_text: {} },
      "Description": { rich_text: {} },
      "Value": { rich_text: {} },
      "Steps": { rich_text: {} },
      "URL": { url: {} },
      "Featured": { checkbox: {} },
    },
  });

  console.log("Properties created!");
}

async function seedDeals() {
  console.log(`Seeding ${deals.length} deals...`);

  for (const deal of deals) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Name": { title: [{ text: { content: deal.name } }] },
        "Slug": { rich_text: [{ text: { content: deal.slug } }] },
        "Logo": { rich_text: [{ text: { content: deal.logo } }] },
        "Category": { select: { name: deal.category } },
        "Audiences": { multi_select: deal.audiences.map((a) => ({ name: a })) },
        "Tagline": { rich_text: [{ text: { content: deal.tagline } }] },
        "Description": { rich_text: [{ text: { content: deal.description } }] },
        "Value": { rich_text: [{ text: { content: deal.value } }] },
        "Steps": { rich_text: [{ text: { content: deal.steps } }] },
        "URL": { url: deal.url },
        "Featured": { checkbox: deal.featured },
      },
    });
    console.log(`  + ${deal.name}`);
  }

  console.log("Done! All deals seeded.");
}

async function main() {
  await setupDatabase();
  await seedDeals();
}

main().catch(console.error);
