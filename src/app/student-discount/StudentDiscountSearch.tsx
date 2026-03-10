"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Deal } from "@/data/deals";
import { CATEGORY_CONFIG } from "@/data/deals";
import type { Category } from "@/data/deals";

export default function StudentDiscountSearch({ grouped }: { grouped: Record<string, Deal[]> }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filteredGrouped = Object.entries(grouped).reduce<Record<string, Deal[]>>((acc, [cat, deals]) => {
    const filtered = q ? deals.filter(d => d.name.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q)) : deals;
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  const categories = Object.keys(filteredGrouped) as Category[];
  const totalFiltered = Object.values(filteredGrouped).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search student deals..."
          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[14px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500/30 transition-colors"
        />
        {q && (
          <p className="text-[12px] text-zinc-600 mt-2">{totalFiltered} deals found</p>
        )}
      </div>

      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat as Category];
        const catDeals = filteredGrouped[cat];
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-zinc-100 mb-3 flex items-center gap-2">
              <span>{config.icon}</span> {cat}
              <span className="text-xs text-zinc-600 font-normal">({catDeals.length})</span>
            </h2>
            <div className="space-y-2">
              {catDeals.map((deal) => (
                <Link
                  key={deal.slug}
                  href={`/student-discount/${deal.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={deal.logo} alt={deal.name} width={24} height={24} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">{deal.name}</span>
                    <p className="text-[11px] text-zinc-600 truncate">{deal.tagline}</p>
                  </div>
                  <span className="value-pill text-xs shrink-0">{deal.value}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {categories.length === 0 && q && (
        <div className="card p-8 text-center">
          <p className="text-zinc-500 text-[15px]">No deals match &quot;{query}&quot;</p>
          <button onClick={() => setQuery("")} className="text-[13px] text-orange-400 mt-2 hover:text-orange-300">Clear search</button>
        </div>
      )}
    </div>
  );
}
