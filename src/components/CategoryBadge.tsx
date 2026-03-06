import { Category, CATEGORY_CONFIG } from "@/data/deals";

const styles: Record<string, string> = {
  blue: "text-blue-400/80 bg-blue-500/8 border-blue-500/10",
  purple: "text-purple-400/80 bg-purple-500/8 border-purple-500/10",
  pink: "text-pink-400/80 bg-pink-500/8 border-pink-500/10",
  amber: "text-amber-400/80 bg-amber-500/8 border-amber-500/10",
  sky: "text-sky-400/80 bg-sky-500/8 border-sky-500/10",
  emerald: "text-emerald-400/80 bg-emerald-500/8 border-emerald-500/10",
  red: "text-red-400/80 bg-red-500/8 border-red-500/10",
};

export default function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  const cls = styles[config.color] ?? styles.blue;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${cls}`}>
      {config.icon} {category}
    </span>
  );
}
