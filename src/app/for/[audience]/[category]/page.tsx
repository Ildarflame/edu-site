import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { AUDIENCE_SEO, CATEGORY_SEO, getCrossFilterMeta } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  const params: { audience: string; category: string }[] = [];
  for (const a of AUDIENCE_SEO) {
    for (const c of CATEGORY_SEO) {
      params.push({ audience: a.slug, category: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string; category: string }>;
}): Promise<Metadata> {
  const { audience, category } = await params;
  const aud = AUDIENCE_SEO.find((a) => a.slug === audience);
  const cat = CATEGORY_SEO.find((c) => c.slug === category);
  if (!aud || !cat) return { title: "Not Found" };

  const deals = await getDeals();
  const count = deals.filter(
    (d) => d.category === cat.category && d.audiences.includes(aud.audience),
  ).length;
  const meta = getCrossFilterMeta(aud.audience, cat.category, count);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://studentperks.dev/for/${audience}/${category}`,
    },
  };
}

export default async function CrossFilterPage({
  params,
}: {
  params: Promise<{ audience: string; category: string }>;
}) {
  const { audience, category } = await params;
  const aud = AUDIENCE_SEO.find((a) => a.slug === audience);
  const cat = CATEGORY_SEO.find((c) => c.slug === category);
  if (!aud || !cat) notFound();

  const deals = await getDeals();
  const filtered = deals.filter(
    (d) => d.category === cat.category && d.audiences.includes(aud.audience),
  );
  const meta = getCrossFilterMeta(aud.audience, cat.category, filtered.length);
  const config = CATEGORY_CONFIG[cat.category];

  const otherCategories = CATEGORY_SEO.filter((c) => c.slug !== category);

  const audienceLabel =
    aud.audience === "students"
      ? "Students"
      : aud.audience === "startups"
        ? "Startups"
        : "Open Source Projects";

  // JSON-LD — all content is controlled/hardcoded, not user input
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
      { "@type": "ListItem", position: 2, name: aud.heading, item: `https://studentperks.dev/for/${audience}` },
      { "@type": "ListItem", position: 3, name: cat.category },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href={`/for/${audience}`} className="hover:text-orange-400 transition-colors">{audienceLabel}</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{cat.category}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} {cat.category} for {audienceLabel}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Free {cat.category} Tools for {audienceLabel}
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{meta.intro}</p>
        <p className="mt-3 text-[13px] text-zinc-600">
          {filtered.length} deals &middot; Updated March 2026
        </p>
      </div>

      {/* Deal grid or empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid mb-16">
          {filtered.map((deal) => (
            <DealCard key={deal.slug} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center mb-16">
          <p className="text-zinc-500 mb-4">No deals found for this combination yet.</p>
          <Link href={`/for/${audience}`} className="text-orange-400 hover:text-orange-300 text-[14px] font-medium">
            Browse all {audienceLabel} deals &rarr;
          </Link>
        </div>
      )}

      {/* Navigation */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Other {audienceLabel} Categories</h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((c) => {
            const cfg = CATEGORY_CONFIG[c.category];
            return (
              <Link
                key={c.slug}
                href={`/for/${audience}/${c.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                <span>{cfg.icon}</span>
                <span>{c.category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-[13px]">
        <Link href={`/category/${category}`} className="text-zinc-500 hover:text-orange-400 transition-colors">
          All {cat.category} deals &rarr;
        </Link>
        <Link href={`/top/${category}`} className="text-zinc-500 hover:text-orange-400 transition-colors">
          Top {cat.category} deals &rarr;
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
