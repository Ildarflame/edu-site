"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Deal, Category, Audience } from "@/data/deals";
import DealCard from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

const DEALS_PER_PAGE = 12;

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
  isLoading = false,
}: {
  deals: Deal[];
  initialCategory?: Category;
  initialAudience?: Audience;
  isLoading?: boolean;
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
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return p > 0 ? p : 1;
  });

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (sort && sort !== "featured") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/deals${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, category, audience, sort, page, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // Reset page to 1 when filters change
  const resetPage = useCallback(() => setPage(1), []);

  const handleSearch = useCallback((v: string) => { setSearch(v); resetPage(); }, [resetPage]);
  const handleCategory = useCallback((v: Category | null) => { setCategory(v); resetPage(); }, [resetPage]);
  const handleAudience = useCallback((v: Audience | null) => { setAudience(v); resetPage(); }, [resetPage]);
  const handleSort = useCallback((v: SortOption) => { setSort(v); resetPage(); }, [resetPage]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEALS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedDeals = filtered.slice(
    (safePage - 1) * DEALS_PER_PAGE,
    safePage * DEALS_PER_PAGE
  );

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * DEALS_PER_PAGE + 1;
  const endItem = Math.min(safePage * DEALS_PER_PAGE, filtered.length);

  const base = "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border";
  const active = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  const inactive = "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400 hover:border-white/[0.1]";

  const pageBtn = "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all duration-150";
  const pageBtnActive = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  const pageBtnInactive = "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.1]";
  const pageBtnDisabled = "bg-white/[0.01] text-zinc-800 border-white/[0.03] cursor-not-allowed";

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      <div className="space-y-3 mb-8">
        <SearchBar value={search} onChange={handleSearch} />
        <CategoryFilter selected={category} onChange={handleCategory} />
        <div className="flex flex-wrap gap-1.5">
          {audienceOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAudience(opt.value)}
              className={`${base} ${audience === opt.value ? active : inactive}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-zinc-700 font-medium">
          {filtered.length === 0
            ? "0 deals"
            : `Showing ${startItem}-${endItem} of ${filtered.length} deal${filtered.length !== 1 ? "s" : ""}`}
        </p>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[12px] text-zinc-400 font-medium focus:outline-none focus:border-orange-500/30"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: DEALS_PER_PAGE }).map((_, i) => (
            <DealCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-[15px]">No deals found</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
            {paginatedDeals.map((deal) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className={`${pageBtn} ${safePage <= 1 ? pageBtnDisabled : pageBtnInactive}`}
              >
                Previous
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-zinc-700 text-[12px]">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`${pageBtn} ${p === safePage ? pageBtnActive : pageBtnInactive}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className={`${pageBtn} ${safePage >= totalPages ? pageBtnDisabled : pageBtnInactive}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
