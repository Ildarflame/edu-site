"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Deal, Category } from "@/data/deals";
import { CATEGORY_CONFIG } from "@/data/deals";

/* ── Major → Category mapping ── */

type Major = {
  label: string;
  keywords: string[];
  primary: Category[];
  secondary: Category[];
};

const MAJORS: Major[] = [
  { label: "Computer Science", keywords: ["cs", "computer", "software"], primary: ["Dev", "AI", "Cloud"], secondary: ["SaaS"] },
  { label: "Data Science / ML", keywords: ["data", "machine learning", "analytics"], primary: ["AI", "Dev", "Cloud"], secondary: ["SaaS"] },
  { label: "Web Development", keywords: ["web", "frontend", "fullstack"], primary: ["Dev", "Cloud"], secondary: ["Design", "SaaS"] },
  { label: "Mobile Development", keywords: ["mobile", "ios", "android"], primary: ["Dev", "Cloud"], secondary: ["Design"] },
  { label: "Cybersecurity", keywords: ["security", "cyber", "infosec"], primary: ["Dev", "Cloud"], secondary: ["SaaS"] },
  { label: "Design / UX", keywords: ["design", "ux", "ui", "graphic"], primary: ["Design"], secondary: ["SaaS", "Dev"] },
  { label: "Business / MBA", keywords: ["business", "mba", "management", "marketing"], primary: ["SaaS"], secondary: ["AI", "Design"] },
  { label: "Engineering", keywords: ["engineering", "mechanical", "electrical", "civil"], primary: ["Dev", "Cloud"], secondary: ["AI"] },
  { label: "Media / Film", keywords: ["media", "film", "video", "journalism"], primary: ["Design", "Entertainment"], secondary: ["SaaS"] },
  { label: "Music / Arts", keywords: ["music", "art", "creative"], primary: ["Design", "Entertainment"], secondary: [] },
  { label: "Mathematics", keywords: ["math", "statistics", "actuarial"], primary: ["Dev", "AI"], secondary: ["Cloud"] },
  { label: "Biology / Medicine", keywords: ["biology", "medicine", "health", "biotech"], primary: ["Learning", "AI"], secondary: ["Cloud"] },
  { label: "Other / General", keywords: [], primary: [], secondary: [] },
];

/* ── Country → Region mapping ── */

type CountryGroup = { label: string; region: string; countries: string[] };

const COUNTRY_GROUPS: CountryGroup[] = [
  { label: "United States", region: "US", countries: ["US"] },
  { label: "Canada", region: "US", countries: ["CA"] },
  { label: "United Kingdom", region: "UK", countries: ["UK"] },
  { label: "Germany", region: "EU", countries: ["DE"] },
  { label: "France", region: "EU", countries: ["FR"] },
  { label: "Netherlands", region: "EU", countries: ["NL"] },
  { label: "Spain", region: "EU", countries: ["ES"] },
  { label: "Italy", region: "EU", countries: ["IT"] },
  { label: "Poland", region: "EU", countries: ["PL"] },
  { label: "Sweden", region: "EU", countries: ["SE"] },
  { label: "Other Europe", region: "EU", countries: [] },
  { label: "India", region: "Asia", countries: ["IN"] },
  { label: "China", region: "Asia", countries: ["CN"] },
  { label: "Japan", region: "Asia", countries: ["JP"] },
  { label: "South Korea", region: "Asia", countries: ["KR"] },
  { label: "Australia", region: "Asia", countries: ["AU"] },
  { label: "Singapore", region: "Asia", countries: ["SG"] },
  { label: "Other Asia", region: "Asia", countries: [] },
  { label: "Brazil", region: "US", countries: ["BR"] },
  { label: "Other / Global", region: "", countries: [] },
];

/* ── Scoring logic ── */

