import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { TAG_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return TAG_SEO.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = TAG_SEO.find((t) => t.slug === slug);
  if (!tag) return { title: "Not Found" };
  return {
    title: `Free ${tag.label} Tools 2026 | StudentPerks`,
    description: tag.metaDescription,
    alternates: { canonical: `https://www.studentperks.dev/tag/${slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = TAG_SEO.find((t) => t.slug === slug);
  if (!tag) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => {
    const haystack = `${d.name} ${d.tagline} ${d.description} ${d.slug}`.toLowerCase();
    return tag.keywords.some((kw) => haystack.includes(kw));
  });

  const otherTags = TAG_SEO.filter((t) => t.slug !== slug);

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Free ${tag.label} Tools`,
    description: tag.description,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.studentperks.dev/deals/${deal.slug}`,
      name: deal.name,
    })),
  }).replace(/</g, "\\u003c");

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: tag.label },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{tag.label}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Free {tag.label} Tools
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{tag.description}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} tools &middot; Updated March 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
        {filtered.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>

      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Related Tags</h2>
        <div className="flex flex-wrap gap-2">
          {otherTags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD — controlled data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
