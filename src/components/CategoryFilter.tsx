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
  const base = "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border";
  const active = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  const inactive = "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400 hover:border-white/[0.1]";

  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onChange(null)} className={`${base} ${selected === null ? active : inactive}`} aria-label="Show all categories" aria-pressed={selected === null}>
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(selected === cat ? null : cat)}
          className={`${base} ${selected === cat ? active : inactive}`}
          aria-label={`Filter by ${cat}`}
          aria-pressed={selected === cat}
        >
          {CATEGORY_CONFIG[cat].icon} {cat}
        </button>
      ))}
    </div>
  );
}
