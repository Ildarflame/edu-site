import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About StudentPerks — Free Tools for Students & Startups",
  description: "StudentPerks is a curated directory of free tools, cloud credits, and pro plans for students, startups, and open source projects.",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <p className="section-label mb-2">About</p>
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-6">
        What is <span className="text-gradient-warm">StudentPerks</span>?
      </h1>

      <div className="space-y-5 text-[14px] text-zinc-500 leading-relaxed">
        <p className="text-[16px]">
          A curated directory of free tools, services, and perks for students, startups, and open source projects.
        </p>

        <div className="card p-6">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">Mission</h2>
          <p>
            Companies offer amazing free plans for students, startups, and OSS maintainers — but these offers are scattered across hundreds of sites. We bring them together.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">Suggest a deal</h2>
          <p>
            Know a service with free perks? Open an issue on our{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">
              GitHub
            </a>{" "}
            or reach out directly.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/deals" className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-[14px]">
          Browse deals
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
