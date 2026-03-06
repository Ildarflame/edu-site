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
      if (
        search &&
        !deal.name.toLowerCase().includes(search.toLowerCase()) &&
        !deal.tagline.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [deals, category, audience, search]);

  return (
    <div>
      <div className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAudience(opt.value)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                audience === opt.value
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.12]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-zinc-400 font-medium">No deals found</p>
          <p className="text-sm text-zinc-600 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-600 mb-4 font-medium">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {filtered.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
