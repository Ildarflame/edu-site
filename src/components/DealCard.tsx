import Link from "next/link";
import { Deal, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

const accentMap: Record<string, string> = {
  blue: "card-accent-blue",
  purple: "card-accent-purple",
  pink: "card-accent-pink",
  amber: "card-accent-amber",
  sky: "card-accent-sky",
  emerald: "card-accent-emerald",
  red: "card-accent-red",
};

export default function DealCard({ deal, featured = false }: { deal: Deal; featured?: boolean }) {
  const catConfig = CATEGORY_CONFIG[deal.category];
  const accent = accentMap[catConfig.color] ?? "";

  return (
    <Link
      href={`/deals/${deal.slug}`}
      className={`card ${accent} group block p-5 relative overflow-hidden ${featured ? "md:p-7" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-lg">
          {catConfig.icon}
        </div>
        <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md">
          {deal.value}
        </span>
      </div>

      <h3 className={`font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors duration-200 ${featured ? "text-lg" : "text-[15px]"}`}>
        {deal.name}
      </h3>
      <p className={`mt-1 text-zinc-600 line-clamp-2 leading-relaxed ${featured ? "text-sm" : "text-[13px]"}`}>
        {deal.tagline}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <CategoryBadge category={deal.category} />
        {deal.audiences.map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
    </Link>
  );
}
