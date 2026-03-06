import { Suspense } from "react";
import { Metadata } from "next";
import { getDeals } from "@/lib/deals";
import DealsGrid from "@/components/DealsGrid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Deals — EduDeals",
  description: "Browse all free tools and perks for students, startups, and open source projects.",
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
      </div>
      <Suspense fallback={null}>
        <DealsGrid deals={deals} />
      </Suspense>
    </main>
  );
}
