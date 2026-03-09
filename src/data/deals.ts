export type Category =
  | "Dev"
  | "AI"
  | "SaaS"
  | "Learning"
  | "Cloud"
  | "Design"
  | "Entertainment";

export type Audience = "students" | "startups" | "opensource";

export type Deal = {
  slug: string;
  name: string;
  logo: string;
  category: Category;
  audiences: Audience[];
  tagline: string;
  description: string;
  value: string;
  steps: string[];
  url: string;
  featured: boolean;
};

export const CATEGORY_CONFIG: Record<
  Category,
  { color: string; gradient: string; icon: string }
> = {
  Dev: { color: "blue", gradient: "from-blue-500 to-cyan-400", icon: "🛠" },
  AI: {
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    icon: "🤖",
  },
  SaaS: {
    color: "pink",
    gradient: "from-pink-500 to-rose-400",
    icon: "☁️",
  },
  Learning: {
    color: "amber",
    gradient: "from-amber-500 to-orange-400",
    icon: "📚",
  },
  Cloud: {
    color: "sky",
    gradient: "from-sky-500 to-blue-400",
    icon: "🌐",
  },
  Design: {
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    icon: "🎨",
  },
  Entertainment: {
    color: "red",
    gradient: "from-red-500 to-orange-400",
    icon: "🎮",
  },
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  students: "Students",
  startups: "Startups",
  opensource: "Open Source",
};

