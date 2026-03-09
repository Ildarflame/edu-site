import type { Category, Audience } from "./deals";

export type FAQ = {
  question: string;
  answer: string;
};

export type CategorySEO = {
  slug: string;
  category: Category;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  faqs: FAQ[];
};

export type AudienceSEO = {
  slug: string;
  audience: Audience;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  eligibility: string[];
  faqs: FAQ[];
};

export type AlternativeSEO = {
  slug: string;
  name: string;
  category: Category;
  intro: string;
};

export const CATEGORY_SEO: CategorySEO[] = [
  {
    slug: "dev",
    category: "Dev",
    title: "Free Developer Tools for Students & Startups 2026 | StudentPerks",
    metaDescription:
      "Get free access to JetBrains, Docker, GitHub, Supabase and more developer tools. Verified deals for students, startups, and open source projects.",
    heading: "Free Developer Tools & Credits",
    intro:
      "Access premium developer tools at zero cost. From IDEs like JetBrains to databases like MongoDB Atlas and Supabase, these verified deals give students, startups, and open source maintainers the professional tools they need to build great software.",
    faqs: [
      {
        question: "What free developer tools can students get?",
        answer:
          "Students can get free access to JetBrains IDEs, GitHub Pro, Docker Pro, MongoDB Atlas credits, and many more tools through education programs. Most require verification with a .edu email.",
      },
      {
        question: "Are these developer tools really free?",
        answer:
          "Yes. All deals listed are verified free plans, credits, or significant discounts offered by the companies themselves through official education, startup, or open source programs.",
      },
      {
        question: "How long do free developer tool licenses last?",
        answer:
          "Most student licenses last 1 year and can be renewed while you're enrolled. Open source licenses typically last as long as your project remains active. Startup credits vary by program.",
      },
    ],
  },
  {
    slug: "ai",
    category: "AI",
    title: "Free AI Tools for Students & Startups 2026 | StudentPerks",
    metaDescription:
      "Access free AI tools including GitHub Copilot and OpenAI API credits. Verified AI deals for students, startups, and open source developers.",
    heading: "Free AI Tools & API Credits",
    intro:
      "Build with cutting-edge AI without the cost. Get free access to code assistants like GitHub Copilot and API credits from OpenAI. These deals help students and startups integrate AI into their projects from day one.",
    faqs: [
      {
        question: "Can students get GitHub Copilot for free?",
        answer:
          "Yes. GitHub Copilot is free for verified students through the GitHub Student Developer Pack and for open source maintainers of popular projects.",
      },
      {
        question: "How can startups get free AI API credits?",
        answer:
          "Startups can apply to programs like OpenAI Startup Program for API credits, technical guidance, and go-to-market support. Many AI companies offer startup-specific tiers.",
      },
      {
        question: "Do I need experience to use these AI tools?",
        answer:
          "No. Most AI tools like GitHub Copilot work directly in your IDE and require no AI expertise. They enhance your existing workflow with intelligent suggestions.",
      },
    ],
  },
  {
    slug: "saas",
    category: "SaaS",
    title: "Free SaaS Tools for Students & Startups 2026 | StudentPerks",
    metaDescription:
      "Get free access to Notion, Linear, Slack, Stripe Atlas and more SaaS tools. Verified deals worth thousands for students and startups.",
    heading: "Free SaaS Tools & Pro Plans",
    intro:
      "Run your team on professional SaaS tools without paying a cent. From project management with Notion and Linear to team communication with Slack, these verified deals unlock premium plans for students and early-stage startups.",
    faqs: [
      {
        question: "What SaaS tools are free for students?",
        answer:
          "Students can get free access to Notion Plus plan, and many other SaaS tools through education verification. Most require a valid .edu email address.",
      },
      {
        question: "Can startups get free SaaS tools?",
        answer:
          "Yes. Many SaaS companies offer startup programs with free or heavily discounted plans. Stripe Atlas, Linear, and Slack all have dedicated startup tiers with credits and free upgrades.",
      },
      {
        question: "How do I verify my eligibility?",
        answer:
          "Most programs accept .edu emails for students. Startups typically need to describe their company and stage. Some programs require referrals from partner accelerators or VCs.",
      },
    ],
  },
  {
    slug: "learning",
    category: "Learning",
    title: "Free Learning Platforms for Students 2026 | StudentPerks",
    metaDescription:
      "Access free online courses from Coursera and other learning platforms. Verified education deals for students and developers.",
    heading: "Free Learning Platforms & Courses",
    intro:
      "Level up your skills with free access to world-class learning platforms. Get courses from top universities through Coursera for Campus and other education programs designed for students who want to learn without the financial burden.",
    faqs: [
      {
        question: "Can I get Coursera courses for free as a student?",
        answer:
          "Yes. If your university is a Coursera for Campus partner, you get free access to 3,800+ courses. Check with your school's IT department or sign up with your .edu email.",
      },
      {
        question: "Are certificates included in free learning deals?",
        answer:
          "It depends on the program. Some education deals include certificates, while others provide course access only. Check each deal's details for certificate availability.",
      },
      {
        question: "Do these learning platforms work worldwide?",
        answer:
          "Most platforms are available globally. Some deals may have geographic restrictions, but the majority of student programs accept international students with valid academic credentials.",
      },
    ],
  },
  {
    slug: "cloud",
    category: "Cloud",
    title: "Free Cloud Credits for Students & Startups 2026 | StudentPerks",
    metaDescription:
      "Get up to $150K in free cloud credits from AWS, Azure, DigitalOcean, Vercel, and more. Verified cloud deals for students and startups.",
    heading: "Free Cloud Credits & Hosting",
    intro:
      "Deploy your projects without worrying about infrastructure costs. Access free cloud credits from AWS Activate, Microsoft Azure, DigitalOcean, Vercel, Cloudflare, and Railway — collectively worth over $150K for eligible startups and students.",
    faqs: [
      {
        question: "How much free cloud credit can startups get?",
        answer:
          "Startups can get up to $100K from AWS Activate, up to $150K from Microsoft for Startups, plus credits from DigitalOcean, Vercel, and others. Total potential value exceeds $300K.",
      },
      {
        question: "Do students get free cloud hosting?",
        answer:
          "Yes. Students get $200 in DigitalOcean credits through GitHub Education, $100 in Azure credits, free Railway deployment credits, and Vercel's generous free tier.",
      },
      {
        question: "Can I combine multiple cloud credit programs?",
        answer:
          "Absolutely. There's no restriction against using credits from multiple providers. Many startups use AWS for compute, Vercel for frontend, and Cloudflare for CDN simultaneously.",
      },
      {
        question: "Do cloud credits expire?",
        answer:
          "Most cloud credits expire after 1-2 years. AWS Activate credits last 2 years, Azure student credits last 12 months. Check each program for specific terms.",
      },
    ],
  },
  {
    slug: "design",
    category: "Design",
    title: "Free Design Tools for Students 2026 | StudentPerks",
    metaDescription:
      "Get free Figma Professional plan and 60% off Adobe Creative Cloud. Verified design tool deals for students and educators.",
    heading: "Free Design Tools & Creative Software",
    intro:
      "Create stunning designs with professional tools at no cost. Students get free access to Figma's Professional plan and massive discounts on Adobe Creative Cloud, giving you the same tools used by professional designers worldwide.",
    faqs: [
      {
        question: "Can students get Figma for free?",
        answer:
          "Yes. Figma offers its Professional plan completely free for verified students. This includes unlimited projects, version history, and team libraries.",
      },
      {
        question: "How much is Adobe Creative Cloud for students?",
        answer:
          "Students and teachers get 60%+ off Adobe Creative Cloud, saving over $360 per year. This includes all 20+ apps like Photoshop, Illustrator, and Premiere Pro.",
      },
      {
        question: "Do I need a .edu email for design tool discounts?",
        answer:
          "Most design tool programs require student verification. Figma uses .edu email verification, while Adobe uses SheerID to verify student or teacher status.",
      },
    ],
  },
  {
    slug: "entertainment",
    category: "Entertainment",
    title: "Free Entertainment Deals for Students 2026 | StudentPerks",
    metaDescription:
      "Get student discounts on Spotify Premium, YouTube Premium, and Amazon Prime. Verified entertainment deals saving $200+/year.",
    heading: "Student Entertainment Deals & Discounts",
    intro:
      "Enjoy premium entertainment at student prices. Get 50% off Spotify Premium, discounted YouTube Premium, and 6 months free Amazon Prime Student. These verified deals save students over $200 per year on entertainment subscriptions.",
    faqs: [
      {
        question: "How much is Spotify for students?",
        answer:
          "Spotify Premium Student costs $5.99/month (regular is $11.99). It includes Spotify Premium, Hulu, and SHOWTIME. You need to verify student status via SheerID.",
      },
      {
        question: "Can international students get entertainment discounts?",
        answer:
          "Availability varies by country. Spotify Student is available in many countries, Amazon Prime Student is US-focused, and YouTube Premium Student is available in select regions.",
      },
      {
        question: "How long do student entertainment discounts last?",
        answer:
          "Most entertainment student plans last up to 4 years. You'll need to re-verify your student status annually. After graduation, you'll switch to regular pricing.",
      },
    ],
  },
];

