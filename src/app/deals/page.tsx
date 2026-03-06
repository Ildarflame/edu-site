import { Metadata } from "next";
import { deals } from "@/data/deals";
import DealsGrid from "@/components/DealsGrid";

export const metadata: Metadata = {
  title: "All Deals — EduDeals",
  description: "Browse all free tools and perks for students, startups, and open source projects.",
};

export default function DealsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          All Deals
        </h1>
        <p className="mt-2 text-zinc-500">
          Find the perfect perk for your project
        </p>
      </div>
      <DealsGrid deals={deals} />
    </main>
  );
}
