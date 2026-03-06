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
    featured: false,
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
