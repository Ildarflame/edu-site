import { Metadata } from "next";
import Link from "next/link";
import { ALTERNATIVES_SEO } from "@/data/seo-content";

export const metadata: Metadata = {
  title: "Free Alternatives to Popular Software 2026 | StudentPerks",
  description:
    "Free alternatives to AWS, Adobe, Spotify, and more. Student-friendly tools that replace expensive software at zero cost.",
  alternates: { canonical: "https://www.studentperks.dev/alternatives" },
};

export default function AlternativesIndexPage() {
  // JSON-LD — all content is controlled/hardcoded, not user input — safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Free Alternatives" },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Free Alternatives</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Free Alternatives to Popular Software
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          Can&apos;t afford the premium version? These free alternatives and student deals give you
          the same capabilities at zero cost.
        </p>
        <p className="mt-2 text-[13px] text-zinc-600">{ALTERNATIVES_SEO.length} alternatives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
        {ALTERNATIVES_SEO.map((alt) => (
          <Link
            key={alt.slug}
            href={`/alternatives/${alt.slug}`}
            className="card p-5 group"
          >
            <h2 className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors mb-1">
              Free {alt.name} Alternatives
            </h2>
            <p className="text-[13px] text-zinc-500 line-clamp-2">{alt.intro}</p>
          </Link>
        ))}
      </div>

      {/* JSON-LD — controlled CMS data, not user input — safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
