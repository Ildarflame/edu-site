import { getDeals } from "@/lib/deals";
import DealFinder from "@/components/DealFinder";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Discover Deals — StudentPerks",
  description:
    "Describe your situation and find the best free tools, credits, and perks matched to your needs.",
  robots: { index: false, follow: true },
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const deals = await getDeals();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-grid" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-8 md:pt-20 md:pb-12">
          <p className="section-label mb-2 text-center">AI-Powered</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-100 text-center tracking-tight">
            Find Your Deals
          </h1>
          <p className="mt-3 text-[15px] text-zinc-500 text-center max-w-lg mx-auto">
            Tell us about yourself and we will match you with the most relevant deals from our collection.
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <DealFinder deals={deals} />
        </section>
      </ScrollReveal>
    </main>
  );
}
