import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDealBySlug, CATEGORY_CONFIG } from "@/lib/deals";
import { GUIDE_SEO } from "@/data/seo-content";

export const revalidate = 300;

export function generateStaticParams() {
  return GUIDE_SEO.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_SEO.find((g) => g.slug === slug);
  if (!guide) return { title: "Not Found" };
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `https://www.studentperks.dev/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDE_SEO.find((g) => g.slug === slug);
  if (!guide) notFound();

  const deal = await getDealBySlug(guide.dealSlug);
  if (!deal) notFound();

  const config = CATEGORY_CONFIG[deal.category];

  // JSON-LD — all content is controlled/hardcoded, safe for inline script
  const howToLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.heading,
    description: guide.intro,
    step: deal.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  }).replace(/</g, "\\u003c");

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.studentperks.dev/guides" },
      { "@type": "ListItem", position: 3, name: guide.heading },
    ],
  }).replace(/</g, "\\u003c");

  const faqLd = guide.faqs.length > 0
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }).replace(/</g, "\\u003c")
    : null;

  const otherGuides = GUIDE_SEO.filter((g) => g.slug !== slug);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{guide.heading}</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} {deal.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">{guide.heading}</h1>
        <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed">{guide.intro}</p>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-zinc-100 mb-3">Eligibility</h2>
        <ul className="space-y-2">
          {guide.eligibility.map((item, i) => (
            <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <span className="value-pill">{deal.value}</span>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Step-by-Step Guide</h2>
        <ol className="space-y-4">
          {deal.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-300 pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Link
        href={`/deals/${deal.slug}`}
        className="btn-primary inline-flex items-center gap-2"
      >
        View Full Deal Details &rarr;
      </Link>

      {guide.faqs.length > 0 && (
        <section className="mt-16 mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">FAQ</h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, i) => (
              <div key={i} className="card p-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{faq.question}</h3>
                <p className="text-sm text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {otherGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">More Guides</h2>
          <div className="flex flex-wrap gap-2">
            {otherGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
              >
                {g.heading}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD — controlled data, safe for inline script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: howToLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />}
    </main>
  );
}
