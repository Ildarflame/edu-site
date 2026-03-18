import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeals, getDealsByCategory, CATEGORY_CONFIG } from "@/lib/deals";
import { GUIDE_SEO, ALTERNATIVES_SEO } from "@/data/seo-content";

export const revalidate = 300;

export async function generateStaticParams() {
  const deals = await getDeals();
  return deals
    .filter((d) => d.audiences.includes("students"))
    .map((d) => ({ tool: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const deals = await getDeals();
  const deal = deals.find((d) => d.slug === tool && d.audiences.includes("students"));
  if (!deal) return { title: "Not Found" };

  const title = `${deal.name} Student Discount 2026 — ${deal.value}`;
  const description = `Claim ${deal.name} free as a student in 2026. ${deal.tagline}. Verified deal with step-by-step claim guide.`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.studentperks.dev/student-discount/${tool}` },
    openGraph: {
      title,
      description,
      url: `https://www.studentperks.dev/student-discount/${tool}`,
      type: "article",
    },
  };
}

export default async function StudentDiscountPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const deals = await getDeals();
  const deal = deals.find((d) => d.slug === tool && d.audiences.includes("students"));
  if (!deal) notFound();

  const config = CATEGORY_CONFIG[deal.category];
  const categoryDeals = (await getDealsByCategory(deal.category))
    .filter((d) => d.slug !== deal.slug && d.audiences.includes("students"))
    .slice(0, 3);

  const guide = GUIDE_SEO.find((g) => g.dealSlug === deal.slug);
  const alternative = ALTERNATIVES_SEO.find((a) =>
    deal.name.toLowerCase().includes(a.name.toLowerCase())
  );

  const faqs = [
    {
      question: `Is ${deal.name} really free for students?`,
      answer: `Yes — ${deal.tagline.toLowerCase()}. The deal is worth ${deal.value}. You need to verify your student status to claim it.`,
    },
    {
      question: `How do I verify my student status for ${deal.name}?`,
      answer: deal.steps.length > 0
        ? `Follow these steps: ${deal.steps.join(". ")}.`
        : `Visit the official ${deal.name} education page and verify with your .edu email or student ID.`,
    },
    {
      question: `How long does the ${deal.name} student discount last?`,
      answer: `Most student discounts are valid for 1 year and can be renewed while you're enrolled. Check ${deal.name}'s terms for specific duration.`,
    },
  ];

  // JSON-LD structured data — all values come from our controlled Notion CMS
  // deal data (not user input), so this is safe for inline rendering
  const faqLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }).replace(/</g, "\\u003c");

  const howToLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to get ${deal.name} student discount`,
    description: deal.description,
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
      { "@type": "ListItem", position: 2, name: "Student Discounts", item: "https://www.studentperks.dev/student-discount" },
      { "@type": "ListItem", position: 3, name: `${deal.name} Student Discount` },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href="/student-discount" className="hover:text-orange-400 transition-colors">Student Discounts</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{deal.name}</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-2">{config.icon} {deal.category} — Student Discount</p>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden">
            <Image
              src={deal.logo}
              alt={deal.name}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
              {deal.name} Student Discount 2026
            </h1>
          </div>
        </div>
        <p className="text-[15px] text-zinc-500 leading-relaxed">{deal.description}</p>
      </div>

      <div className="mb-8">
        <span className="value-pill">{deal.value}</span>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">How to Claim Your Student Discount</h2>
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

      <div className="flex gap-3 mb-12">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Get {deal.name} Student Discount &rarr;
        </a>
        <Link
          href={`/deals/${deal.slug}`}
          className="btn-ghost inline-flex items-center gap-2"
        >
          View Full Details
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-4">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{faq.question}</h3>
              <p className="text-sm text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {categoryDeals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">
            More {deal.category} Student Discounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categoryDeals.map((d) => (
              <Link key={d.slug} href={`/student-discount/${d.slug}`} className="card p-4 group">
                <div className="flex items-center gap-3 mb-2">
                  <Image src={d.logo} alt={d.name} width={24} height={24} className="object-contain" />
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                    {d.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">{d.tagline}</p>
                <span className="value-pill mt-2 text-xs">{d.value}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {guide && (
          <Link
            href={`/guides/${guide.slug}`}
            className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
          >
            Step-by-Step Guide &rarr;
          </Link>
        )}
        {alternative && (
          <Link
            href={`/alternatives/${alternative.slug}`}
            className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
          >
            Free Alternatives &rarr;
          </Link>
        )}
        <Link
          href="/student-discount"
          className="inline-flex items-center px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 transition-all"
        >
          All Student Discounts &rarr;
        </Link>
      </div>

      {/* JSON-LD structured data — sourced from controlled Notion CMS, not user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: howToLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
    </main>
  );
}
