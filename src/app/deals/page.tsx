import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getDeals } from "@/lib/deals";
import DealsGridWithOnboarding from "@/components/DealsGridWithOnboarding";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "150+ Free Tools for Students & Startups — Verified Deals 2026",
  description: "Browse 150+ free developer tools, cloud credits & pro plans. Filter by category, audience & region. Every deal verified with step-by-step instructions.",
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
      {/* FAQ structured data — all content is hardcoded editorial, not user input */}
      {(() => {
        const faqLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are these deals really free for students?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every deal is verified by our team. Most require a .edu email or student ID for verification. Some tools are completely free, others offer generous credits or pro plans at no cost during your studies.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need a .edu email to claim deals?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most deals accept .edu emails, but many also work with other verification methods: SheerID, UNiDAYS, GitHub Student Developer Pack, or a valid student ID. Check each deal's requirements for details.",
              },
            },
            {
              "@type": "Question",
              name: "How often are deals updated?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We verify all deals weekly and update pricing, terms, and availability. Expired deals are marked and new deals are added regularly. The page refreshes every 5 minutes with the latest data.",
              },
            },
          ],
        }).replace(/</g, "\\u003c");
        // Safe: hardcoded editorial content, no user input
        return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />;
      })()}
    </main>
  );
}
