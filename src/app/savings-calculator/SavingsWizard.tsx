"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Deal } from "@/data/deals";
import { CATEGORY_CONFIG } from "@/data/deals";

function parseDollarValue(v: string): number {
  const cleaned = v.replace(/,/g, "");
  const match = cleaned.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function SavingsWizard({ deals }: { deals: Deal[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(deals.map((d) => d.slug)));
  const clearAll = () => setSelected(new Set());

  const totalSavings = useMemo(() => {
    return deals
      .filter((d) => selected.has(d.slug))
      .reduce((sum, d) => sum + parseDollarValue(d.value), 0);
  }, [deals, selected]);

  const selectedDeals = deals.filter((d) => selected.has(d.slug));

  const shareText = `I can save $${totalSavings.toLocaleString()}/year with ${selected.size} free student tools! Check yours: studentperks.dev/savings-calculator`;

  return (
    <div>
      <div className="text-center mb-10">
        <p className="section-label mb-2">Interactive Calculator</p>
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-3">
          How Much Are You Leaving on the Table?
        </h1>
        <p className="text-[15px] text-zinc-500 max-w-lg mx-auto">
          Select the tools you use or want to use. We&apos;ll calculate how much you save with student discounts.
        </p>
      </div>

      {/* Sticky total */}
      <div className="sticky top-14 z-40 card p-4 mb-8 flex items-center justify-between" style={{ background: "rgba(12, 12, 14, 0.95)", backdropFilter: "blur(12px)" }}>
        <div>
          <p className="text-[11px] text-zinc-600 uppercase tracking-wider">Your annual savings</p>
          <p className={`text-3xl font-bold transition-colors ${totalSavings > 0 ? "text-emerald-400" : "text-zinc-700"}`}>
            ${totalSavings.toLocaleString()}<span className="text-lg text-zinc-600">/year</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-zinc-600">{selected.size} tools</span>
          {totalSavings > 0 && (
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-[12px] px-3 py-1.5"
            >
              Share Result
            </a>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        <button onClick={selectAll} className="btn-ghost text-[12px]">Select All</button>
        <button onClick={clearAll} className="btn-ghost text-[12px]">Clear All</button>
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10">
        {deals.map((deal) => {
          const isSelected = selected.has(deal.slug);
          const value = parseDollarValue(deal.value);
          const config = CATEGORY_CONFIG[deal.category];
          return (
            <button
              key={deal.slug}
              onClick={() => toggle(deal.slug)}
              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                isSelected
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center text-[11px] shrink-0 ${
                isSelected ? "bg-emerald-500 text-white" : "bg-white/[0.06] text-zinc-700"
              }`}>
                {isSelected ? "✓" : ""}
              </div>
              <div className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                <Image src={deal.logo} alt={deal.name} width={18} height={18} className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-zinc-200">{deal.name}</span>
                <span className="text-[10px] text-zinc-700 ml-1.5">{config.icon}</span>
              </div>
              <span className={`text-[12px] font-semibold shrink-0 ${isSelected ? "text-emerald-400" : "text-zinc-600"}`}>
                {value > 0 ? `$${value.toLocaleString()}` : "Free"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      {selectedDeals.length > 0 && (
        <div className="card p-6 text-center mb-8">
          <p className="text-[13px] text-zinc-500 mb-2">
            With {selected.size} student deals, you save
          </p>
          <p className="text-5xl font-bold text-emerald-400 mb-4">
            ${totalSavings.toLocaleString()}<span className="text-xl text-zinc-600">/year</span>
          </p>
          <div className="flex justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Share on Twitter/X
            </a>
            <Link href="/student-discount" className="btn-ghost">
              Claim These Deals →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
