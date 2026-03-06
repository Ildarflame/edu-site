import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deals, getDealBySlug, getDealsByCategory } from "@/data/deals";
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

  const related = getDealsByCategory(deal.category)
    .filter((d) => d.slug !== deal.slug)
    .slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/deals" className="hover:text-purple-600">Deals</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{deal.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
          <span className="font-bold text-gray-400">{deal.name[0]}</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{deal.name}</h1>
          <p className="mt-2 text-lg text-gray-500">{deal.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CategoryBadge category={deal.category} />
            {deal.audiences.map((a) => (
              <AudienceBadge key={a} audience={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Value badge */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 mb-8">
        <div className="text-sm text-emerald-600 font-medium">Estimated Value</div>
        <div className="text-3xl font-extrabold text-emerald-700 mt-1">{deal.value}</div>
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none mb-8">
        <h2 className="text-xl font-bold">About this deal</h2>
        <p className="text-gray-600 leading-relaxed">{deal.description}</p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">How to get it</h2>
        <div className="space-y-3">
          {deal.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
      >
        Get this deal &rarr;
      </a>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((d) => (
              <DealCard key={d.slug} deal={d} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
