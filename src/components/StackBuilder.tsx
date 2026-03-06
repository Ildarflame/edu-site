"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Deal, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

type TechOption = {
  name: string;
  keywords: string[];
};

type TechCategory = {
  name: string;
  icon: string;
  options: TechOption[];
};

const TECH_CATEGORIES: TechCategory[] = [
  {
    name: "Frontend",
    icon: "🎨",
    options: [
      { name: "React", keywords: ["react", "frontend", "ui"] },
      { name: "Vue", keywords: ["vue", "frontend", "ui"] },
      { name: "Next.js", keywords: ["next", "nextjs", "vercel", "react", "frontend"] },
      { name: "Angular", keywords: ["angular", "frontend", "ui"] },
      { name: "Svelte", keywords: ["svelte", "frontend", "ui"] },
      { name: "Tailwind CSS", keywords: ["tailwind", "css", "design", "frontend"] },
    ],
  },
  {
    name: "Backend",
    icon: "🔧",
    options: [
      { name: "Node.js", keywords: ["node", "javascript", "backend", "api"] },
      { name: "Python", keywords: ["python", "django", "fastapi", "backend"] },
      { name: "Go", keywords: ["go", "golang", "backend"] },
      { name: "Rust", keywords: ["rust", "backend", "systems"] },
      { name: "Java", keywords: ["java", "spring", "backend"] },
      { name: "Ruby", keywords: ["ruby", "rails", "backend"] },
    ],
  },
  {
    name: "Database",
    icon: "🗄️",
    options: [
      { name: "PostgreSQL", keywords: ["postgres", "postgresql", "sql", "database", "supabase"] },
      { name: "MongoDB", keywords: ["mongodb", "nosql", "database"] },
      { name: "Redis", keywords: ["redis", "cache", "database"] },
      { name: "MySQL", keywords: ["mysql", "sql", "database"] },
      { name: "Supabase", keywords: ["supabase", "postgres", "database", "auth"] },
      { name: "Firebase", keywords: ["firebase", "google", "database", "auth"] },
    ],
  },
  {
    name: "Cloud",
    icon: "☁️",
    options: [
      { name: "AWS", keywords: ["aws", "amazon", "cloud", "ec2", "s3"] },
      { name: "Google Cloud", keywords: ["gcp", "google cloud", "cloud"] },
      { name: "Azure", keywords: ["azure", "microsoft", "cloud"] },
      { name: "Vercel", keywords: ["vercel", "hosting", "deploy", "cloud"] },
      { name: "DigitalOcean", keywords: ["digitalocean", "cloud", "hosting"] },
      { name: "Cloudflare", keywords: ["cloudflare", "cdn", "cloud", "hosting"] },
    ],
  },
  {
    name: "DevOps",
    icon: "🔄",
    options: [
      { name: "Docker", keywords: ["docker", "container", "devops"] },
      { name: "Kubernetes", keywords: ["kubernetes", "k8s", "devops", "container"] },
      { name: "GitHub Actions", keywords: ["github", "ci", "cd", "devops"] },
      { name: "Terraform", keywords: ["terraform", "infrastructure", "devops"] },
      { name: "Sentry", keywords: ["sentry", "monitoring", "error", "devops"] },
      { name: "Railway", keywords: ["railway", "deploy", "hosting", "devops"] },
    ],
  },
  {
    name: "Design",
    icon: "✏️",
    options: [
      { name: "Figma", keywords: ["figma", "design", "ui", "prototype"] },
      { name: "Adobe CC", keywords: ["adobe", "photoshop", "illustrator", "design"] },
      { name: "Sketch", keywords: ["sketch", "design", "ui"] },
      { name: "Canva", keywords: ["canva", "design", "graphic"] },
      { name: "Framer", keywords: ["framer", "design", "prototype", "web"] },
      { name: "Blender", keywords: ["blender", "3d", "design", "animation"] },
    ],
  },
  {
    name: "AI / ML",
    icon: "🤖",
    options: [
      { name: "OpenAI", keywords: ["openai", "gpt", "ai", "llm", "chatgpt"] },
      { name: "GitHub Copilot", keywords: ["copilot", "ai", "code", "github"] },
      { name: "TensorFlow", keywords: ["tensorflow", "ml", "ai", "machine learning"] },
      { name: "PyTorch", keywords: ["pytorch", "ml", "ai", "machine learning"] },
      { name: "Hugging Face", keywords: ["hugging face", "ml", "ai", "nlp", "models"] },
      { name: "LangChain", keywords: ["langchain", "ai", "llm", "rag"] },
    ],
  },
];

