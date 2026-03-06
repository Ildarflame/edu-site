import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About StudentPerks — Free Developer Tools for Students & Startups 2026",
  description: "Save $500K+ on developer tools, cloud credits, and pro plans. StudentPerks helps students, startups, and OSS projects claim free perks in 2026.",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <p className="section-label mb-2">About</p>
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-6">
        What is <span className="text-gradient-warm">StudentPerks</span>?
      </h1>

      <div className="space-y-5 text-[14px] text-zinc-500 leading-relaxed">
        <p className="text-[16px] text-zinc-400">
          Thousands of dollars in free tools, credits, and pro plans exist for students, startups, and open source maintainers — but finding them takes hours. We did the work for you.
        </p>

        <div className="card p-6">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">Why StudentPerks?</h2>
          <p>
            Every deal is verified, with step-by-step instructions so you can claim it in minutes. No guesswork, no dead links — just free stuff you actually qualify for.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card p-5">
            <p className="text-2xl font-bold text-orange-400">150+</p>
            <p className="text-[12px] text-zinc-600 mt-1">Verified deals</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl font-bold text-orange-400">$500K+</p>
            <p className="text-[12px] text-zinc-600 mt-1">Total value</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl font-bold text-orange-400">7</p>
            <p className="text-[12px] text-zinc-600 mt-1">Categories</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">Who is it for?</h2>
          <ul className="space-y-2">
            <li><span className="text-zinc-300 font-medium">Students</span> — get pro tools free with your .edu email</li>
            <li><span className="text-zinc-300 font-medium">Startups</span> — claim cloud credits and SaaS plans to ship faster</li>
            <li><span className="text-zinc-300 font-medium">Open Source</span> — access free infrastructure and developer tools</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">Suggest a deal</h2>
          <p>
            Know a perk we&apos;re missing?{" "}
            <Link href="/submit" className="text-orange-400 hover:text-orange-300 transition-colors">
              Submit it here
            </Link>{" "}
            and we&apos;ll add it to the directory.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/deals" className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-[14px]">
          Claim Your Free Tools
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
