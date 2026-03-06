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
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === null
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(selected === cat ? null : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? `bg-gradient-to-r ${CATEGORY_CONFIG[cat].gradient} text-white shadow-md`
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {CATEGORY_CONFIG[cat].icon} {cat}
        </button>
      ))}
    </div>
  );
}
