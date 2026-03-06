import Link from "next/link";
import { Deal } from "@/data/deals";
import CategoryBadge from "./CategoryBadge";
import AudienceBadge from "./AudienceBadge";

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl overflow-hidden">
          <span className="font-bold text-gray-400">{deal.name[0]}</span>
        </div>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          {deal.value}
        </span>
      </div>

      <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
        {deal.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{deal.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={deal.category} />
        {deal.audiences.map((a) => (
          <AudienceBadge key={a} audience={a} />
        ))}
      </div>
    </Link>
  );
}
