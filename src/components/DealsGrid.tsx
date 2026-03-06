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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                audience === opt.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No deals found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} deal{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
