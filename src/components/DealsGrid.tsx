"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

type SortOption = "name-asc" | "name-desc" | "featured";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<Category | null>(
    (searchParams.get("category") as Category) || initialCategory || null
  );
  const [audience, setAudience] = useState<Audience | null>(
    (searchParams.get("audience") as Audience) || initialAudience || null
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (sort && sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    router.replace(`/deals${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, category, audience, sort, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const filtered = useMemo(() => {
    let result = deals.filter((deal) => {
      if (category && deal.category !== category) return false;
      if (audience && !deal.audiences.includes(audience)) return false;
      if (search && !deal.name.toLowerCase().includes(search.toLowerCase()) && !deal.tagline.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    switch (sort) {
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "featured":
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [deals, category, audience, search, sort]);

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

      <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] text-zinc-700 font-medium">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[12px] text-zinc-400 font-medium focus:outline-none focus:border-orange-500/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-[15px]">No deals found</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
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
