import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import type { Deal, Category } from "@/data/deals";
import JsonLd from "./JsonLd";

export const revalidate = 300;

const USE_CASE_SECTIONS: { label: string; emoji: string; intro: string; categories: Category[] }[] = [
  {
    label: "Developer Tools",
    emoji: "🛠",
    intro: "IDEs, version control, containers, databases, and everything you need to build software — all free for students.",
    categories: ["Dev"],
  },
  {
    label: "AI & Machine Learning",
    emoji: "🤖",
    intro: "AI coding assistants, API credits, and ML platforms to supercharge your projects with artificial intelligence.",
    categories: ["AI"],
  },
  {
    label: "Cloud & Hosting",
    emoji: "🌐",
    intro: "Deploy your apps for free. Cloud credits, managed databases, serverless functions, and CDN services.",
    categories: ["Cloud"],
  },
  {
    label: "Design & Creative",
    emoji: "🎨",
    intro: "Professional design tools for UI/UX, graphic design, video editing, and prototyping — at no cost.",
    categories: ["Design"],
  },
  {
    label: "Productivity & SaaS",
    emoji: "☁️",
    intro: "Project management, team communication, note-taking, and business tools with free student plans.",
    categories: ["SaaS"],
  },
  {
    label: "Learning & Courses",
    emoji: "📚",
    intro: "Online courses, certifications, and educational platforms offering free or discounted access for students.",
    categories: ["Learning"],
  },
  {
    label: "Entertainment & Lifestyle",
    emoji: "🎮",
    intro: "Music, streaming, shopping, and lifestyle perks with student discounts that save you hundreds per year.",
    categories: ["Entertainment"],
  },
];

const FAQS = [
  {
    question: "How do I get free tools as a student?",
    answer: "Most companies verify student status through a .edu email, SheerID, UNiDAYS, or the GitHub Student Developer Pack. Once verified, you get free or heavily discounted access to professional software.",
  },
  {
    question: "What is the GitHub Student Developer Pack?",
    answer: "It's a bundle of 100+ free developer tools from GitHub Education. It includes GitHub Pro, JetBrains IDEs, DigitalOcean credits, free domains, and much more. You verify once and get access to all partner offers.",
  },
  {
    question: "Do free student tools expire after graduation?",
    answer: "Most student licenses are valid for 1 year and renewable while enrolled. After graduation, some tools offer transition pricing (e.g., JetBrains gives 25% off). Cloud credits and one-time deals stay in your account.",
  },
  {
    question: "Can international students get these deals?",
    answer: "Yes. Most programs accept international students. Some use .edu email verification, others accept ISIC cards, enrollment documents, or local university email domains. Check each tool's requirements.",
  },
  {
    question: "What are the most valuable free student tools?",
    answer: "The highest-value deals include JetBrains IDEs ($649/year), Adobe Creative Cloud (60% off), AWS/Azure cloud credits ($100-$150K), GitHub Copilot ($100/year), and Apple Education Pricing (up to $400 off hardware).",
  },
];

export const metadata: Metadata = {
  title: "100+ Free Tools for Students 2026 | StudentPerks",
  description:
    "The ultimate list of free software, tools, and services for students in 2026. Developer tools, cloud credits, design apps, AI assistants, and more — all verified and free.",
  keywords: [
    "free tools for students",
    "student free software",
    "best tools for students",
    "free software for college students",
    "student developer tools",
    "free student deals 2026",
  ],
  alternates: { canonical: "https://www.studentperks.dev/free-tools-for-students" },
  openGraph: {
    title: "100+ Free Tools for Students (2026 Edition)",
    description:
      "The ultimate list of free software, tools, and services for students. Developer tools, cloud credits, design apps, AI, and more.",
    url: "https://www.studentperks.dev/free-tools-for-students",
    type: "article",
  },
};