export const AUDIENCE_SEO: AudienceSEO[] = [
  {
    slug: "students",
    audience: "students",
    title: "Free Developer Tools for Students 2026 | StudentPerks",
    metaDescription:
      "Browse all free developer tools, cloud credits, and pro plans available for students. Verified deals worth $500K+ with .edu email.",
    heading: "Free Tools for Students",
    intro:
      "Your .edu email unlocks hundreds of dollars in free developer tools, cloud credits, and pro plan upgrades. From JetBrains IDEs to AWS credits, these verified deals help students build real projects with professional tools.",
    eligibility: [
      "Valid .edu email address or student ID",
      "Enrolled in accredited college or university",
      "Some programs accept high school and bootcamp students",
      "Most deals renew annually while enrolled",
    ],
    faqs: [
      {
        question: "Do I need a .edu email to get student deals?",
        answer:
          "Most programs require a .edu email, but some accept other forms of verification like ISIC cards, enrollment letters, or verification through services like SheerID.",
      },
      {
        question: "Can international students get these deals?",
        answer:
          "Yes. Most programs accept international students. GitHub Education, JetBrains, and Figma all have global student programs. Some deals may have regional restrictions.",
      },
      {
        question: "What happens to my free tools after graduation?",
        answer:
          "Most student licenses expire after graduation. Some tools offer transition pricing or free tiers you can continue using. Plan to migrate before your student status expires.",
      },
      {
        question: "How do I verify my student status?",
        answer:
          "Verification methods include .edu email, GitHub Education verification, SheerID, ISIC card, or uploading an enrollment document. Each program specifies accepted methods.",
      },
    ],
  },
  {
    slug: "startups",
    audience: "startups",
    title: "Free Tools & Credits for Startups 2026 | StudentPerks",
    metaDescription:
      "Get up to $300K in free cloud credits, SaaS tools, and startup programs. AWS, Azure, Stripe Atlas, and more verified startup deals.",
    heading: "Free Tools for Startups",
    intro:
      "Launch and scale your startup with free cloud credits, SaaS tools, and infrastructure. From $100K in AWS credits to free Stripe Atlas incorporation, these programs are designed to help early-stage startups reduce burn rate and ship faster.",
    eligibility: [
      "Early-stage startup (pre-seed to Series A)",
      "Some programs require accelerator or VC backing",
      "Incorporated company or verifiable project",
      "Most programs are available globally",
    ],
    faqs: [
      {
        question: "How much free credit can my startup get?",
        answer:
          "Startups can access over $300K in combined credits: up to $100K from AWS Activate, $150K from Microsoft for Startups, plus credits from DigitalOcean, Supabase, and more.",
      },
      {
        question: "Do I need VC funding to qualify?",
        answer:
          "Not always. Programs like AWS Activate Founders tier and Stripe Atlas are open to all founders. Some premium tiers require accelerator or VC referrals.",
      },
      {
        question: "Can solo founders apply for startup programs?",
        answer:
          "Yes. Most startup programs accept solo founders. You'll need a registered business or verifiable project, but team size is rarely a disqualifying factor.",
      },
    ],
  },
  {
    slug: "opensource",
    audience: "opensource",
    title: "Free Tools for Open Source Projects 2026 | StudentPerks",
    metaDescription:
      "Get free hosting, CI/CD, developer tools, and pro plans for your open source project. Verified deals from GitHub, Docker, Sentry, and more.",
    heading: "Free Tools for Open Source",
    intro:
      "Maintain and grow your open source project with free professional tools. Get Docker Pro, Sentry Business, Vercel Pro, and Cloudflare Pro at no cost. These programs support the open source ecosystem by providing maintainers with the infrastructure they need.",
    eligibility: [
      "Active open source project on GitHub or GitLab",
      "Project must be publicly available under an OSI-approved license",
      "Some programs require minimum contributor or star count",
      "Maintainer or core contributor status",
    ],
    faqs: [
      {
        question: "What qualifies as an open source project?",
        answer:
          "Most programs require a publicly available repository with an OSI-approved license (MIT, Apache 2.0, GPL, etc.). Some require minimum activity, stars, or contributor counts.",
      },
      {
        question: "Can I use free tools for commercial open source?",
        answer:
          "It depends on the program. Many allow commercial open source (e.g., Docker, Sentry), but check each program's terms. Some are limited to non-commercial community projects.",
      },
      {
        question: "How do I apply as an open source maintainer?",
        answer:
          "Most programs have a simple application form where you link your repository. Some verify through GitHub's maintainer status. Response times vary from instant to a few weeks.",
      },
    ],
  },
];

