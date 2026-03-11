/**
 * JSON-LD structured data for the free-tools-for-students page.
 * All data originates from our controlled Notion CMS database —
 * no user-generated content is rendered here.
 */

import type { Deal } from "@/data/deals";

type FAQ = { question: string; answer: string };

function safeStringify(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export default function JsonLd({
  studentDeals,
  faqs,
}: {
  studentDeals: Deal[];
  faqs: FAQ[];
}) {
  const itemList = safeStringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "100+ Free Tools for Students (2026 Edition)",
    description: "The ultimate list of free software and tools for students.",
    numberOfItems: studentDeals.length,
    itemListElement: studentDeals.map((deal, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: deal.name,
      url: `https://www.studentperks.dev/deals/${deal.slug}`,
    })),
  });

  const faqPage = safeStringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });

  const breadcrumbs = safeStringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
      { "@type": "ListItem", position: 2, name: "Free Tools for Students" },
    ],
  });

  // Rendered as script tags with type=application/ld+json for search engines.
  // Content is derived from hardcoded SEO data and Notion CMS deal records.
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemList }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPage }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
    </>
  );
}
