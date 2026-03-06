"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Deal, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

type ScoredDeal = {
  deal: Deal;
  score: number;
  matchedKeywords: string[];
};

const STOP_WORDS = new Set([
  "i", "im", "a", "an", "the", "and", "or", "but", "in", "on", "at", "to",
  "for", "of", "with", "by", "from", "is", "am", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "my", "me",
  "we", "our", "us", "you", "your", "it", "its", "that", "this", "these",
  "those", "who", "which", "what", "where", "when", "how", "not", "no",
  "so", "if", "then", "than", "too", "very", "just", "about", "up", "out",
  "all", "some", "any", "each", "every", "both", "few", "more", "most",
  "other", "into", "over", "after", "before", "between", "under", "above",
  "use", "using", "used", "also", "like", "get", "got", "want", "looking",
]);

const SYNONYMS: Record<string, string[]> = {
  frontend: ["react", "vue", "angular", "svelte", "next", "nextjs", "next.js", "html", "css", "tailwind", "figma", "ui", "ux"],
  backend: ["node", "python", "go", "rust", "java", "ruby", "django", "express", "fastapi", "api"],
  database: ["postgres", "postgresql", "mongodb", "mysql", "redis", "supabase", "sql", "nosql", "db"],
  cloud: ["aws", "azure", "gcp", "google cloud", "digitalocean", "vercel", "railway", "cloudflare", "hosting", "deploy"],
  devops: ["docker", "kubernetes", "ci", "cd", "cicd", "ci/cd", "github actions", "terraform", "monitoring", "sentry"],
  design: ["figma", "adobe", "photoshop", "illustrator", "ui", "ux", "graphic"],
  ai: ["ai", "ml", "machine learning", "artificial intelligence", "copilot", "openai", "gpt", "llm", "chatgpt"],
  student: ["student", "students", "edu", "education", "university", "college", "school", "academic"],
  startup: ["startup", "startups", "founder", "founders", "entrepreneur", "company", "business"],
  opensource: ["open source", "opensource", "oss", "open-source", "maintainer", "contributor"],
  music: ["music", "spotify", "streaming", "audio"],
  video: ["video", "youtube", "streaming", "movies", "shows"],
  shopping: ["amazon", "prime", "shopping", "delivery"],
  learning: ["course", "courses", "learn", "learning", "tutorial", "coursera", "udemy", "education"],
  code: ["code", "coding", "programming", "developer", "development", "ide", "editor", "jetbrains", "vscode"],
};

function extractKeywords(input: string): string[] {
  const normalized = input.toLowerCase().replace(/[^a-z0-9\s./-]/g, " ");
  const words = normalized.split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const expanded = new Set(words);
  for (const word of words) {
    for (const [, synonyms] of Object.entries(SYNONYMS)) {
      if (synonyms.includes(word)) {
        synonyms.forEach((s) => expanded.add(s));
      }
    }
  }

  return Array.from(expanded);
}

function scoreDeal(deal: Deal, keywords: string[]): ScoredDeal {
  const searchable = {
    name: deal.name.toLowerCase(),
    tagline: deal.tagline.toLowerCase(),
    description: deal.description.toLowerCase(),
    category: deal.category.toLowerCase(),
    audiences: deal.audiences.join(" ").toLowerCase(),
    slug: deal.slug.toLowerCase(),
  };

  let score = 0;
  const matchedKeywords: string[] = [];

  for (const kw of keywords) {
    let matched = false;

    if (searchable.name.includes(kw)) {
      score += 10;
      matched = true;
    }
    if (searchable.category.includes(kw)) {
      score += 8;
      matched = true;
    }
    if (searchable.audiences.includes(kw)) {
      score += 7;
      matched = true;
    }
    if (searchable.tagline.includes(kw)) {
      score += 5;
      matched = true;
    }
    if (searchable.description.includes(kw)) {
      score += 3;
      matched = true;
    }
    if (searchable.slug.includes(kw)) {
      score += 2;
      matched = true;
    }

    if (matched && !STOP_WORDS.has(kw)) {
      matchedKeywords.push(kw);
    }
  }

  return { deal, score, matchedKeywords: [...new Set(matchedKeywords)] };
}

export default function DealFinder({ deals }: { deals: Deal[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScoredDeal[] | null>(null);

  function handleSearch() {
    if (!query.trim()) return;
    const keywords = extractKeywords(query);
    const scored = deals
      .map((deal) => scoreDeal(deal, keywords))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setResults(scored);
  }

  return (
    <div>
      {/* Search input */}
      <div className="card p-6 md:p-8">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Describe your situation
        </h2>
        <p className="text-[13px] text-zinc-500 mb-5">
          Tell us about yourself — your role, tech stack, and what you need. We will find the best deals for you.
        </p>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`e.g. "I'm a CS student using React and AWS, looking for free cloud hosting and design tools"`}
          className="w-full h-28 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-200 text-[14px] placeholder:text-zinc-700 px-4 py-3 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="btn-primary px-6 py-2.5 text-[14px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Find My Deals
          </button>
          {results !== null && (
            <span className="text-[13px] text-zinc-500">
              {results.length} deal{results.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>
      </div>

      {/* Quick suggestions */}
      {results === null && (
        <div className="mt-6">
          <p className="text-[12px] text-zinc-600 mb-3 font-medium uppercase tracking-wider">
            Try these
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "CS student learning React and Python",
              "Startup founder building a SaaS product",
              "Open source maintainer needing CI/CD and hosting",
              "Design student using Figma and Adobe",
              "AI/ML researcher using cloud GPUs",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  const keywords = extractKeywords(suggestion);
                  const scored = deals
                    .map((deal) => scoreDeal(deal, keywords))
                    .filter((r) => r.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
                  setResults(scored);
                }}
                className="px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:text-zinc-200 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results !== null && (
        <div className="mt-8 space-y-3">
          {results.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-zinc-400 text-[15px]">
                No matching deals found. Try describing your situation differently.
              </p>
            </div>
          ) : (
            results.map(({ deal, score, matchedKeywords }) => (
              <Link
                key={deal.slug}
                href={`/deals/${deal.slug}`}
                className="card group block p-5 relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <Image src={deal.logo} alt={deal.name} width={32} height={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors">
                          {deal.name}
                        </h3>
                        <p className="mt-0.5 text-[13px] text-zinc-500 line-clamp-1">
                          {deal.tagline}
                        </p>
                      </div>
                      <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0">
                        {deal.value}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <CategoryBadge category={deal.category} />
                      {deal.audiences.map((a) => (
                        <AudienceBadge key={a} audience={a} />
                      ))}
                      <div className="w-px h-3 bg-white/[0.06] mx-1" />
                      <span className="text-[11px] text-orange-400/80 font-medium">
                        Matched: {matchedKeywords.slice(0, 5).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
