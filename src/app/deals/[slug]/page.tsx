import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deals, getDealBySlug, getDealsByCategory, CATEGORY_CONFIG } from "@/data/deals";
import CategoryBadge from "@/components/CategoryBadge";
import AudienceBadge from "@/components/AudienceBadge";
import DealCard from "@/components/DealCard";

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) return { title: "Deal Not Found" };
  return {
    title: `${deal.name} — ${deal.tagline} | EduDeals`,
    description: deal.description,
  };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) notFound();

  const catConfig = CATEGORY_CONFIG[deal.category];
  const related = getDealsByCategory(deal.category)
    .filter((d) => d.slug !== deal.slug)
    .slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-600 mb-8 font-medium">
        <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="text-zinc-400">{deal.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#111113] border border-white/[0.06] flex items-center justify-center text-2xl shrink-0">
          {catConfig.icon}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{deal.name}</h1>
          <p className="mt-2 text-lg text-zinc-500">{deal.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CategoryBadge category={deal.category} />
            {deal.audiences.map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Value badge */}
      <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-6 mb-8">
        <div className="text-xs text-emerald-500 font-semibold uppercase tracking-wider">Estimated Value</div>
        <div className="text-3xl font-extrabold text-emerald-400 mt-1">{deal.value}</div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-3">About this deal</h2>
        <p className="text-zinc-400 leading-relaxed">{deal.description}</p>
      </div>

      {/* Steps */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">How to get it</h2>
        <div className="space-y-3">
          {deal.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#111113] rounded-xl border border-white/[0.06]">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 text-black flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-zinc-300 text-sm pt-0.5">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-black rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-orange-500/20"
      >
        Get this deal
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 pt-10 border-t border-white/[0.06]">
          <h2 className="text-2xl font-extrabold text-white mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((d) => (
              <DealCard key={d.slug} deal={d} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
