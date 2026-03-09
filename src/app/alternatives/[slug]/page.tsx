import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { ALTERNATIVES_SEO, CATEGORY_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return ALTERNATIVES_SEO.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alt = ALTERNATIVES_SEO.find((a) => a.slug === slug);
  if (!alt) return { title: "Not Found" };
  return {
    title: `Best Free Alternatives to ${alt.name} 2026 | StudentPerks`,
    description: `Discover free alternatives to ${alt.name} for students, startups, and open source projects. Verified deals with step-by-step claim instructions.`,
    alternates: {
      canonical: `https://studentperks.dev/alternatives/${slug}`,
    },
  };
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = ALTERNATIVES_SEO.find((a) => a.slug === slug);
  if (!alt) notFound();

  const deals = await getDeals();
  const filtered = deals.filter(
    (d) => d.category === alt.category && d.slug !== alt.slug,
  );
  const config = CATEGORY_CONFIG[alt.category];
  const catSeo = CATEGORY_SEO.find((c) => c.category === alt.category);
  const otherAlternatives = ALTERNATIVES_SEO.filter((a) => a.slug !== slug);

  // FAQ JSON-LD — controlled data from seo-content.ts
  const faqLd = alt.faqs.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: alt.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }).replace(/</g, "\\u003c") : null;

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Alternatives to ${alt.name}`,
    description: `Free alternatives to ${alt.name} for students, startups, and open source.`,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://studentperks.dev/deals/${deal.slug}`,
      name: deal.name,
    })),
  }).replace(/</g, "\\u003c");

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
      { "@type": "ListItem", position: 2, name: alt.category, item: `https://studentperks.dev/category/${catSeo?.slug || alt.category.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: `Alternatives to ${alt.name}` },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href={`/category/${catSeo?.slug || alt.category.toLowerCase()}`} className="hover:text-orange-400 transition-colors">
          {alt.category}
        </Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Alternatives to {alt.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} {alt.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Best Free Alternatives to {alt.name}
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{alt.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} alternatives &middot; Updated March 2026
        </p>
      </div>

      {/* Deal grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {/* FAQ — content from controlled seo-content.ts data, not user input */}
      {alt.faqs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {alt.faqs.map((faq, i) => (
              <div key={i} className="card p-5">
                <h3 className="text-[15px] font-semibold text-zinc-200 mb-2">{faq.question}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other alternatives */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">More Alternatives</h2>
        <div className="flex flex-wrap gap-2">
          {otherAlternatives.map((a) => (
            <Link
              key={a.slug}
              href={`/alternatives/${a.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
            >
              {a.name}
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
