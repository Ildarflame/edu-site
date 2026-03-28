import { getDeals } from "@/lib/deals";
import DealFinder from "@/components/DealFinder";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "AI Deal Finder — Match Free Tools to Your Project | StudentPerks",
  description:
    "Describe what you're building and get personalized recommendations from 150+ free student tools, credits & perks. AI-powered matching in seconds.",
  keywords: ["ai deal finder", "student tools finder", "free developer tools", "personalized recommendations"],
  alternates: { canonical: "https://www.studentperks.dev/discover" },
  openGraph: {
    title: "AI Deal Finder — Match Free Tools to Your Project",
    description: "Describe what you're building and get personalized recommendations from 150+ free student tools & credits.",
    url: "https://www.studentperks.dev/discover",
    images: [{ url: "/api/og?title=AI%20Deal%20Finder%20%E2%80%94%20StudentPerks", width: 1200, height: 630 }],
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
              { "@type": "ListItem", position: 2, name: "Discover" },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
