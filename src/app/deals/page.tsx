import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getDeals } from "@/lib/deals";
import DealsGridWithOnboarding from "@/components/DealsGridWithOnboarding";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Deals — Free Tools 2026 | StudentPerks",
  description: "Get 150+ verified free developer tools, cloud credits, and pro plans for students and startups. Claim deals worth $500K+ in 2026.",
  alternates: { canonical: "https://www.studentperks.dev/deals" },
};

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="section-label mb-2">Browse</p>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
          All Deals
        </h1>
        <p className="mt-1.5 text-[14px] text-zinc-600">
          {deals.length} free tools and perks
        </p>
        <p className="mt-3 text-[14px] text-zinc-500 leading-relaxed max-w-2xl">
          Browse our complete collection of free developer tools, cloud credits, and pro plans for students, startups, and open source projects. Every deal is verified with step-by-step claim instructions.
        </p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span />
        <Link href="/saved" className="text-[12px] text-zinc-600 hover:text-orange-400 transition-colors">
          Saved deals →
        </Link>
      </div>
      <Suspense fallback={null}>
        <DealsGridWithOnboarding deals={deals} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "All Deals",
            description: "Browse all free tools and perks for students, startups, and open source projects.",
            url: "https://www.studentperks.dev/deals",
            numberOfItems: deals.length,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
