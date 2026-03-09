"use client";

import { memo } from "react";
import { Deal, Category, Audience } from "@/data/deals";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import MobileFilterDrawer from "./MobileFilterDrawer";

export type ValueFilter = "all" | "free" | "credits" | "discount" | "pro";
export type SortOption = "newest" | "value" | "az";

const audienceOptions: { value: Audience | null; label: string }[] = [
  { value: null, label: "Everyone" },
  { value: "students", label: "Students" },
  { value: "startups", label: "Startups" },
  { value: "opensource", label: "Open Source" },
];

const valueFilterOptions: { value: ValueFilter; label: string }[] = [
  { value: "all", label: "Any value" },
  { value: "free", label: "Free" },
  { value: "credits", label: "Credits" },
  { value: "discount", label: "Discount" },
  { value: "pro", label: "Pro Plan" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "value", label: "Most valuable" },
  { value: "az", label: "A-Z" },
];

const base = "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border";
const active = "bg-orange-500/10 text-orange-400 border-orange-500/20";
const inactive = "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400 hover:border-white/[0.1]";

type Props = {
  search: string;
  category: Category | null;
  audience: Audience | null;
  valueFilter: ValueFilter;
  sort: SortOption;
  totalCount: number;
  startItem: number;
  endItem: number;
  hasActiveFilters: boolean;
  filteredDeals: Deal[];
  onSearch: (v: string) => void;
  onCategory: (v: Category | null) => void;
  onAudience: (v: Audience | null) => void;
  onValueFilter: (v: ValueFilter) => void;
  onSort: (v: SortOption) => void;
  onClearAll: () => void;
};

function exportCSV(deals: Deal[]) {
  const header = "Name,Category,Value,URL\n";
  const rows = deals.map((d) =>
    `"${d.name.replace(/"/g, '""')}","${d.category}","${d.value.replace(/"/g, '""')}","${d.url}"`
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studentperks-deals.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default memo(function FilterBar({
  search, category, audience, valueFilter, sort,
  totalCount, startItem, endItem, hasActiveFilters, filteredDeals,
  onSearch, onCategory, onAudience, onValueFilter, onSort, onClearAll,
}: Props) {
  const activeCount = [category, audience, valueFilter !== "all" ? valueFilter : null, search || null].filter(Boolean).length;

  return (
    <>
      <MobileFilterDrawer activeCount={activeCount}>
        <div className="space-y-3 mb-8 md:mb-0">
          <SearchBar value={search} onChange={onSearch} />
          <CategoryFilter selected={category} onChange={onCategory} />
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by audience">
            {audienceOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onAudience(opt.value)}
                className={`${base} ${audience === opt.value ? active : inactive}`}
                aria-pressed={audience === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by value type">
            {valueFilterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onValueFilter(opt.value)}
                className={`${base} ${valueFilter === opt.value ? active : inactive}`}
                aria-pressed={valueFilter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-[12px] text-zinc-500 hover:text-orange-400 transition-colors underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </MobileFilterDrawer>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-zinc-700 font-medium">
          {totalCount === 0
            ? "0 deals"
            : `Showing ${startItem}-${endItem} of ${totalCount} deal${totalCount !== 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(filteredDeals)}
            className="text-[12px] text-zinc-600 hover:text-orange-400 transition-colors font-medium flex items-center gap-1"
            aria-label="Export filtered deals as CSV"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortOption)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[12px] text-zinc-400 font-medium focus:outline-none focus:border-orange-500/30"
            aria-label="Sort deals"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
});
