"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Deal, Category, Audience } from "@/data/deals";
import DealCard from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import CompareBar from "./CompareBar";

const DEALS_PER_PAGE = 12;

const audienceOptions: { value: Audience | null; label: string }[] = [
  { value: null, label: "Everyone" },
  { value: "students", label: "Students" },
  { value: "startups", label: "Startups" },
  { value: "opensource", label: "Open Source" },
];

export type ValueFilter = "all" | "free" | "credits" | "discount" | "pro";

const valueFilterOptions: { value: ValueFilter; label: string }[] = [
  { value: "all", label: "Any value" },
  { value: "free", label: "Free" },
  { value: "credits", label: "Credits" },
  { value: "discount", label: "Discount" },
  { value: "pro", label: "Pro Plan" },
];

function matchesValueFilter(deal: Deal, filter: ValueFilter): boolean {
  if (filter === "all") return true;
  const v = deal.value.toLowerCase();
  switch (filter) {
    case "free":
      return v.includes("free");
    case "credits":
      return v.includes("credit");
    case "discount":
      return v.includes("discount") || v.includes("saving") || v.includes("off");
    case "pro":
      return v.includes("plan") || v.includes("/year") || v.includes("/month");
    default:
      return true;
  }
}

type SortOption = "newest" | "value" | "az";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "value", label: "Most valuable" },
  { value: "az", label: "A-Z" },
];

function parseDollarValue(v: string): number {
  const cleaned = v.replace(/,/g, "");
  const match = cleaned.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  if (match) return parseFloat(match[1]);
  if (v.toLowerCase().includes("free")) return 0;
  return 0;
}

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
  const [valueFilter, setValueFilter] = useState<ValueFilter>(
    (searchParams.get("value") as ValueFilter) || "all"
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return p > 0 ? p : 1;
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const hasActiveFilters = !!(search || category || audience || valueFilter !== "all");

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setCategory(null);
    setAudience(null);
    setValueFilter("all");
    setPage(1);
  }, []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (valueFilter !== "all") params.set("value", valueFilter);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/deals${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, category, audience, valueFilter, sort, page, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const resetPage = useCallback(() => setPage(1), []);

  const handleSearch = useCallback((v: string) => { setSearch(v); resetPage(); }, [resetPage]);
  const handleCategory = useCallback((v: Category | null) => { setCategory(v); resetPage(); }, [resetPage]);
  const handleAudience = useCallback((v: Audience | null) => { setAudience(v); resetPage(); }, [resetPage]);
  const handleValueFilter = useCallback((v: ValueFilter) => { setValueFilter(v); resetPage(); }, [resetPage]);
  const handleSort = useCallback((v: SortOption) => { setSort(v); resetPage(); }, [resetPage]);

  const toggleCompare = useCallback((slug: string) => {
    setCompareIds((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 3 ? [...prev, slug] : prev
    );
  }, []);

  const filtered = useMemo(() => {
    let result = deals.filter((deal) => {
      if (category && deal.category !== category) return false;
      if (audience && !deal.audiences.includes(audience)) return false;
      if (!matchesValueFilter(deal, valueFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!deal.name.toLowerCase().includes(q) && !deal.tagline.toLowerCase().includes(q) && !deal.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "az":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "value":
        result = [...result].sort((a, b) => parseDollarValue(b.value) - parseDollarValue(a.value));
        break;
      case "newest":
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [deals, category, audience, valueFilter, search, sort]);

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

  const compareDeals = deals.filter((d) => compareIds.includes(d.slug));

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
        <div className="flex flex-wrap gap-1.5">
          {valueFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleValueFilter(opt.value)}
              className={`${base} ${valueFilter === opt.value ? active : inactive}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[12px] text-zinc-500 hover:text-orange-400 transition-colors underline underline-offset-2"
          >
            Clear all filters
          </button>
        )}
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
              <DealCard
                key={deal.slug}
                deal={deal}
                compareMode
                isComparing={compareIds.includes(deal.slug)}
                onToggleCompare={toggleCompare}
              />
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

      {compareIds.length > 0 && (
        <CompareBar deals={compareDeals} onRemove={toggleCompare} onClear={() => setCompareIds([])} />
      )}
    </div>
  );
}
