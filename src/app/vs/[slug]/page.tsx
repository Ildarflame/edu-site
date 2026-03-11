import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeals } from "@/lib/deals";
import { VS_SEO, COMPARISON_SEO } from "@/data/seo-content";
import DealCard from "@/components/DealCard";

export const revalidate = 300;

export function generateStaticParams() {
  return VS_SEO.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vs = VS_SEO.find((v) => v.slug === slug);
  if (!vs) return { title: "Not Found" };
  return {
    title: vs.title,
    description: vs.metaDescription,
    alternates: { canonical: `https://www.studentperks.dev/vs/${slug}` },
    openGraph: {
      title: vs.title,
      description: vs.metaDescription,
    },
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vs = VS_SEO.find((v) => v.slug === slug);
  if (!vs) notFound();

  const deals = await getDeals();
  const deal1 = vs.tool1Slug ? deals.find((d) => d.slug === vs.tool1Slug) : undefined;
  const deal2 = vs.tool2Slug ? deals.find((d) => d.slug === vs.tool2Slug) : undefined;

  const otherVs = VS_SEO.filter((v) => v.slug !== slug);
  const relatedCompare = COMPARISON_SEO.filter(
    (c) =>
      c.slug.includes(slug.split("-vs-")[0]) ||
      c.slug.includes(slug.split("-vs-")[1]),
  );

  // JSON-LD — controlled editorial data, safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "VS Comparisons", item: "https://www.studentperks.dev/vs" },
      { "@type": "ListItem", position: 3, name: `${vs.tool1} vs ${vs.tool2}` },
    ],
  }).replace(/</g, "\\u003c");

  // JSON-LD — controlled editorial data, safe for inline script
  const faqLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${vs.tool1} or ${vs.tool2} better for students?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: vs.winner,
        },
      },
      {
        "@type": "Question",
        name: `Can students get ${vs.tool1} for free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: vs.forStudents,
        },
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{vs.tool1} vs {vs.tool2}</span>
      </nav>

      <div className="mb-10">
        <span className="section-label text-orange-400/80 mb-3 block">Student Comparison</span>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          {vs.tool1} vs {vs.tool2}
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed">{vs.intro}</p>
      </div>

      {/* For Students */}
      <section className="card p-6 mb-10 border-l-2 border-orange-500/40">
        <h2 className="text-lg font-bold text-zinc-100 mb-2 flex items-center gap-2">
          <span className="text-orange-400">🎓</span> Why Students Should Care
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{vs.forStudents}</p>
      </section>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 text-zinc-500 font-medium">Feature</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{vs.tool1}</th>
              <th className="text-left py-3 text-zinc-200 font-medium">{vs.tool2}</th>
            </tr>
          </thead>
          <tbody>
            {vs.rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.04]">
                <td className="py-3 text-zinc-500">{row.label}</td>
                <td className="py-3 text-zinc-300">{row.v1}</td>
                <td className="py-3 text-zinc-300">{row.v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <section className="card p-6 mb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Our Verdict for Students</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{vs.winner}</p>
      </section>

      {/* Deal Cards */}
      {(deal1 || deal2) && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">Claim These Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deal1 && <DealCard deal={deal1} />}
            {deal2 && <DealCard deal={deal2} />}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
              Is {vs.tool1} or {vs.tool2} better for students?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{vs.winner}</p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">
              Can students get {vs.tool1} for free?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{vs.forStudents}</p>
          </div>
        </div>
      </section>

      {/* Related Compare Pages */}
      {relatedCompare.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">Related Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {relatedCompare.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-orange-500/30 hover:text-zinc-200 transition-all"
              >
                {c.slug.replace(/-/g, " ").replace(/vs/, "vs.")}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* More VS Pages */}
      {otherVs.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-zinc-100 mb-4">More Student Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {otherVs.map((v) => (
              <Link
                key={v.slug}
                href={`/vs/${v.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-orange-500/30 hover:text-zinc-200 transition-all"
              >
                {v.tool1} vs {v.tool2}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD — controlled data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      {/* JSON-LD — controlled editorial data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />
    </main>
  );
}
