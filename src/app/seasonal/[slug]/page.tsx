import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { SEASONAL_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return SEASONAL_SEO.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seasonal = SEASONAL_SEO.find((s) => s.slug === slug);
  if (!seasonal) return { title: "Not Found" };
  return {
    title: seasonal.title,
    description: seasonal.metaDescription,
    alternates: {
      canonical: `https://studentperks.dev/seasonal/${slug}`,
    },
  };
}

export default async function SeasonalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seasonal = SEASONAL_SEO.find((s) => s.slug === slug);
  if (!seasonal) notFound();

  const deals = await getDeals();
  const filtered = deals.filter(
    (d) =>
      seasonal.categories.includes(d.category) &&
      d.audiences.some((a) => seasonal.audiences.includes(a)),
  );

  // JSON-LD — all content from controlled seo-content.ts, not user input
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: seasonal.heading,
    description: seasonal.intro,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://studentperks.dev/deals/${deal.slug}`,
      name: deal.name,
    })),
  }).replace(/</g, "\\u003c");

  const faqLd = seasonal.faqs.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seasonal.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }).replace(/</g, "\\u003c") : null;

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
      { "@type": "ListItem", position: 2, name: seasonal.heading },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{seasonal.heading}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          {seasonal.heading}
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{seasonal.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} deals available
        </p>
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {/* FAQ */}
      {seasonal.faqs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {seasonal.faqs.map((faq, i) => (
              <div key={i} className="card p-5">
                <h3 className="text-[15px] font-semibold text-zinc-200 mb-2">{faq.question}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other seasonal pages */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">More Seasonal Deals</h2>
        <div className="flex flex-wrap gap-2">
          {SEASONAL_SEO.filter((s) => s.slug !== slug).map((s) => (
            <Link
              key={s.slug}
              href={`/seasonal/${s.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
            >
              {s.heading}
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD — all content from controlled seo-content.ts, not user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
    </main>
  );
}
