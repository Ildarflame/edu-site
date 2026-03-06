import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeals, getDealBySlug, getDealsByCategory, CATEGORY_CONFIG } from "@/lib/deals";
import CategoryBadge from "@/components/CategoryBadge";
import AudienceBadge from "@/components/AudienceBadge";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export async function generateStaticParams() {
  const deals = await getDeals();
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return { title: "Deal Not Found" };
  return { title: `${deal.name} — ${deal.tagline} | StudentPerks`, description: deal.description };
}

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) notFound();

  const catConfig = CATEGORY_CONFIG[deal.category];
  const related = (await getDealsByCategory(deal.category)).filter((d) => d.slug !== deal.slug).slice(0, 3);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{deal.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
          <Image src={deal.logo} alt={deal.name} width={36} height={36} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">{deal.name}</h1>
          <p className="mt-1.5 text-[15px] text-zinc-500">{deal.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <CategoryBadge category={deal.category} />
            {deal.audiences.map((a) => <AudienceBadge key={a} audience={a} />)}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="card p-5 mb-8 border-emerald-500/10">
        <p className="text-[11px] font-semibold text-emerald-500/70 uppercase tracking-wider">Estimated value</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">{deal.value}</p>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">About this deal</h2>
        <p className="text-[14px] text-zinc-500 leading-relaxed">{deal.description}</p>
      </div>

      {/* Steps */}
      <div className="mb-10">
        <h2 className="text-[15px] font-semibold text-zinc-200 mb-4">How to get it</h2>
        <div className="space-y-2">
          {deal.steps.map((step, i) => (
            <div key={i} className="card flex items-start gap-3.5 p-4">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow shadow-orange-500/20">
                {i + 1}
              </span>
              <span className="text-[13px] text-zinc-400 pt-0.5">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-[14px]"
      >
        Get this deal
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </a>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-white/[0.04]">
          <p className="section-label mb-2">More like this</p>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((d) => <DealCard key={d.slug} deal={d} />)}
          </div>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: deal.name,
            description: deal.description,
            url: deal.url,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </main>
  );
}
