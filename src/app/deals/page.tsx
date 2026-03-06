import { Metadata } from "next";
import { deals } from "@/data/deals";
import DealsGrid from "@/components/DealsGrid";

export const metadata: Metadata = {
  title: "All Deals — EduDeals",
  description: "Browse all free tools and perks for students, startups, and open source projects.",
};

export default function DealsPage() {
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
      <DealsGrid deals={deals} />
    </main>
  );
}
