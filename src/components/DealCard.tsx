import Link from "next/link";
import { Deal, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

export default function DealCard({ deal }: { deal: Deal }) {
  const catConfig = CATEGORY_CONFIG[deal.category];

  return (
    <Link
      href={`/deals/${deal.slug}`}
      className="card-glow group block bg-[#111113] rounded-xl border border-white/[0.06] p-6 relative overflow-hidden"
    >
      {/* Subtle top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${catConfig.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xl">
          {catConfig.icon}
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-md border border-emerald-400/20">
          {deal.value}
        </span>
      </div>

      <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors duration-200">
        {deal.name}
      </h3>
      <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
        {deal.tagline}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <CategoryBadge category={deal.category} />
        {deal.audiences.map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
    </Link>
  );
}