export const ALTERNATIVES_SEO: AlternativeSEO[] = [
  {
    slug: "aws",
    name: "AWS",
    category: "Cloud",
    intro:
      "Looking for free alternatives to Amazon Web Services? These cloud platforms offer free credits, hosting, and infrastructure for students, startups, and open source projects.",
  },
  {
    slug: "vercel",
    name: "Vercel",
    category: "Cloud",
    intro:
      "Explore free alternatives to Vercel for deploying your web applications. These platforms offer hosting, CI/CD, and edge functions with generous free tiers.",
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    category: "AI",
    intro:
      "Discover free alternatives to GitHub Copilot for AI-powered coding assistance. These tools offer code completion, generation, and intelligent suggestions.",
  },
  {
    slug: "figma",
    name: "Figma",
    category: "Design",
    intro:
      "Find free alternatives to Figma for UI/UX design. These design tools offer collaborative features, prototyping, and professional design capabilities.",
  },
  {
    slug: "jetbrains",
    name: "JetBrains",
    category: "Dev",
    intro:
      "Explore free alternatives to JetBrains IDEs for software development. These developer tools offer intelligent code editing, debugging, and project management.",
  },
  {
    slug: "notion",
    name: "Notion",
    category: "SaaS",
    intro:
      "Discover free alternatives to Notion for team collaboration and project management. These tools offer notes, databases, wikis, and task management features.",
  },
  {
    slug: "slack",
    name: "Slack",
    category: "SaaS",
    intro:
      "Find free alternatives to Slack for team communication. These platforms offer messaging, channels, integrations, and collaboration features.",
  },
  {
    slug: "docker",
    name: "Docker",
    category: "Dev",
    intro:
      "Explore free alternatives to Docker for containerization and deployment. These tools help you build, ship, and run applications in isolated environments.",
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    category: "Dev",
    intro:
      "Discover free alternatives to MongoDB for database management. These platforms offer managed databases, storage, and backend-as-a-service features.",
  },
  {
    slug: "stripe",
    name: "Stripe",
    category: "SaaS",
    intro:
      "Find free alternatives to Stripe for payment processing and startup incorporation. These tools offer billing, payments, and financial infrastructure.",
  },
  {
    slug: "cloudflare",
    name: "Cloudflare",
    category: "Cloud",
    intro:
      "Explore free alternatives to Cloudflare for CDN, security, and edge computing. These platforms offer DDoS protection, caching, and performance optimization.",
  },
  {
    slug: "sentry",
    name: "Sentry",
    category: "Dev",
    intro:
      "Discover free alternatives to Sentry for error tracking and performance monitoring. These tools help you find and fix bugs in your applications.",
  },
  {
    slug: "adobe",
    name: "Adobe Creative Cloud",
    category: "Design",
    intro:
      "Find free alternatives to Adobe Creative Cloud for graphic design, video editing, and creative work. These tools offer professional creative capabilities at no cost.",
  },
  {
    slug: "coursera",
    name: "Coursera",
    category: "Learning",
    intro:
      "Explore free alternatives to Coursera for online learning. These platforms offer courses, certifications, and educational content from top institutions.",
  },
  {
    slug: "spotify",
    name: "Spotify",
    category: "Entertainment",
    intro:
      "Discover free alternatives to Spotify for music streaming. These entertainment platforms offer student discounts and free tiers for media consumption.",
  },
];

