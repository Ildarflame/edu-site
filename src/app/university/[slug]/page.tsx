import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import { UNIVERSITIES } from "@/data/universities";
import type { Category } from "@/data/deals";

export const revalidate = 300;

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = UNIVERSITIES.find((u) => u.slug === slug);
  if (!uni) return { title: "Not Found" };
  const title = `Free Tools for ${uni.shortName} Students 2026 | StudentPerks`;
  const description = `All free software, cloud credits, and student discounts available to ${uni.name} students in 2026. Verified deals worth thousands.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.studentperks.dev/university/${slug}` },
    openGraph: { title, description },
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uni = UNIVERSITIES.find((u) => u.slug === slug);
  if (!uni) notFound();

  const deals = await getDeals();
  const studentDeals = deals.filter((d) => {
    if (!d.audiences.includes("students")) return false;
    if (d.regions && d.regions.length > 0 && !d.regions.includes(uni.region)) return false;
    return true;
  });

  const grouped = studentDeals.reduce<Record<Category, typeof studentDeals>>((acc, deal) => {
    if (!acc[deal.category]) acc[deal.category] = [];
    acc[deal.category].push(deal);
    return acc;
  }, {} as Record<Category, typeof studentDeals>);

  const categories = Object.keys(grouped) as Category[];

  const totalValue = studentDeals.reduce((sum, d) => {
    const match = d.value.replace(/,/g, "").match(/\$([0-9]+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const otherUnis = UNIVERSITIES.filter((u) => u.slug !== slug && u.region === uni.region).slice(0, 6);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{uni.shortName}</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-2">{uni.country} University</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
          Free Tools for {uni.shortName} Students
        </h1>
        <p className="text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          {studentDeals.length} verified free tools and student discounts available to {uni.name} students.
          Worth a combined <strong className="text-emerald-400">${totalValue.toLocaleString()}+</strong> in value.
          All you need is your university email to get started.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <div className="card px-4 py-2 text-center">
          <p className="text-lg font-bold text-zinc-100">{studentDeals.length}</p>
          <p className="text-[11px] text-zinc-600">Free Tools</p>
        </div>
        <div className="card px-4 py-2 text-center">
          <p className="text-lg font-bold text-emerald-400">${totalValue.toLocaleString()}+</p>
          <p className="text-[11px] text-zinc-600">Total Value</p>
        </div>
      </div>

      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat];
        const catDeals = grouped[cat];
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-zinc-100 mb-3 flex items-center gap-2">
              <span>{config.icon}</span> {cat}
              <span className="text-xs text-zinc-600 font-normal">({catDeals.length})</span>
            </h2>
            <div className="space-y-2">
              {catDeals.map((deal) => (
                <Link
                  key={deal.slug}
                  href={`/student-discount/${deal.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={deal.logo} alt={deal.name} width={20} height={20} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">{deal.name}</span>
                    <p className="text-[11px] text-zinc-600 truncate">{deal.tagline}</p>
                  </div>
                  <span className="value-pill text-xs shrink-0">{deal.value}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="card p-6 text-center mb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Find Your Personalized Deals</h2>
        <p className="text-[13px] text-zinc-500 mb-4">Get recommendations based on your major</p>
        <Link href="/student-freebies-finder" className="btn-primary">
          Open Freebies Finder →
        </Link>
      </div>

      {otherUnis.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">Other Universities</h2>
          <div className="flex flex-wrap gap-2">
            {otherUnis.map((u) => (
              <Link
                key={u.slug}
                href={`/university/${u.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all"
              >
                {u.shortName}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD — controlled data from universities.ts + deals, safe for inline script.
          The .replace(/</g, "\\u003c") escapes closing script tags to prevent XSS. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Free Tools for ${uni.shortName} Students`,
            numberOfItems: studentDeals.length,
            itemListElement: studentDeals.slice(0, 10).map((deal, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: deal.name,
              url: `https://www.studentperks.dev/deals/${deal.slug}`,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