export const deals: Deal[] = [
  {
    slug: "github-education",
    name: "GitHub Student Developer Pack",
    logo: "/logos/github.svg",
    category: "Dev",
    audiences: ["students"],
    tagline: "Free access to 100+ developer tools",
    description:
      "The GitHub Student Developer Pack gives students free access to the best developer tools in one place. Includes GitHub Pro, free domains, cloud credits, and more.",
    value: "$200+/year",
    steps: [
      "Go to education.github.com",
      "Verify your student status with .edu email",
      "Get instant access to all partner offers",
    ],
    url: "https://education.github.com/pack",
    featured: true,
  },
  {
    slug: "notion-education",
    name: "Notion",
    logo: "/logos/notion.svg",
    category: "SaaS",
    audiences: ["students"],
    tagline: "Free Plus plan for students & educators",
    description:
      "Notion offers its Plus plan completely free for students and educators. Get unlimited blocks, file uploads, and 30-day version history.",
    value: "$96/year",
    steps: [
      "Sign up with your .edu email",
      "Go to Settings & Members",
      "Click 'Get free Education plan'",
    ],
    url: "https://www.notion.so/product/notion-for-education",
    featured: true,
  },
  {
    slug: "figma-education",
    name: "Figma",
    logo: "/logos/figma.svg",
    category: "Design",
    audiences: ["students"],
    tagline: "Free Professional plan for students",
    description:
      "Figma provides free access to its Professional plan for verified students. Includes unlimited projects, version history, and team libraries.",
    value: "$144/year",
    steps: [
      "Create a Figma account",
      "Apply at figma.com/education",
      "Verify with your .edu email",
    ],
    url: "https://www.figma.com/education/",
    featured: true,
  },
  {
    slug: "jetbrains-students",
    name: "JetBrains",
    logo: "/logos/jetbrains.svg",
    category: "Dev",
    audiences: ["students", "opensource"],
    tagline: "Free access to all JetBrains IDEs",
    description:
      "Get free access to all JetBrains professional developer tools including IntelliJ IDEA, PyCharm, WebStorm, and more.",
    value: "$649/year",
    steps: [
      "Go to jetbrains.com/student",
      "Apply with your .edu email or ISIC card",
      "Download any JetBrains IDE",
    ],
    url: "https://www.jetbrains.com/community/education/",
    featured: true,
  },
  {
    slug: "vercel-pro",
    name: "Vercel",
    logo: "/logos/vercel.svg",
    category: "Cloud",
    audiences: ["startups", "opensource"],
    tagline: "Free Pro plan for open source & startups",
    description:
      "Vercel offers sponsorship for open source projects and startup programs with Pro plan features including more bandwidth, builds, and team features.",
    value: "$240/year",
    steps: [
      "Apply at vercel.com/contact/sales",
      "Describe your open source or startup project",
      "Get approved for Pro plan",
    ],
    url: "https://vercel.com/guides/can-i-get-vercel-pro-for-open-source",
    featured: false,
  },
  {
    slug: "aws-activate",
    name: "AWS Activate",
    logo: "/logos/aws.svg",
    category: "Cloud",
    audiences: ["startups"],
    tagline: "Up to $100K in AWS credits for startups",
    description:
      "AWS Activate provides startups with credits, training, and support to get started on AWS. Founders tier gives $1K credits, Portfolio tier up to $100K.",
    value: "$100,000",
    steps: [
      "Go to aws.amazon.com/activate",
      "Choose Founders or Portfolio tier",
      "Apply with your startup details",
    ],
    url: "https://aws.amazon.com/activate/",
    featured: true,
  },
  {
    slug: "copilot-students",
    name: "GitHub Copilot",
    logo: "/logos/copilot.svg",
    category: "AI",
    audiences: ["students", "opensource"],
    tagline: "Free AI pair programming for students",
    description:
      "GitHub Copilot is free for verified students and open source maintainers. Get AI-powered code suggestions directly in your IDE.",
    value: "$100/year",
    steps: [
      "Verify student status on GitHub Education",
      "Enable Copilot in your GitHub settings",
      "Install the extension in your IDE",
    ],
    url: "https://github.com/features/copilot",
    featured: true,
  },
  {
    slug: "spotify-student",
    name: "Spotify Premium Student",
    logo: "/logos/spotify.svg",
    category: "Entertainment",
    audiences: ["students"],
    tagline: "Premium at half price for students",
    description:
      "Get Spotify Premium, Hulu, and SHOWTIME all for $5.99/month with a valid student email. Save over 50% compared to regular Premium.",
    value: "$72/year savings",
    steps: [
      "Go to spotify.com/student",
      "Verify your student status via SheerID",
      "Start your discounted subscription",
    ],
    url: "https://www.spotify.com/student/",
    featured: false,
  },
  {
    slug: "coursera-students",
    name: "Coursera for Campus",
    logo: "/logos/coursera.svg",
    category: "Learning",
    audiences: ["students"],
    tagline: "Free access to 3,800+ courses",
    description:
      "Coursera for Campus provides students with free access to over 3,800 courses from top universities and companies worldwide.",
    value: "$400+/year",
    steps: [
      "Check if your university is a Coursera partner",
      "Sign up with your .edu email",
      "Access courses through your campus portal",
    ],
    url: "https://www.coursera.org/campus/",
    featured: false,
  },
  {
    slug: "openai-api-startups",
    name: "OpenAI Startup Program",
    logo: "/logos/openai.svg",
    category: "AI",
    audiences: ["startups"],
    tagline: "API credits and support for AI startups",
    description:
      "OpenAI offers API credits, technical guidance, and go-to-market support for early-stage startups building with their API.",
    value: "$2,500+ credits",
    steps: [
      "Apply at openai.com/startups",
      "Describe your AI startup and use case",
      "Get approved for credits and support",
    ],
    url: "https://openai.com/",
    featured: true,
  },
  {
    slug: "linear-startups",
    name: "Linear",
    logo: "/logos/linear.svg",
    category: "SaaS",
    audiences: ["startups"],
    tagline: "Free Standard plan for startups",
    description:
      "Linear offers its Standard plan free for early-stage startups, giving teams access to powerful project management with cycles, roadmaps, and integrations.",
    value: "$200/year",
    steps: [
      "Go to linear.app and create a workspace",
      "Apply for the startup program with your company details",
      "Get upgraded to the Standard plan at no cost",
    ],
    url: "https://linear.app/startups",
    featured: false,
  },
  {
    slug: "stripe-atlas",
    name: "Stripe Atlas",
    logo: "/logos/stripe.svg",
    category: "SaaS",
    audiences: ["startups"],
    tagline: "Startup incorporation with $5K in credits",
    description:
      "Stripe Atlas helps founders incorporate a company in the US with a C-Corp, 83(b) election, and EIN filing. Atlas startups get access to over $5,000 in partner credits from tools like AWS, OpenAI, and more.",
    value: "$5,000+ credits",
    steps: [
      "Apply at stripe.com/atlas with your startup idea",
      "Complete the incorporation process online",
      "Claim partner credits from the Atlas dashboard",
    ],
    url: "https://stripe.com/atlas",
    featured: true,
  },
  {
    slug: "digitalocean-students",
    name: "DigitalOcean",
    logo: "/logos/digitalocean.svg",
    category: "Cloud",
    audiences: ["students", "startups"],
    tagline: "Free cloud credits via GitHub Education",
    description:
      "DigitalOcean provides $200 in cloud credits to students through the GitHub Student Developer Pack. Startups can also apply to the Hatch program for infrastructure credits and mentorship.",
    value: "$200+ credits",
    steps: [
      "Verify your student status via GitHub Education or apply to Hatch",
      "Claim your credits on the DigitalOcean dashboard",
      "Deploy droplets, databases, and Kubernetes clusters",
    ],
    url: "https://www.digitalocean.com/community/pages/hub-for-good",
    featured: false,
  },
  {
    slug: "mongodb-students",
    name: "MongoDB Atlas",
    logo: "/logos/mongodb.svg",
    category: "Dev",
    audiences: ["students", "opensource"],
    tagline: "Free M0 cluster forever + student credits",
    description:
      "MongoDB Atlas offers a free M0 shared cluster with 512 MB storage that never expires. Students can access additional credits and learning resources through the MongoDB for Academia program.",
    value: "Free tier",
    steps: [
      "Sign up at mongodb.com/atlas",
      "Create a free M0 cluster in your preferred region",
      "Apply for the student program with your .edu email for extra benefits",
    ],
    url: "https://www.mongodb.com/students",
    featured: false,
  },
  {
    slug: "slack-startups",
    name: "Slack",
    logo: "/logos/slack.svg",
    category: "SaaS",
    audiences: ["startups"],
    tagline: "Pro plan credits for startups",
    description:
      "Slack offers Pro plan credits to eligible startups through accelerator and VC partner programs. Get unlimited message history, integrations, and group calls for your growing team.",
    value: "$500/year",
    steps: [
      "Check if your accelerator or investor is a Slack partner",
      "Apply through the Slack for Startups page",
      "Receive Pro plan credits applied to your workspace",
    ],
    url: "https://slack.com/intl/en-us/solutions/startups",
    featured: false,
  },
  {
    slug: "docker-students",
    name: "Docker",
    logo: "/logos/docker.svg",
    category: "Dev",
    audiences: ["students", "opensource"],
    tagline: "Free Docker Pro for students & OSS",
    description:
      "Docker provides free access to Docker Pro for verified students through GitHub Education and for open source maintainers. Includes unlimited private repos, 5,000 image pulls per day, and Docker Scout.",
    value: "$60/year",
    steps: [
      "Verify your student status on GitHub Education or apply as an OSS maintainer",
      "Link your Docker Hub account to claim the benefit",
      "Enjoy Docker Pro features including unlimited private repositories",
    ],
    url: "https://www.docker.com/community/open-source/application/",
    featured: false,
  },
  {
    slug: "cloudflare-startups",
    name: "Cloudflare",
    logo: "/logos/cloudflare.svg",
    category: "Cloud",
    audiences: ["startups", "opensource"],
    tagline: "Free Pro plan and startup program",
    description:
      "Cloudflare offers its Pro plan free for open source projects and provides startup program participants with Workers, R2 storage, and enhanced security features at no cost.",
    value: "$240/year",
    steps: [
      "Apply to the Cloudflare startup or open source program",
      "Provide details about your project and usage needs",
      "Get upgraded to the Pro plan with enhanced features",
    ],
    url: "https://www.cloudflare.com/forstartups/",
    featured: false,
  },
  {
    slug: "supabase-startups",
    name: "Supabase",
    logo: "/logos/supabase.svg",
    category: "Dev",
    audiences: ["startups", "opensource"],
    tagline: "Credits and free tier for builders",
    description:
      "Supabase provides $2,500 in credits to startups through their partnership programs and offers a generous free tier for open source projects. Includes managed Postgres, auth, storage, and edge functions.",
    value: "$2,500 credits",
    steps: [
      "Apply to the Supabase startup program or OSS sponsorship",
      "Describe your project and expected database usage",
      "Receive credits applied to your Supabase organization",
    ],
    url: "https://supabase.com/partners/integrations",
    featured: true,
  },
  {
    slug: "railway-oss",
    name: "Railway",
    logo: "/logos/railway.svg",
    category: "Cloud",
    audiences: ["opensource", "students"],
    tagline: "Free hosting for open source projects",
    description:
      "Railway provides free deployment credits for open source projects and a trial tier for students. Deploy apps, databases, and cron jobs with a simple Git-based workflow.",
    value: "$60/year",
    steps: [
      "Sign up at railway.app with your GitHub account",
      "Apply for the OSS program or verify student status",
      "Deploy your project directly from a GitHub repository",
    ],
    url: "https://railway.app/open-source",
    featured: false,
  },
  {
    slug: "sentry-oss",
    name: "Sentry",
    logo: "/logos/sentry.svg",
    category: "Dev",
    audiences: ["opensource", "startups"],
    tagline: "Free error tracking for OSS & startups",
    description:
      "Sentry offers its Business plan free for open source projects and discounted plans for startups. Get real-time error tracking, performance monitoring, and session replay for your applications.",
    value: "$312/year",
    steps: [
      "Apply at sentry.io/for/open-source or through a startup partner",
      "Connect your repository and configure your SDK",
      "Start tracking errors and performance issues for free",
    ],
    url: "https://sentry.io/for/open-source/",
    featured: false,
  },
  {
    slug: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    logo: "/logos/adobe.svg",
    category: "Design",
    audiences: ["students"],
    tagline: "60%+ discount on all Creative Cloud apps",
    description:
      "Adobe offers students and teachers access to the entire Creative Cloud suite — Photoshop, Illustrator, Premiere Pro, After Effects, and 20+ more apps — at over 60% off the regular price.",
    value: "$360/year savings",
    steps: [
      "Go to adobe.com/creativecloud/buy/students.html",
      "Verify your student or teacher status via SheerID",
      "Subscribe to the full Creative Cloud plan at the discounted rate",
    ],
    url: "https://www.adobe.com/creativecloud/buy/students.html",
    featured: false,
  },
  {
    slug: "azure-students",
    name: "Microsoft Azure",
    logo: "/logos/azure.svg",
    category: "Cloud",
    audiences: ["students", "startups"],
    tagline: "Free $100 credit + services for students",
    description:
      "Azure for Students gives verified students $100 in cloud credits with no credit card required, plus free access to 25+ Azure services including App Service, Functions, and Cosmos DB. Startups can apply to Microsoft for Startups Founders Hub for up to $150K in credits.",
    value: "$100–$150,000",
    steps: [
      "Go to azure.microsoft.com/en-us/free/students",
      "Sign in with your school email to verify student status",
      "Claim $100 in credits and start deploying services",
    ],
    url: "https://azure.microsoft.com/en-us/free/students/",
    featured: false,
  },
  {
    slug: "youtube-premium-student",
    name: "YouTube Premium",
    logo: "/logos/youtube.svg",
    category: "Entertainment",
    audiences: ["students"],
    tagline: "Premium at student discount — ad-free videos & music",
    description:
      "YouTube Premium Student plan gives you ad-free videos, background play, offline downloads, and YouTube Music Premium at a reduced monthly price. Verify once and enjoy for up to 4 years.",
    value: "$72/year savings",
    steps: [
      "Go to youtube.com/premium/student",
      "Verify your enrollment via SheerID",
      "Start your discounted Premium subscription",
    ],
    url: "https://www.youtube.com/premium/student",
    featured: false,
  },
  {
    slug: "amazon-prime-student",
    name: "Amazon Prime Student",
    logo: "/logos/amazon.svg",
    category: "Entertainment",
    audiences: ["students"],
    tagline: "6-month free trial + 50% off Prime",
    description:
      "Amazon Prime Student includes a 6-month free trial followed by 50% off the regular Prime price. Get free two-day shipping, Prime Video, Prime Music, and exclusive student deals.",
    value: "$75/year savings",
    steps: [
      "Go to amazon.com/joinstudent",
      "Sign up with your .edu email",
      "Enjoy 6 months free, then 50% off Prime",
    ],
    url: "https://www.amazon.com/amazonprime?planOptimizationId=WLPStudentMonthlyElig498",
    featured: true,
  },
  {
    slug: "apple-developer-student",
    name: "Apple Developer Program",
    logo: "/logos/apple.svg",
    category: "Dev",
    audiences: ["students"],
    tagline: "Free membership via Apple Developer Academy",
    description:
      "Students can access Apple's development tools, beta software, and TestFlight for free. Those accepted into Apple Developer Academies get a full membership at no cost, including App Store distribution.",
    value: "$99/year",
    steps: [
      "Download Xcode and create a free Apple ID",
      "Apply to an Apple Developer Academy or use the free tier",
      "Access developer resources, betas, and TestFlight",
    ],
    url: "https://developer.apple.com/programs/",
    featured: false,
  },
  {
    slug: "apple-education-store",
    name: "Apple Education Pricing",
    logo: "/logos/apple.svg",
    category: "Entertainment",
    audiences: ["students"],
    tagline: "Save on Mac, iPad & more with student pricing",
    description:
      "Apple offers exclusive education pricing for current and newly accepted university students, parents buying for students, and faculty. Save up to $300 on Mac, up to $100 on iPad, and get free AirPods with qualifying purchases. AppleCare+ is also discounted 20%.",
    value: "Up to $400 off",
    steps: [
      "Go to apple.com/shop/education-pricing",
      "Browse Mac, iPad, and accessories at student prices",
      "Verify student status at checkout (UNiDAYS or .edu email)",
      "Get free AirPods with Mac or iPad purchase (seasonal)",
    ],
    url: "https://www.apple.com/shop/education-pricing",
    featured: true,
  },
];

export function getDealBySlug(slug: string): Deal | undefined {
  return deals.find((d) => d.slug === slug);
}

export function getDealsByCategory(category: Category): Deal[] {
  return deals.filter((d) => d.category === category);
}

export function getDealsByAudience(audience: Audience): Deal[] {
  return deals.filter((d) => d.audiences.includes(audience));
}

export function getFeaturedDeals(): Deal[] {
  return deals.filter((d) => d.featured);
}
