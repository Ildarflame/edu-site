"use client";

import { Category, CATEGORY_CONFIG } from "@/data/deals";

const categories = Object.keys(CATEGORY_CONFIG) as Category[];

export default function CategoryFilter({
  selected,
  onChange,
}: {
  selected: Category | null;
  onChange: (c: Category | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
          selected === null
            ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
            : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.12]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(selected === cat ? null : cat)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            selected === cat
              ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
              : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.12]"
          }`}
        >
          {CATEGORY_CONFIG[cat].icon} {cat}
        </button>
      ))}
    </div>
  );
}
