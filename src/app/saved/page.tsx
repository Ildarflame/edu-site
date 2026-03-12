import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getDeals } from "@/lib/deals";
import SavedDealsGrid from "@/components/SavedDealsGrid";

export const metadata: Metadata = {
  title: "Saved Deals | StudentPerks",
  description: "Your saved deals and perks on StudentPerks.",
  robots: { index: false, follow: true },
};

export const revalidate = 300;

export default async function SavedPage() {
  const deals = await getDeals();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">Saved</span>
      </nav>

      <div className="mb-8">
        <p className="section-label mb-2">Your collection</p>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">Saved Deals</h1>
        <p className="mt-1.5 text-[14px] text-zinc-600">
          Deals you&apos;ve bookmarked. Set reminders so you don&apos;t forget to claim them.
        </p>
      </div>

      <Suspense fallback={null}>
        <SavedDealsGrid allDeals={deals} />
      </Suspense>
    </main>
  );
}
