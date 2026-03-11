import { getDeals } from "@/lib/deals";
import StackBuilder from "@/components/StackBuilder";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Build Your Stack — StudentPerks",
  description:
    "Select your tech stack and discover all the free tools, credits, and student perks available for your technologies. Build smarter, spend nothing.",
  robots: { index: false, follow: true },
};

export const revalidate = 300;

export default async function StackPage() {
  const deals = await getDeals();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-grid" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-8 md:pt-20 md:pb-12">
          <p className="section-label mb-2 text-center">Interactive</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-100 text-center tracking-tight">
            Build Your Stack
          </h1>
          <p className="mt-3 text-[15px] text-zinc-500 text-center max-w-lg mx-auto">
            Select the technologies you use and we will show you every deal that fits your stack.
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <StackBuilder deals={deals} />
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
              { "@type": "ListItem", position: 2, name: "Stack Builder" },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