export type ComparisonSEO = {
  slug: string;
  deal1Slug: string;
  deal2Slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  verdict: string;
};

export const COMPARISON_SEO: ComparisonSEO[] = [
  {
    slug: "vercel-vs-railway",
    deal1Slug: "vercel-pro",
    deal2Slug: "railway-oss",
    title: "Vercel vs Railway: Free Hosting Comparison 2026 | StudentPerks",
    metaDescription: "Compare Vercel and Railway free tiers for students and startups. Side-by-side features, pricing, and which is better for your project.",
    intro: "Both Vercel and Railway offer generous free tiers for developers. Vercel excels at frontend and serverless deployment, while Railway provides full-stack hosting with databases included.",
    verdict: "Choose Vercel for frontend/Next.js projects. Choose Railway for full-stack apps that need databases and background workers.",
  },
  {
    slug: "supabase-vs-mongodb",
    deal1Slug: "supabase-startups",
    deal2Slug: "mongodb-students",
    title: "Supabase vs MongoDB Atlas: Free Database Comparison 2026 | StudentPerks",
    metaDescription: "Compare Supabase and MongoDB Atlas free tiers. PostgreSQL vs NoSQL, real-time vs aggregation, and which is better for students and startups.",
    intro: "Supabase offers a free PostgreSQL database with real-time subscriptions and auth. MongoDB Atlas provides a free NoSQL cluster with flexible schema and powerful aggregation pipeline.",
    verdict: "Choose Supabase for relational data with real-time needs. Choose MongoDB for flexible schemas and document-oriented workloads.",
  },
  {
    slug: "github-copilot-vs-cursor",
    deal1Slug: "copilot-students",
    deal2Slug: "copilot-students",
    title: "GitHub Copilot vs Cursor: Free AI Coding Tools 2026 | StudentPerks",
    metaDescription: "Compare GitHub Copilot (free for students) and Cursor free tier. AI code completion, features, and which is better for student developers.",
    intro: "GitHub Copilot is free for verified students and offers inline AI completions in VS Code. Cursor is an AI-first editor with a generous free tier that includes chat and code generation.",
    verdict: "Students should start with Copilot (completely free). Try Cursor's free tier if you want an integrated AI-first editing experience.",
  },
  {
    slug: "aws-vs-google-cloud",
    deal1Slug: "aws-activate",
    deal2Slug: "aws-activate",
    title: "AWS Activate vs Google Cloud Credits: Free Cloud Comparison 2026 | StudentPerks",
    metaDescription: "Compare AWS Activate and Google Cloud free credit programs for startups and students. Credits amount, eligibility, and which cloud to choose.",
    intro: "AWS Activate offers up to $100,000 in credits for startups. Google Cloud for Startups provides up to $200,000. Both have student programs with smaller but still significant credits.",
    verdict: "AWS has a larger ecosystem. Google Cloud offers more credits. Choose based on your tech stack and which services you need most.",
  },
  {
    slug: "figma-vs-framer",
    deal1Slug: "figma-education",
    deal2Slug: "figma-education",
    title: "Figma vs Framer: Free Design Tools 2026 | StudentPerks",
    metaDescription: "Compare Figma and Framer free plans for students and startups. Design capabilities, prototyping, and which is better for your workflow.",
    intro: "Figma is the industry-standard collaborative design tool with a generous free plan. Framer combines design with code-powered interactions and can publish directly to the web.",
    verdict: "Use Figma for team-based UI/UX design. Use Framer when you want design-to-production website building with interactions.",
  },
  {
    slug: "notion-vs-linear",
    deal1Slug: "notion-education",
    deal2Slug: "linear-startups",
    title: "Notion vs Linear: Free Project Management 2026 | StudentPerks",
    metaDescription: "Compare Notion and Linear free plans for startups. Flexible workspace vs focused issue tracking, and which suits your team better.",
    intro: "Notion is an all-in-one workspace for docs, databases, and project management. Linear is a focused issue tracker built for speed and developer workflows.",
    verdict: "Use Notion for docs and flexible project management. Use Linear for fast, developer-centric issue tracking and sprint planning.",
  },
  {
    slug: "sentry-vs-datadog",
    deal1Slug: "sentry-oss",
    deal2Slug: "sentry-oss",
    title: "Sentry vs Datadog: Free Monitoring Tools 2026 | StudentPerks",
    metaDescription: "Compare Sentry and Datadog free tiers for error tracking and monitoring. Features, limits, and which is better for startups.",
    intro: "Sentry specializes in error tracking and performance monitoring with a generous free tier. Datadog offers full-stack observability with infrastructure monitoring, APM, and log management.",
    verdict: "Start with Sentry for error tracking. Add Datadog when you need infrastructure monitoring and APM at scale.",
  },
  {
    slug: "stripe-vs-lemonsqueezy",
    deal1Slug: "stripe-atlas",
    deal2Slug: "stripe-atlas",
    title: "Stripe vs Lemon Squeezy: Free Payment Processing 2026 | StudentPerks",
    metaDescription: "Compare Stripe and Lemon Squeezy for startups. Payment processing features, pricing, and which is easier to set up.",
    intro: "Stripe is the most popular payment platform with startup credits available. Lemon Squeezy is an all-in-one platform handling payments, taxes, and subscriptions with simpler setup.",
    verdict: "Use Stripe for maximum flexibility and ecosystem. Use Lemon Squeezy for simplicity and built-in tax handling.",
  },
  {
    slug: "docker-vs-podman",
    deal1Slug: "docker-students",
    deal2Slug: "docker-students",
    title: "Docker vs Podman: Free Container Tools 2026 | StudentPerks",
    metaDescription: "Compare Docker (free for students) and Podman (always free). Container features, security, and which to choose for development.",
    intro: "Docker is the standard container platform with free access for students and open source. Podman is a daemonless, rootless container engine that's always free and compatible with Docker commands.",
    verdict: "Use Docker for ecosystem compatibility and Docker Desktop features. Use Podman for rootless security and no daemon requirement.",
  },
  {
    slug: "jetbrains-vs-vscode",
    deal1Slug: "jetbrains-students",
    deal2Slug: "jetbrains-students",
    title: "JetBrains vs VS Code: Free IDE Comparison 2026 | StudentPerks",
    metaDescription: "Compare JetBrains IDEs (free for students) and VS Code (always free). Features, performance, and which IDE is better for your workflow.",
    intro: "JetBrains offers professional IDEs free for students — IntelliJ, WebStorm, PyCharm, and more. VS Code is a free, lightweight editor with a massive extension ecosystem.",
    verdict: "Use JetBrains for deep language-specific features and refactoring. Use VS Code for lightweight editing and extension flexibility.",
  },
];

