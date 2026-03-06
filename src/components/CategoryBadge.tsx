import { Category, CATEGORY_CONFIG } from "@/data/deals";

export default function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${config.gradient}`}
    >
      {config.icon} {category}
    </span>
  );
}
