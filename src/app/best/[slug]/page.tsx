import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { USE_CASE_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return USE_CASE_SEO.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = USE_CASE_SEO.find((u) => u.slug === slug);
  if (!useCase) return { title: "Not Found" };
  return {
    title: useCase.title,
    description: useCase.metaDescription,
    alternates: { canonical: `https://studentperks.dev/best/${slug}` },
  };
}

export default async function BestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = USE_CASE_SEO.find((u) => u.slug === slug);
  if (!useCase) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => {
    if (useCase.filterCategory && d.category !== useCase.filterCategory) return false;
    const haystack = `${d.name} ${d.tagline} ${d.description} ${d.slug}`.toLowerCase();
    return useCase.filterKeywords.some((kw) => haystack.includes(kw));
  });

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: useCase.heading,
    description: useCase.intro,
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
      { "@type": "ListItem", position: 2, name: useCase.heading },
    ],
  }).replace(/</g, "\\u003c");

  const faqLd = useCase.faqs.length > 0
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: useCase.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }).replace(/</g, "\\u003c")
    : null;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{useCase.heading}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">{useCase.heading}</h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{useCase.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} tools &middot; Updated March 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      {useCase.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">FAQ</h2>
          <div className="space-y-4">
            {useCase.faqs.map((faq, i) => (
              <div key={i} className="card p-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{faq.question}</h3>
                <p className="text-sm text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD — controlled data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
    </main>
  );
}
