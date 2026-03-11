import { Metadata } from "next";
import Link from "next/link";
import { VS_SEO } from "@/data/seo-content";

export const metadata: Metadata = {
  title: "Student Tool Comparisons 2026 — Side-by-Side | StudentPerks",
  description:
    "Compare popular developer tools side by side. Figma vs Canva, GitHub vs GitLab, AWS vs Azure, and more — with student pricing and free tier details.",
  alternates: { canonical: "https://www.studentperks.dev/vs" },
};

export default function VsIndexPage() {
  // JSON-LD — all content is controlled/hardcoded, not user input — safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Comparisons" },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Tool Comparisons</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Student Tool Comparisons
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          Compare popular developer tools side by side. Every comparison includes student pricing,
          free tier details, and our recommendation for students.
        </p>
        <p className="mt-2 text-[13px] text-zinc-600">{VS_SEO.length} comparisons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
        {VS_SEO.map((vs) => (
          <Link
            key={vs.slug}
            href={`/vs/${vs.slug}`}
            className="card p-5 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                {vs.tool1}
              </span>
              <span className="text-[12px] text-zinc-600 font-medium">vs</span>
              <span className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                {vs.tool2}
              </span>
            </div>
            <p className="text-[13px] text-zinc-500 line-clamp-2">{vs.intro}</p>
          </Link>
        ))}
      </div>

      {/* JSON-LD — controlled CMS data, not user input — safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