function matchDeal(deal: Deal, allKeywords: string[]): { matched: boolean; score: number } {
  const searchable = `${deal.name} ${deal.tagline} ${deal.description} ${deal.category} ${deal.slug}`.toLowerCase();
  let score = 0;
  for (const kw of allKeywords) {
    if (searchable.includes(kw)) {
      score += 1;
    }
  }
  return { matched: score > 0, score };
}

function parseValue(value: string): number {
  const match = value.match(/([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ""), 10);
}

export default function StackBuilder({ deals }: { deals: Deal[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(tech: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });
  }

  const results = useMemo(() => {
    if (selected.size === 0) return null;

    const allKeywords: string[] = [];
    for (const cat of TECH_CATEGORIES) {
      for (const opt of cat.options) {
        if (selected.has(opt.name)) {
          allKeywords.push(...opt.keywords);
        }
      }
    }
    const uniqueKeywords = [...new Set(allKeywords)];

    const matched = deals
      .map((deal) => {
        const { matched, score } = matchDeal(deal, uniqueKeywords);
        return { deal, score, matched };
      })
      .filter((r) => r.matched)
      .sort((a, b) => b.score - a.score);

    // Group by category
    const grouped: Record<string, typeof matched> = {};
    for (const r of matched) {
      const cat = r.deal.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    }

    const totalSavings = matched.reduce((sum, r) => sum + parseValue(r.deal.value), 0);

    return { grouped, totalSavings, count: matched.length };
  }, [selected, deals]);

  return (
    <div>
      {/* Tech grid */}
      <div className="space-y-6">
        {TECH_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <h3 className="text-[13px] font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <span>{cat.icon}</span>
              {cat.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {cat.options.map((opt) => {
                const isSelected = selected.has(opt.name);
                return (
                  <button
                    key={opt.name}
                    onClick={() => toggle(opt.name)}
                    className={`px-3.5 py-2.5 rounded-lg border text-[13px] font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                        : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Clear button */}
      {selected.size > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setSelected(new Set())}
            className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear all
          </button>
          <span className="text-[13px] text-zinc-600">
            {selected.size} technolog{selected.size !== 1 ? "ies" : "y"} selected
          </span>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">
                Your Stack Deals
              </h2>
              <p className="text-[13px] text-zinc-500 mt-1">
                {results.count} deal{results.count !== 1 ? "s" : ""} match your tech stack
              </p>
            </div>
            {results.totalSavings > 0 && (
              <div className="card px-5 py-3 text-center">
                <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                  Est. savings
                </div>
                <div className="text-xl font-bold text-orange-400 mt-0.5">
                  ${results.totalSavings.toLocaleString()}+
                </div>
              </div>
            )}
          </div>

          {results.count === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-zinc-400 text-[15px]">
                No deals found for your selected stack. Try adding more technologies.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(results.grouped).map(([category, items]) => {
                const catConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span>{catConfig?.icon}</span>
                      <h3 className="text-[14px] font-semibold text-zinc-300">
                        {category}
                      </h3>
                      <span className="text-[11px] text-zinc-600">
                        ({items.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map(({ deal }) => (
                        <Link
                          key={deal.slug}
                          href={`/deals/${deal.slug}`}
                          className="card group block p-5 relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                              <Image src={deal.logo} alt={deal.name} width={28} height={28} />
                            </div>
                            <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md">
                              {deal.value}
                            </span>
                          </div>
                          <h4 className="text-[15px] font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors">
                            {deal.name}
                          </h4>
                          <p className="mt-1 text-[13px] text-zinc-600 line-clamp-2">
                            {deal.tagline}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <CategoryBadge category={deal.category} />
                            {deal.audiences.map((a) => (
                              <AudienceBadge key={a} audience={a} />
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
