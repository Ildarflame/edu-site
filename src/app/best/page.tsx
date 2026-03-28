import { Metadata } from "next";
import Link from "next/link";
import { USE_CASE_SEO } from "@/data/seo-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Best Free Tools by Use Case 2026 | StudentPerks",
  description:
    "Curated lists of the best free tools for web development, hackathons, startups, portfolios, and more. Every tool is verified free for students.",
  alternates: { canonical: "https://www.studentperks.dev/best" },
};

export default function BestIndexPage() {
  // JSON-LD — all content is controlled/hardcoded, not user input — safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Best Free Tools" },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Best Free Tools</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Best Free Tools by Use Case
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          Curated lists of the best free tools for every use case — from web development and hackathons
          to building your MVP and portfolio. Every tool verified free for students, startups, or open source.
        </p>
        <p className="mt-2 text-[13px] text-zinc-600">{USE_CASE_SEO.length} curated lists</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
        {USE_CASE_SEO.map((uc) => (
          <Link
            key={uc.slug}
            href={`/best/${uc.slug}`}
            className="card p-5 group"
          >
            <h2 className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors mb-1">
              {uc.heading}
            </h2>
            <p className="text-[13px] text-zinc-500 line-clamp-2">{uc.intro}</p>
          </Link>
        ))}
      </div>

      {/* JSON-LD — controlled CMS data, not user input — safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
