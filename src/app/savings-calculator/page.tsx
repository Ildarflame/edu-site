import { Suspense } from "react";
import { Metadata } from "next";
import { getDeals } from "@/lib/deals";
import SavingsWizard from "./SavingsWizard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Student Savings Calculator 2026 | StudentPerks",
  description:
    "Calculate how much you could save with student discounts and free tools. Select the tools you use and see your total annual savings instantly. Worth $500K+.",
  keywords: ["student savings calculator", "student discount calculator", "how much students save", "free tools savings"],
  alternates: { canonical: "https://www.studentperks.dev/savings-calculator" },
  openGraph: {
    title: "Student Savings Calculator 2026 — See How Much You Save",
    description: "Calculate how much you could save with student discounts and free tools. Select the tools you use and see your total annual savings instantly.",
    url: "https://www.studentperks.dev/savings-calculator",
    images: [{ url: "/api/og?title=Student%20Savings%20Calculator%202026", width: 1200, height: 630 }],
  },
};

export default async function SavingsCalculatorPage() {
  const deals = await getDeals();
  const studentDeals = deals.filter((d) => d.audiences.includes("students"));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Suspense fallback={null}>
        <SavingsWizard deals={studentDeals} />
      </Suspense>

      {/* JSON-LD structured data — all values are controlled editorial content (not user input).
          .replace(/</g, "\\u003c") prevents script-breaking characters per OWASP best practice. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Student Savings Calculator",
            url: "https://www.studentperks.dev/savings-calculator",
            applicationCategory: "FinanceApplication",
            description: "Calculate how much you could save with student discounts.",
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
