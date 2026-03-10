import { Metadata } from "next";
import { getDeals } from "@/lib/deals";
import SavingsWizard from "./SavingsWizard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Student Savings Calculator — How Much Are You Leaving on the Table? | StudentPerks",
  description:
    "Calculate how much you could save with student discounts. Select the tools you use and see your total savings instantly.",
  keywords: ["student savings calculator", "student discount calculator", "how much students save", "free tools savings"],
  alternates: { canonical: "https://studentperks.dev/savings-calculator" },
};

export default async function SavingsCalculatorPage() {
  const deals = await getDeals();
  const studentDeals = deals.filter((d) => d.audiences.includes("students"));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <SavingsWizard deals={studentDeals} />
    </main>
  );
}
