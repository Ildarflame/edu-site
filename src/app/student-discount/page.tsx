import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import type { Category } from "@/data/deals";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Student Discounts 2026 — Free Software & Tools for Students | StudentPerks",
  description:
    "Complete list of student discounts on developer tools, cloud platforms, design software, and more in 2026. Verified deals worth $500K+.",
  alternates: { canonical: "https://studentperks.dev/student-discount" },
  openGraph: {
    title: "Student Discounts 2026 — Free Software & Tools for Students",
    description:
      "Complete list of student discounts on developer tools, cloud platforms, design software, and more in 2026.",
    url: "https://studentperks.dev/student-discount",
  },
};

export default async function StudentDiscountIndex() {
  const deals = await getDeals();
  const studentDeals = deals.filter((d) => d.audiences.includes("students"));

  const grouped = studentDeals.reduce<Record<Category, typeof studentDeals>>((acc, deal) => {
    if (!acc[deal.category]) acc[deal.category] = [];
    acc[deal.category].push(deal);
    return acc;
  }, {} as Record<Category, typeof studentDeals>);

  const categories = Object.keys(grouped) as Category[];

  // Structured data from controlled CMS — not user-generated content
  const itemListLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Student Discounts 2026",
    numberOfItems: studentDeals.length,
    itemListElement: studentDeals.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${deal.name} Student Discount`,
      url: `https://studentperks.dev/student-discount/${deal.slug}`,
    })),
  }).replace(/</g, "\\u003c");

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Student Discounts" },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Student Discounts</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
          Student Discounts 2026
        </h1>
        <p className="text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          {studentDeals.length} verified student discounts on developer tools, cloud platforms,
          design software, learning resources, and more. All free or heavily discounted for
          students with a valid .edu email.
        </p>
      </div>

      {categories.map((cat) => {
        const config = CATEGORY_CONFIG[cat];
        const catDeals = grouped[cat];
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <span>{config.icon}</span>
              {cat} Student Discounts
              <span className="text-xs text-zinc-600 font-normal">({catDeals.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
              {catDeals.map((deal) => (
                <Link
                  key={deal.slug}
                  href={`/student-discount/${deal.slug}`}
                  className={`card card-accent-${config.color} p-4 group`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                      <Image
                        src={deal.logo}
                        alt={deal.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                      {deal.name}
                    </span>
                    {deal.featured && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-orange-400/60">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{deal.tagline}</p>
                  <span className="value-pill text-xs">{deal.value}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-16 card p-6">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">How Student Discounts Work</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <div>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold mb-2">1</div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Verify Student Status</h3>
            <p className="text-xs text-zinc-500">Use your .edu email, student ID, or services like SheerID and UNiDAYS to prove enrollment.</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold mb-2">2</div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Claim Your Discount</h3>
            <p className="text-xs text-zinc-500">Follow the steps on each deal page to activate your free or discounted access.</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold mb-2">3</div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Renew Annually</h3>
            <p className="text-xs text-zinc-500">Most student discounts last 1 year and can be renewed while you&apos;re enrolled.</p>
          </div>
        </div>
      </section>

      {/* Structured data rendered from controlled CMS content (Notion database) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