function scoreDeals(deals: Deal[], major: Major, region: string): (Deal & { score: number; reason: string })[] {
  return deals.map((deal) => {
    let score = 50; // base
    let reason = "Available to all students";

    // Major match
    if (major.primary.includes(deal.category)) {
      score += 40;
      reason = `Essential for ${major.label}`;
    } else if (major.secondary.includes(deal.category)) {
      score += 20;
      reason = `Useful for ${major.label}`;
    }

    // Region match
    if (deal.regions && deal.regions.length > 0) {
      if (region && deal.regions.includes(region)) {
        score += 10;
      } else if (region && !deal.regions.includes(region)) {
        score -= 30;
        reason = "May not be available in your region";
      }
    }

    // Featured bonus
    if (deal.featured) score += 5;

    // Value bonus
    const match = deal.value.replace(/,/g, "").match(/\$([0-9]+)/);
    if (match) {
      const v = parseInt(match[1], 10);
      if (v >= 1000) score += 15;
      else if (v >= 100) score += 10;
      else if (v >= 50) score += 5;
    }

    return { ...deal, score, reason };
  }).sort((a, b) => b.score - a.score);
}

/* ── Component ── */

export default function FinderWizard({ deals }: { deals: Deal[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore from URL params
  const initialCountry = searchParams.get("country") || "";
  const initialMajor = searchParams.get("major") || "";
  const initialUni = searchParams.get("university") || "";
  const hasParams = !!(initialCountry && initialMajor);

  const [step, setStep] = useState(hasParams ? 3 : 0);
  const [country, setCountry] = useState(initialCountry);
  const [university, setUniversity] = useState(initialUni);
  const [majorLabel, setMajorLabel] = useState(initialMajor);
  const [animating, setAnimating] = useState(false);

  const region = COUNTRY_GROUPS.find((g) => g.label === country)?.region || "";
  const major = MAJORS.find((m) => m.label === majorLabel) || MAJORS[MAJORS.length - 1];

  const results = useMemo(() => {
    if (step < 3) return [];
    return scoreDeals(deals, major, region);
  }, [deals, major, region, step]);

  const essentialCount = results.filter((d) => d.score >= 90).length;
  const totalValue = results.reduce((sum, d) => {
    const match = d.value.replace(/,/g, "").match(/\$([0-9]+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const goNext = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => {
        const next = s + 1;
        if (next === 3) {
          const params = new URLSearchParams();
          params.set("country", country);
          params.set("major", majorLabel);
          if (university) params.set("university", university);
          router.replace(`/student-freebies-finder?${params.toString()}`, { scroll: false });
        }
        return next;
      });
      setAnimating(false);
    }, 150);
  }, [country, majorLabel, university, router]);

  const goBack = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.max(0, s - 1));
      setAnimating(false);
    }, 150);
  }, []);

  const restart = useCallback(() => {
    setStep(0);
    setCountry("");
    setUniversity("");
    setMajorLabel("");
    router.replace("/student-freebies-finder", { scroll: false });
  }, [router]);

  const shareUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://studentperks.dev/student-freebies-finder`;

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="section-label mb-2">Interactive Tool</p>
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-3">
          Student Freebies Finder
        </h1>
        <p className="text-[15px] text-zinc-500 max-w-lg mx-auto">
          Tell us about yourself and we&apos;ll show you every free tool, credit, and discount you can claim right now.
        </p>
      </div>

      {/* Progress */}
      {step < 3 && (
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Country", "University", "Major"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? "bg-orange-500 text-white" :
                i === step ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                "bg-white/[0.03] text-zinc-700 border border-white/[0.06]"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] font-medium ${i <= step ? "text-zinc-400" : "text-zinc-700"}`}>
                {label}
              </span>
              {i < 2 && <div className={`w-8 h-px ${i < step ? "bg-orange-500/30" : "bg-white/[0.06]"}`} />}
            </div>
          ))}
        </div>
      )}

      <div className={`transition-opacity duration-150 ${animating ? "opacity-0" : "opacity-100"}`}>
        {/* Step 0: Country */}
        {step === 0 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-zinc-100 mb-1 text-center">Where are you studying?</h2>
            <p className="text-[13px] text-zinc-600 mb-6 text-center">Some deals are region-specific</p>
            <div className="grid grid-cols-2 gap-2">
              {COUNTRY_GROUPS.map((g) => (
                <button
                  key={g.label}
                  onClick={() => { setCountry(g.label); setTimeout(goNext, 100); }}
                  className={`p-3 rounded-xl text-left text-[13px] font-medium transition-all border ${
                    country === g.label
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-200"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: University */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-zinc-100 mb-1 text-center">What university?</h2>
            <p className="text-[13px] text-zinc-600 mb-6 text-center">Optional — for your personalized results page</p>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. MIT, Stanford, TU Berlin..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/30 transition-colors"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") goNext(); }}
            />
            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="btn-ghost flex-1">Back</button>
              <button onClick={goNext} className="btn-primary flex-1">
                {university ? "Next" : "Skip"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Major */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-zinc-100 mb-1 text-center">What&apos;s your major?</h2>
            <p className="text-[13px] text-zinc-600 mb-6 text-center">We&apos;ll prioritize tools relevant to your field</p>
            <div className="grid grid-cols-2 gap-2">
              {MAJORS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => { setMajorLabel(m.label); setTimeout(goNext, 100); }}
                  className={`p-3 rounded-xl text-left text-[13px] font-medium transition-all border ${
                    majorLabel === m.label
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button onClick={goBack} className="btn-ghost w-full mt-4">Back</button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div>
            {/* Results header */}
            <div className="card p-6 mb-8 text-center">
              <p className="text-[13px] text-zinc-600 mb-1">
                Results for{university ? ` ${university} ·` : ""} {majorLabel} · {country}
              </p>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">
                You can claim <span className="text-orange-400">{results.length} free tools</span>
              </h2>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-emerald-400">${totalValue.toLocaleString()}+</p>
                  <p className="text-[11px] text-zinc-600">Total value</p>
                </div>
                <div className="w-px bg-white/[0.06]" />
                <div>
                  <p className="text-xl font-bold text-orange-400">{essentialCount}</p>
                  <p className="text-[11px] text-zinc-600">Essential for you</p>
                </div>
                <div className="w-px bg-white/[0.06]" />
                <div>
                  <p className="text-xl font-bold text-zinc-100">{results.length}</p>
                  <p className="text-[11px] text-zinc-600">Total available</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(shareUrl);
                  }}
                  className="btn-ghost text-[12px] inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.122a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.757 8.81" />
                  </svg>
                  Copy Link
                </button>
                <button onClick={restart} className="btn-ghost text-[12px]">
                  Start Over
                </button>
              </div>
            </div>

            {/* Essential deals */}
            {essentialCount > 0 && (
              <section className="mb-10">
                <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">
                  Essential for {majorLabel}
                </h3>
                <div className="space-y-2">
                  {results.filter((d) => d.score >= 90).map((deal) => (
                    <DealRow key={deal.slug} deal={deal} />
                  ))}
                </div>
              </section>
            )}

            {/* Recommended deals */}
            {results.filter((d) => d.score >= 60 && d.score < 90).length > 0 && (
              <section className="mb-10">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Recommended
                </h3>
                <div className="space-y-2">
                  {results.filter((d) => d.score >= 60 && d.score < 90).map((deal) => (
                    <DealRow key={deal.slug} deal={deal} />
                  ))}
                </div>
              </section>
            )}

            {/* All other deals */}
            {results.filter((d) => d.score < 60).length > 0 && (
              <section className="mb-10">
                <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-3">
                  Also Available
                </h3>
                <div className="space-y-2">
                  {results.filter((d) => d.score < 60).map((deal) => (
                    <DealRow key={deal.slug} deal={deal} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="card p-6 text-center mt-8">
              <p className="text-[13px] text-zinc-500 mb-3">Start with the highest-value deals first</p>
              <div className="flex justify-center gap-3">
                <Link href="/student-discount" className="btn-primary">
                  Claim Student Discounts →
                </Link>
                <Link href="/free-tools-for-students" className="btn-ghost">
                  Full Tools List
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Deal row component ── */

function DealRow({ deal }: { deal: Deal & { score: number; reason: string } }) {
  const config = CATEGORY_CONFIG[deal.category];
  return (
    <Link
      href={`/student-discount/${deal.slug}`}
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
          <span className="text-[10px] text-zinc-700">{config.icon}</span>
        </div>
        <p className="text-[11px] text-zinc-600 truncate">{deal.reason}</p>
      </div>
      <span className="value-pill text-xs shrink-0">{deal.value}</span>
    </Link>
  );
}
