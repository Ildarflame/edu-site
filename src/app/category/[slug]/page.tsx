import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { CATEGORY_SEO, GUIDE_SEO, VS_SEO, ALTERNATIVES_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORY_SEO.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = CATEGORY_SEO.find((c) => c.slug === slug);
  if (!seo) return { title: "Not Found" };
  return {
    title: seo.title,
    description: seo.metaDescription,
    alternates: { canonical: `https://www.studentperks.dev/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = CATEGORY_SEO.find((c) => c.slug === slug);
  if (!seo) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => d.category === seo.category);
  const otherCategories = CATEGORY_SEO.filter((c) => c.slug !== slug);
  const config = CATEGORY_CONFIG[seo.category];

  // Find guides, VS comparisons, and alternatives related to this category
  const categoryDealSlugs = new Set(filtered.map((d) => d.slug));
  const relatedGuides = GUIDE_SEO.filter((g) => categoryDealSlugs.has(g.dealSlug));
  const relatedVs = VS_SEO.filter((v) => {
    const t1 = v.tool1Slug && categoryDealSlugs.has(v.tool1Slug);
    const t2 = v.tool2Slug && categoryDealSlugs.has(v.tool2Slug);
    return t1 || t2;
  });
  const relatedAlternatives = ALTERNATIVES_SEO.filter((a) =>
    filtered.some((d) => d.name.toLowerCase().includes(a.name.toLowerCase()))
  );

  // JSON-LD structured data (safe — all content is hardcoded, not user input)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: seo.heading,
    description: seo.metaDescription,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.studentperks.dev/deals/${deal.slug}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: seo.category },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{seo.category}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} {seo.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">{seo.heading}</h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{seo.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} deals &middot; Updated March 2026
        </p>
      </div>

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

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-100 mb-4">Step-by-Step Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedGuides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card p-4 hover:border-white/[0.12] transition-all">
                <h3 className="text-[14px] font-semibold text-zinc-200 mb-1">{g.heading}</h3>
                <p className="text-[12px] text-zinc-500 line-clamp-2">{g.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related comparisons */}
      {(relatedVs.length > 0 || relatedAlternatives.length > 0) && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-zinc-100 mb-4">Comparisons & Alternatives</h2>
          <div className="flex flex-wrap gap-2">
            {relatedVs.map((v) => (
              <Link key={v.slug} href={`/vs/${v.slug}`} className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all">
                {v.tool1} vs {v.tool2}
              </Link>
            ))}
            {relatedAlternatives.map((a) => (
              <Link key={a.slug} href={`/alternatives/${a.slug}`} className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all">
                Free {a.name} Alternatives
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related categories */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((c) => {
            const cfg = CATEGORY_CONFIG[c.category];
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                <span>{cfg.icon}</span>
                <span>{c.category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* JSON-LD: controlled data, safe to use dangerouslySetInnerHTML */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
