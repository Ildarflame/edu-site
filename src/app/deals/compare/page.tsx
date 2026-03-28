import { Suspense } from "react";
import { Metadata } from "next";
import { getDeals } from "@/lib/deals";
import CompareView from "./CompareView";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Compare Deals — StudentPerks",
  description: "Compare student and startup deals side by side. See features, value, and eligibility for up to 3 tools at once on StudentPerks.",
  alternates: { canonical: "https://www.studentperks.dev/deals/compare" },
};

export default async function ComparePage() {
  const deals = await getDeals();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="section-label mb-2">Compare</p>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
          Compare Deals
        </h1>
      </div>
      <Suspense fallback={null}>
        <CompareView allDeals={deals} />
      </Suspense>
    </main>
  );
}