export type UseCaseSEO = {
  slug: string;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  filterCategory?: Category;
  filterKeywords: string[];
  faqs: FAQ[];
};

export const USE_CASE_SEO: UseCaseSEO[] = [
  {
    slug: "best-free-databases-for-side-projects",
    title: "Best Free Databases for Side Projects 2026 | StudentPerks",
    metaDescription: "Find the best free databases for your side projects. Supabase, MongoDB Atlas, PlanetScale, and more with generous free tiers.",
    heading: "Best Free Databases for Side Projects",
    intro: "Building a side project? You don't need to pay for a database. These free-tier databases give you production-ready storage for hobby and side projects.",
    filterKeywords: ["database", "supabase", "mongodb", "postgres", "sql"],
    faqs: [
      { question: "What's the best free database for a beginner?", answer: "Supabase is great for beginners — it's PostgreSQL with a dashboard, auth, and real-time built in. MongoDB Atlas is also beginner-friendly if you prefer NoSQL." },
      { question: "Are free database tiers reliable for production?", answer: "Yes, for small to medium traffic. Most free tiers include automatic backups and 99.9% uptime SLAs. Upgrade when you outgrow the free limits." },
    ],
  },
  {
    slug: "best-free-hosting-for-students",
    title: "Best Free Hosting for Students 2026 | StudentPerks",
    metaDescription: "Free hosting platforms for student developers. Deploy your projects on Vercel, Railway, Render, and more with zero cost.",
    heading: "Best Free Hosting for Students",
    intro: "Deploy your projects for free. These hosting platforms offer generous free tiers perfect for student portfolios, class projects, and side projects.",
    filterCategory: "Cloud",
    filterKeywords: ["hosting", "deploy", "vercel", "railway", "render", "cloud"],
    faqs: [
      { question: "Can I host a full-stack app for free?", answer: "Yes! Railway and Render both support full-stack apps with databases on their free tiers. Vercel is best for frontend and serverless." },
      { question: "Will my free hosting handle traffic?", answer: "Free tiers handle moderate traffic well. For student projects and portfolios, you'll rarely hit limits. Most platforms allow easy scaling when needed." },
    ],
  },
  {
    slug: "best-free-design-tools-for-prototyping",
    title: "Best Free Design Tools for Prototyping 2026 | StudentPerks",
    metaDescription: "Free design and prototyping tools for students and startups. Figma, Framer, Canva, and more with free plans.",
    heading: "Best Free Design Tools for Prototyping",
    intro: "Create professional designs and prototypes without spending a dime. These design tools offer powerful free tiers for UI/UX design, prototyping, and graphics.",
    filterCategory: "Design",
    filterKeywords: ["design", "figma", "framer", "canva", "prototype", "ui"],
    faqs: [
      { question: "Is Figma still free for students?", answer: "Yes, Figma offers a free plan with up to 3 projects and unlimited personal files. Students can also apply for Figma for Education for additional features." },
      { question: "What's the best free tool for interactive prototypes?", answer: "Figma for standard prototyping, Framer for code-powered interactions and animations. Both have generous free tiers." },
    ],
  },
  {
    slug: "best-free-cicd-for-open-source",
    title: "Best Free CI/CD for Open Source 2026 | StudentPerks",
    metaDescription: "Free CI/CD pipelines for open source projects. GitHub Actions, GitLab CI, and more with unlimited builds for public repos.",
    heading: "Best Free CI/CD for Open Source Projects",
    intro: "Open source projects get the best CI/CD deals. Most platforms offer unlimited build minutes for public repositories, making automated testing and deployment completely free.",
    filterKeywords: ["ci", "cd", "pipeline", "github-actions", "gitlab", "build", "deploy"],
    faqs: [
      { question: "Is GitHub Actions free for open source?", answer: "Yes, GitHub Actions provides unlimited minutes for public repositories. It's the most popular choice for open source CI/CD." },
      { question: "What's the easiest CI/CD to set up?", answer: "GitHub Actions if you're already on GitHub — just add a YAML file. Vercel has zero-config deployments for frontend projects." },
    ],
  },
  {
    slug: "best-free-ai-tools-for-developers",
    title: "Best Free AI Tools for Developers 2026 | StudentPerks",
    metaDescription: "Free AI tools for developers. GitHub Copilot, OpenAI API credits, Cursor, and more AI-powered coding tools with free access.",
    heading: "Best Free AI Tools for Developers",
    intro: "AI is transforming development. Access the best AI coding tools for free through student programs, startup credits, and open source sponsorships.",
    filterCategory: "AI",
    filterKeywords: ["ai", "copilot", "openai", "cursor", "machine-learning", "gpt"],
    faqs: [
      { question: "Is GitHub Copilot free for students?", answer: "Yes, GitHub Copilot is completely free for verified students through the GitHub Student Developer Pack." },
      { question: "Can I get free OpenAI API credits?", answer: "Yes, OpenAI offers startup credits through their programs. Students can also access free tiers with limited usage." },
    ],
  },
  {
    slug: "best-free-monitoring-for-startups",
    title: "Best Free Monitoring Tools for Startups 2026 | StudentPerks",
    metaDescription: "Free monitoring and observability tools for startups. Sentry, Datadog, New Relic, and more with free startup credits.",
    heading: "Best Free Monitoring Tools for Startups",
    intro: "Don't fly blind. These monitoring tools offer free tiers and startup credits to help you track errors, performance, and infrastructure from day one.",
    filterKeywords: ["monitoring", "sentry", "datadog", "observability", "error", "apm"],
    faqs: [
      { question: "What monitoring should a startup set up first?", answer: "Start with error tracking (Sentry) and uptime monitoring. Add APM and infrastructure monitoring as you scale." },
      { question: "Are free monitoring tiers enough for early-stage?", answer: "Absolutely. Sentry's free tier handles 5K errors/month, which is plenty for pre-launch and early traction." },
    ],
  },
  {
    slug: "best-free-learning-platforms",
    title: "Best Free Learning Platforms for Developers 2026 | StudentPerks",
    metaDescription: "Free learning platforms for developers. Coursera, freeCodeCamp, and more with certificates and courses at no cost.",
    heading: "Best Free Learning Platforms for Developers",
    intro: "Level up your skills for free. These learning platforms offer free courses, certifications, and hands-on projects for developer education.",
    filterCategory: "Learning",
    filterKeywords: ["learning", "course", "education", "tutorial", "certification"],
    faqs: [
      { question: "Can I get free certificates?", answer: "Yes. freeCodeCamp offers free certificates. Coursera offers financial aid for certificates, and many platforms have free certificate tracks for students." },
      { question: "What's the best free platform for web development?", answer: "freeCodeCamp for structured curriculum, Coursera for university-level courses, and The Odin Project for project-based learning." },
    ],
  },
  {
    slug: "best-free-tools-for-hackathons",
    title: "Best Free Tools for Hackathons 2026 | StudentPerks",
    metaDescription: "Essential free tools for hackathons. Deploy fast with Vercel, build with Supabase, design with Figma — all free.",
    heading: "Best Free Tools for Hackathons",
    intro: "Win your next hackathon with the right free tools. Fast deployment, instant databases, collaborative design, and AI assistance — all at zero cost.",
    filterKeywords: ["hackathon", "deploy", "fast", "prototype", "team"],
    faqs: [
      { question: "What's the fastest way to deploy at a hackathon?", answer: "Vercel for frontend (zero-config deploys from Git), Railway for full-stack with databases. Both deploy in under a minute." },
      { question: "What backend should I use for a hackathon?", answer: "Supabase gives you a PostgreSQL database with auth and real-time in minutes. Perfect for hackathon speed." },
    ],
  },
  {
    slug: "best-free-saas-tools-for-mvp",
    title: "Best Free SaaS Tools to Build Your MVP 2026 | StudentPerks",
    metaDescription: "Free SaaS tools to build and launch your MVP. Authentication, payments, email, analytics, and more without spending money.",
    heading: "Best Free SaaS Tools to Build Your MVP",
    intro: "Build your MVP without a budget. These SaaS tools offer free tiers that cover everything from auth to payments to analytics.",
    filterCategory: "SaaS",
    filterKeywords: ["saas", "mvp", "auth", "payment", "email", "analytics"],
    faqs: [
      { question: "How much does it cost to build an MVP?", answer: "With free tools from StudentPerks, you can build and launch an MVP for $0. Hosting, database, auth, payments — all have free tiers." },
      { question: "What tools do I need for an MVP?", answer: "At minimum: hosting (Vercel/Railway), database (Supabase), auth (built into Supabase), and analytics (Vercel Analytics). All free." },
    ],
  },
  {
    slug: "best-free-tools-for-portfolio-websites",
    title: "Best Free Tools for Portfolio Websites 2026 | StudentPerks",
    metaDescription: "Build a stunning portfolio website for free. Hosting, domains, design tools, and deployment platforms at zero cost for students.",
    heading: "Best Free Tools for Portfolio Websites",
    intro: "Your portfolio is your first impression. Build and host a professional portfolio website for free using these developer tools and hosting platforms.",
    filterKeywords: ["portfolio", "website", "hosting", "domain", "design", "deploy"],
    faqs: [
      { question: "Can I get a free custom domain for my portfolio?", answer: "Yes! GitHub Student Developer Pack includes free .me and .tech domains. Namecheap also offers free .me domains for students." },
      { question: "What's the best free hosting for a portfolio?", answer: "Vercel or Netlify for static/Next.js sites. Both offer free HTTPS, global CDN, and custom domain support." },
    ],
  },
];

export function getCrossFilterMeta(
  audience: Audience,
  category: Category,
  dealCount: number,
): { title: string; description: string; intro: string } {
  const audienceLabel =
    audience === "students"
      ? "Students"
      : audience === "startups"
        ? "Startups"
        : "Open Source Projects";

  return {
    title: `Free ${category} Tools for ${audienceLabel} 2026 | StudentPerks`,
    description: `Discover ${dealCount} free ${category.toLowerCase()} tools available for ${audienceLabel.toLowerCase()}. Verified deals with step-by-step claim instructions.`,
    intro: `Discover ${dealCount} free ${category.toLowerCase()} tools available for ${audienceLabel.toLowerCase()}. Every deal is verified and includes step-by-step instructions to claim your free access.`,
  };
}

export function getTopMeta(
  category: Category,
  dealCount: number,
): { title: string; description: string } {
  return {
    title: `Top ${dealCount} Best Free ${category} Tools for Developers 2026`,
    description: `Ranked list of the ${dealCount} best free ${category.toLowerCase()} tools for students, startups, and open source. Verified deals with real value.`,
  };
}
