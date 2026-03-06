"use client";

import { useState, useMemo } from "react";
import { Deal, Category, Audience } from "@/data/deals";
import DealCard from "./DealCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

const audienceOptions: { value: Audience | null; label: string }[] = [
  { value: null, label: "Everyone" },
  { value: "students", label: "🎓 Students" },
  { value: "startups", label: "🚀 Startups" },
  { value: "opensource", label: "💻 Open Source" },
];

export default function DealsGrid({
  deals,
  initialCategory,
  initialAudience,
}: {
  deals: Deal[];
  initialCategory?: Category;
  initialAudience?: Audience;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(initialCategory ?? null);
  const [audience, setAudience] = useState<Audience | null>(initialAudience ?? null);

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      if (category && deal.category !== category) return false;
      if (audience && !deal.audiences.includes(audience)) return false;
      if (search && !deal.name.toLowerCase().includes(search.toLowerCase()) && !deal.tagline.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [deals, category, audience, search]);

  const base = "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border";
  const active = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  const inactive = "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400 hover:border-white/[0.1]";

  return (
    <div>
      <div className="space-y-3 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="flex flex-wrap gap-1.5">
          {audienceOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAudience(opt.value)}
              className={`${base} ${audience === opt.value ? active : inactive}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-[15px]">No deals found</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-[12px] text-zinc-700 mb-3 font-medium">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
            {filtered.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
