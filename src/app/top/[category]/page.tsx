import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { CATEGORY_SEO, getTopMeta } from "@/data/seo-content";
import CategoryBadge from "@/components/CategoryBadge";
import AudienceBadge from "@/components/AudienceBadge";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORY_SEO.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORY_SEO.find((c) => c.slug === category);
  if (!cat) return { title: "Not Found" };

  const deals = await getDeals();
  const count = deals.filter((d) => d.category === cat.category).length;
  const meta = getTopMeta(cat.category, count);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://studentperks.dev/top/${category}`,
    },
  };
}

export default async function TopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORY_SEO.find((c) => c.slug === category);
  if (!cat) notFound();

  const deals = await getDeals();
  const filtered = deals.filter((d) => d.category === cat.category);

  // Sort: featured first, then rest
  const sorted = [...filtered].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const config = CATEGORY_CONFIG[cat.category];
  const meta = getTopMeta(cat.category, sorted.length);
  const otherCategories = CATEGORY_SEO.filter((c) => c.slug !== category);

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    description: meta.description,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((deal, i) => ({
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
      { "@type": "ListItem", position: 2, name: cat.category, item: `https://studentperks.dev/category/${category}` },
      { "@type": "ListItem", position: 3, name: `Top ${sorted.length}` },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href={`/category/${category}`} className="hover:text-orange-400 transition-colors">{cat.category}</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Top {sorted.length}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} Best of {cat.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Top {sorted.length} Best Free {cat.category} Tools
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed">
          Ranked list of the best free {cat.category.toLowerCase()} tools for students, startups, and open source projects. Updated March 2026.
        </p>
      </div>

      {/* Numbered list */}
      <div className="space-y-4 mb-16">
        {sorted.map((deal, i) => (
          <Link
            key={deal.slug}
            href={`/deals/${deal.slug}`}
            className="card flex items-start gap-4 p-5 group"
          >
            {/* Rank */}
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-[13px] font-bold shrink-0 shadow shadow-orange-500/20">
              {i + 1}
            </span>

            {/* Logo */}
            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
              <Image src={deal.logo} alt={deal.name} width={24} height={24} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                  {deal.name}
                </h2>
                <span className="value-pill text-[11px] px-2 py-0.5">{deal.value}</span>
              </div>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-2">{deal.description}</p>
              <div className="flex flex-wrap gap-1.5">
                <CategoryBadge category={deal.category} />
                {deal.audiences.map((a) => (
                  <AudienceBadge key={a} audience={a} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View all link */}
      <div className="text-center mb-16">
        <Link
          href={`/category/${category}`}
          className="text-[14px] font-medium text-orange-400 hover:text-orange-300 transition-colors"
        >
          View all {cat.category} deals &rarr;
        </Link>
      </div>

      {/* Other top lists */}
      <section>
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Other Top Lists</h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((c) => {
            const cfg = CATEGORY_CONFIG[c.category];
            return (
              <Link
                key={c.slug}
                href={`/top/${c.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                <span>{cfg.icon}</span>
                <span>Top {c.category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* JSON-LD — controlled data, safe */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
