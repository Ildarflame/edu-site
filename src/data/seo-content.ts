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
