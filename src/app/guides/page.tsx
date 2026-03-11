import { Metadata } from "next";
import Link from "next/link";
import { GUIDE_SEO } from "@/data/seo-content";

export const metadata: Metadata = {
  title: "How to Get Free Developer Tools — Step-by-Step Guides | StudentPerks",
  description:
    "Step-by-step guides to claim free developer tools. JetBrains, GitHub Copilot, AWS credits, Figma, and 20+ more — with eligibility details and FAQs.",
  alternates: { canonical: "https://www.studentperks.dev/guides" },
};

export default function GuidesIndexPage() {
  // JSON-LD — all content is controlled/hardcoded, not user input — safe for inline script
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Guides" },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Claim Guides</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          How to Claim Free Developer Tools
        </h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed max-w-2xl">
          Step-by-step guides for claiming every free deal. Eligibility requirements,
          verification steps, and FAQs included for each tool.
        </p>
        <p className="mt-2 text-[13px] text-zinc-600">{GUIDE_SEO.length} guides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
        {GUIDE_SEO.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="card p-5 group"
          >
            <h2 className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors mb-1">
              {guide.heading}
            </h2>
            <p className="text-[13px] text-zinc-500 line-clamp-2">{guide.intro}</p>
          </Link>
        ))}
      </div>

      {/* JSON-LD — controlled CMS data, not user input — safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
