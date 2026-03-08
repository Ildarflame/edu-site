"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Deal, Category, Audience } from "@/data/deals";
import { useDebounce } from "@/lib/hooks";
import DealCard from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";
import FilterBar, { ValueFilter, SortOption } from "./FilterBar";
import PaginationControls from "./PaginationControls";
import CompareBar from "./CompareBar";

const DEALS_PER_PAGE = 12;

function matchesValueFilter(deal: Deal, filter: ValueFilter): boolean {
  if (filter === "all") return true;
  const v = deal.value.toLowerCase();
  switch (filter) {
    case "free": return v.includes("free");
    case "credits": return v.includes("credit");
    case "discount": return v.includes("discount") || v.includes("saving") || v.includes("off");
    case "pro": return v.includes("plan") || v.includes("/year") || v.includes("/month");
    default: return true;
  }
}

function parseDollarValue(v: string): number {
  const cleaned = v.replace(/,/g, "");
  const match = cleaned.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  if (match) return parseFloat(match[1]);
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
  const debouncedSearch = useDebounce(search, 300);
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

  const hasActiveFilters = !!(debouncedSearch || category || audience || valueFilter !== "all");

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setCategory(null);
    setAudience(null);
    setValueFilter("all");
    setPage(1);
  }, []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (valueFilter !== "all") params.set("value", valueFilter);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/deals${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, category, audience, valueFilter, sort, page, router]);

  useEffect(() => { syncUrl(); }, [syncUrl]);

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
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !deal.name.toLowerCase().includes(q) &&
          !deal.tagline.toLowerCase().includes(q) &&
          !deal.description.toLowerCase().includes(q)
        ) return false;
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
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [deals, category, audience, valueFilter, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEALS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedDeals = filtered.slice((safePage - 1) * DEALS_PER_PAGE, safePage * DEALS_PER_PAGE);
  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * DEALS_PER_PAGE + 1;
  const endItem = Math.min(safePage * DEALS_PER_PAGE, filtered.length);
  const compareDeals = deals.filter((d) => compareIds.includes(d.slug));

  return (
    <div>
      <FilterBar
        search={search}
        category={category}
        audience={audience}
        valueFilter={valueFilter}
        sort={sort}
        totalCount={filtered.length}
        startItem={startItem}
        endItem={endItem}
        hasActiveFilters={hasActiveFilters}
        filteredDeals={filtered}
        onSearch={handleSearch}
        onCategory={handleCategory}
        onAudience={handleAudience}
        onValueFilter={handleValueFilter}
        onSort={handleSort}
        onClearAll={clearAllFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: DEALS_PER_PAGE }).map((_, i) => (
            <DealCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-[15px]">No deals found</p>
          <p className="text-[13px] text-zinc-700 mt-1">Try adjusting your filters or search term</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 text-[13px] text-orange-400 hover:text-orange-300 transition-colors font-medium"
          >
            Clear all filters
          </button>
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
          <PaginationControls currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {compareIds.length > 0 && (
        <CompareBar deals={compareDeals} onRemove={toggleCompare} onClear={() => setCompareIds([])} />
      )}
    </div>
  );
}
