import { Suspense } from "react";
import { Metadata } from "next";
import { getDeals } from "@/lib/deals";
import FinderWizard from "./FinderWizard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Student Freebies Finder — Personalized Free Tools for Your Major | StudentPerks",
  description:
    "Enter your country, university, and major to discover all free tools, credits, and discounts available to you as a student in 2026.",
  keywords: [
    "student freebies finder",
    "free tools for students",
    "student discounts by major",
    "free software for college students",
    "student deals finder",
  ],
  alternates: { canonical: "https://studentperks.dev/student-freebies-finder" },
  openGraph: {
    title: "Student Freebies Finder — What Free Tools Can You Get?",
    description:
      "Personalized tool that finds all free software, credits, and discounts based on your country, university, and major.",
    url: "https://studentperks.dev/student-freebies-finder",
  },
};

export default async function StudentFreebiesFinderPage() {
  const deals = await getDeals();
  const studentDeals = deals.filter((d) => d.audiences.includes("students"));

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Suspense>
        <FinderWizard deals={studentDeals} />
      </Suspense>
    </main>
  );
}
