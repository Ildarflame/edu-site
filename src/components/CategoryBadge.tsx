import { Category, CATEGORY_CONFIG } from "@/data/deals";

const darkColors: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  const colorClasses = darkColors[config.color] ?? darkColors.blue;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${colorClasses}`}
    >
      {config.icon} {category}
    </span>
  );
}
