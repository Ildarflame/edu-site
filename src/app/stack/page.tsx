import { Suspense } from "react";
import { getDeals } from "@/lib/deals";
import StackBuilder from "@/components/StackBuilder";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Stack Builder — Find Free Tools for Your Tech Stack | StudentPerks",
  description:
    "Select React, Node, Python or any tech — see every free tool, credit & student perk available for your stack. Build smarter, spend nothing.",
  keywords: ["tech stack builder", "free developer tools", "student stack", "technology deals"],
  alternates: { canonical: "https://www.studentperks.dev/stack" },
  openGraph: {
    title: "Stack Builder — Find Free Tools for Your Tech Stack",
    description: "Select your technologies and see every free tool, credit & student perk available for your stack.",
    url: "https://www.studentperks.dev/stack",
    images: [{ url: "/api/og?title=Stack%20Builder%20%E2%80%94%20StudentPerks", width: 1200, height: 630 }],
  },
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
          <Suspense fallback={null}>
            <StackBuilder deals={deals} />
          </Suspense>
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
