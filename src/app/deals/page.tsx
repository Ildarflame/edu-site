import { Metadata } from "next";
import { deals } from "@/data/deals";
import DealsGrid from "@/components/DealsGrid";

export const metadata: Metadata = {
  title: "All Deals — EduDeals",
  description: "Browse all free tools and perks for students, startups, and open source projects.",
};

export default function DealsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          All{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Deals
          </span>
        </h1>
        <p className="mt-2 text-gray-500">
          Find the perfect perk for your project
        </p>
      </div>
      <DealsGrid deals={deals} />
    </main>
  );
}
