import Link from "next/link";
import Image from "next/image";
import { Deal, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";
import SaveButton from "./SaveButton";

const accentMap: Record<string, string> = {
  blue: "card-accent-blue",
  purple: "card-accent-purple",
  pink: "card-accent-pink",
  amber: "card-accent-amber",
  sky: "card-accent-sky",
  emerald: "card-accent-emerald",
  red: "card-accent-red",
};

export default function DealCard({
  deal,
  featured = false,
  compareMode = false,
  isComparing = false,
  onToggleCompare,
  isSaved,
  onSave,
}: {
  deal: Deal;
  featured?: boolean;
  compareMode?: boolean;
  isComparing?: boolean;
  onToggleCompare?: (slug: string) => void;
  isSaved?: boolean;
  onSave?: (slug: string) => void;
}) {
  const catConfig = CATEGORY_CONFIG[deal.category];
  const accent = accentMap[catConfig.color] ?? "";

  return (
    <div className={`relative ${isComparing ? "ring-1 ring-orange-500/40 rounded-2xl" : ""}`}>
      {compareMode && onToggleCompare && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(deal.slug);
          }}
          className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-150 ${
            isComparing
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-white/[0.03] border-white/[0.1] text-zinc-600 hover:border-orange-500/30 hover:text-orange-400"
          }`}
          title={isComparing ? "Remove from compare" : "Add to compare"}
        >
          {isComparing ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      )}
      <Link
        href={`/deals/${deal.slug}`}
        className={`card ${accent} group block p-5 relative overflow-hidden ${featured ? "md:p-7" : ""}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-[10px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <Image src={deal.logo} alt={deal.name} width={32} height={32} loading={featured ? undefined : "lazy"} />
          </div>
          <div className="flex items-center gap-1.5">
            {onSave && (
              <SaveButton saved={!!isSaved} onToggle={() => onSave(deal.slug)} />
            )}
            <span className="value-pill text-[11px] font-bold px-2.5 py-1 rounded-md">
              {deal.value}
            </span>
          </div>
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
    </div>
  );
}
