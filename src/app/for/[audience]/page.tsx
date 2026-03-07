import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { AUDIENCE_SEO, CATEGORY_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return AUDIENCE_SEO.map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string }>;
}): Promise<Metadata> {
  const { audience } = await params;
  const seo = AUDIENCE_SEO.find((a) => a.slug === audience);
  if (!seo) return { title: "Not Found" };
  return {
    title: seo.title,
    description: seo.metaDescription,
    alternates: { canonical: `https://studentperks.dev/for/${audience}` },
  };
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const seo = AUDIENCE_SEO.find((a) => a.slug === audience);
  if (!seo) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => d.audiences.includes(seo.audience));
  const otherAudiences = AUDIENCE_SEO.filter((a) => a.slug !== audience);

  // Category breakdown
  const categoryBreakdown = CATEGORY_SEO.map((cat) => {
    const count = filtered.filter((d) => d.category === cat.category).length;
    return { ...cat, count };
  }).filter((c) => c.count > 0);

  // JSON-LD structured data — all content is hardcoded, not user input
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: seo.heading,
    description: seo.metaDescription,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://studentperks.dev/deals/${deal.slug}`,
      name: deal.name,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
      { "@type": "ListItem", position: 2, name: seo.heading },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{seo.heading}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">{seo.heading}</h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{seo.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} deals &middot; Updated March 2026
        </p>
      </div>

      {/* Eligibility */}
      <section className="card p-6 mb-10 border-orange-500/10">
        <h2 className="text-[15px] font-semibold text-zinc-200 mb-3">Eligibility</h2>
        <ul className="space-y-2">
          {seo.eligibility.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] text-zinc-500">
              <span className="text-emerald-500 mt-0.5">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Category breakdown */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categoryBreakdown.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat.category];
            return (
              <Link
                key={cat.slug}
                href={`/for/${audience}/${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                <span>{cfg.icon}</span>
                <span>{cat.category}</span>
                <span className="text-zinc-600">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Deal grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {/* FAQ */}
      {seo.faqs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {seo.faqs.map((faq, i) => (
              <div key={i} className="card p-5">
                <h3 className="text-[15px] font-semibold text-zinc-200 mb-2">{faq.question}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other audiences */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Other Audiences</h2>
        <div className="flex flex-wrap gap-2">
          {otherAudiences.map((a) => (
            <Link
              key={a.slug}
              href={`/for/${a.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
            >
              {a.heading}
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD — all content is controlled/hardcoded, not user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