function ToolRow({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.slug}`}
      className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
        <Image src={deal.logo} alt={deal.name} width={24} height={24} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
            {deal.name}
          </span>
          {deal.featured && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400/50">★</span>
          )}
        </div>
        <p className="text-xs text-zinc-600 truncate">{deal.tagline}</p>
      </div>
      <span className="value-pill text-xs shrink-0">{deal.value}</span>
    </Link>
  );
}

export default async function FreeToolsForStudents() {
  const deals = await getDeals();
  const studentDeals = deals.filter((d) => d.audiences.includes("students"));

  const grouped: Record<string, Deal[]> = {};
  for (const section of USE_CASE_SECTIONS) {
    grouped[section.label] = studentDeals.filter((d) =>
      section.categories.includes(d.category)
    );
  }

  const totalValue = studentDeals.reduce((sum, d) => {
    const match = d.value.replace(/,/g, "").match(/\$([0-9]+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Free Tools for Students</span>
      </nav>

      <div className="mb-12">
        <p className="section-label mb-2">2026 Edition</p>
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4">
          {studentDeals.length}+ Free Tools for Students
        </h1>
        <p className="text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          The ultimate curated list of <strong className="text-zinc-300">free software, cloud credits,
          and pro plans</strong> for students in 2026. Every deal is verified and worth a combined{" "}
          <strong className="text-emerald-400">${totalValue.toLocaleString()}+</strong> in value.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <div className="card px-4 py-2 text-center">
            <p className="text-lg font-bold text-zinc-100">{studentDeals.length}+</p>
            <p className="text-[11px] text-zinc-600">Free Tools</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-lg font-bold text-emerald-400">${totalValue.toLocaleString()}+</p>
            <p className="text-[11px] text-zinc-600">Total Value</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-lg font-bold text-zinc-100">{USE_CASE_SECTIONS.length}</p>
            <p className="text-[11px] text-zinc-600">Categories</p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="card p-4 mb-12">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Jump to</p>
        <div className="flex flex-wrap gap-2">
          {USE_CASE_SECTIONS.map((section) => {
            const count = grouped[section.label]?.length || 0;
            if (count === 0) return null;
            return (
              <a
                key={section.label}
                href={`#${section.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-zinc-500 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-300 transition-all"
              >
                <span>{section.emoji}</span>
                {section.label}
                <span className="text-zinc-700">({count})</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Sections */}
      {USE_CASE_SECTIONS.map((section) => {
        const sectionDeals = grouped[section.label];
        if (!sectionDeals || sectionDeals.length === 0) return null;
        const anchor = section.label.toLowerCase().replace(/[^a-z]+/g, "-");
        const config = CATEGORY_CONFIG[section.categories[0]];
        return (
          <section key={section.label} id={anchor} className="mb-14 scroll-mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <span>{section.emoji}</span>
                {section.label}
                <span className="text-xs text-zinc-600 font-normal">({sectionDeals.length})</span>
              </h2>
              <p className="text-[13px] text-zinc-600 mt-1">{section.intro}</p>
            </div>
            <div className="space-y-2">
              {sectionDeals.map((deal) => (
                <ToolRow key={deal.slug} deal={deal} />
              ))}
            </div>
            <div className="mt-3 text-right">
              <Link
                href={`/category/${config.color === "blue" ? "dev" : section.categories[0].toLowerCase()}`}
                className="text-[12px] text-zinc-600 hover:text-orange-400 transition-colors"
              >
                Browse all {section.label.toLowerCase()} →
              </Link>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <div className="card p-6 mb-14 text-center">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Start Claiming Free Tools</h2>
        <p className="text-[13px] text-zinc-500 mb-4 max-w-md mx-auto">
          Begin with the GitHub Student Developer Pack — it unlocks 100+ tools with a single verification.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/deals/github-education" className="btn-primary">
            Get GitHub Student Pack →
          </Link>
          <Link href="/student-discount" className="btn-ghost">
            All Student Discounts
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="card p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{faq.question}</h3>
              <p className="text-sm text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">Related Pages</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/for/students" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
            Student Deals →
          </Link>
          <Link href="/student-discount" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
            Student Discounts →
          </Link>
          <Link href="/guides/how-to-get-github-student-pack" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
            GitHub Pack Guide →
          </Link>
          <Link href="/seasonal/back-to-school-2026" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
            Back to School 2026 →
          </Link>
          <Link href="/deals" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
            All Deals →
          </Link>
        </div>
      </section>

      <JsonLd studentDeals={studentDeals} faqs={FAQS} />
    </main>
  );
}
