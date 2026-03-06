"use client";

import Link from "next/link";
import { Deal } from "@/data/deals";

export default function CompareBar({
  deals,
  onRemove,
  onClear,
}: {
  deals: Deal[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  const slugs = deals.map((d) => d.slug).join(",");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 border-t border-white/[0.06] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[13px] text-zinc-400 font-medium shrink-0">
            Compare ({deals.length})
          </span>
          <div className="flex gap-2 min-w-0 overflow-x-auto">
            {deals.map((deal) => (
              <span
                key={deal.slug}
                className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg px-2.5 py-1 text-[12px] text-zinc-300 shrink-0"
              >
                {deal.name}
                <button
                  onClick={() => onRemove(deal.slug)}
                  className="text-zinc-600 hover:text-orange-400 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Clear
          </button>
          {deals.length >= 2 && (
            <Link
              href={`/deals/compare?deals=${slugs}`}
              className="bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              Compare {deals.length} deals
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
