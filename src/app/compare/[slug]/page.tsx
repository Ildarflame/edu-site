import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { COMPARISON_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return COMPARISON_SEO.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmp = COMPARISON_SEO.find((c) => c.slug === slug);
  if (!cmp) return { title: "Not Found" };
  return {
    title: cmp.title,
    description: cmp.metaDescription,
    alternates: { canonical: `https://www.studentperks.dev/compare/${slug}` },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmp = COMPARISON_SEO.find((c) => c.slug === slug);
  if (!cmp) notFound();

  const deals = await getDeals();
  const deal1 = deals.find((d) => d.slug === cmp.deal1Slug);
  const deal2 = deals.find((d) => d.slug === cmp.deal2Slug);
  if (!deal1 || !deal2) notFound();

  const rows = [
    { label: "Category", v1: deal1.category, v2: deal2.category },
    { label: "Value", v1: deal1.value, v2: deal2.value },
    { label: "Audiences", v1: deal1.audiences.join(", "), v2: deal2.audiences.join(", ") },
    { label: "Steps to Claim", v1: `${deal1.steps.length} steps`, v2: `${deal2.steps.length} steps` },
  ];

  const otherComparisons = COMPARISON_SEO.filter((c) => c.slug !== slug);

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Compare" },
      { "@type": "ListItem", position: 3, name: `${deal1.name} vs ${deal2.name}` },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{deal1.name} vs {deal2.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          {deal1.name} vs {deal2.name}
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">{cmp.intro}</p>
      </div>

      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 text-zinc-500 font-medium">Feature</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{deal1.name}</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{deal2.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.04]">
                <td className="py-3 text-zinc-500">{row.label}</td>
                <td className="py-3 text-zinc-300">{row.v1}</td>
                <td className="py-3 text-zinc-300">{row.v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-6 mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Which Should You Choose?</h2>
        <p className="text-sm text-zinc-400">{cmp.verdict}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        <DealCard deal={deal1} />
        <DealCard deal={deal2} />
      </div>

      {otherComparisons.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-4">More Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {otherComparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                {c.slug.replace(/-/g, " ").replace(/vs/, "vs.")}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD — controlled data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
