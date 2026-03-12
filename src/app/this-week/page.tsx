import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDeals, CATEGORY_CONFIG } from "@/lib/deals";
import WeeklySignupForm from "@/components/WeeklySignupForm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "New & Updated Deals This Week | StudentPerks",
  description: "The latest free tools and student deals added or updated this week. Fresh finds for students, startups, and open source. Bookmark for weekly check-ins.",
  alternates: { canonical: "https://www.studentperks.dev/this-week" },
};

export default async function ThisWeekPage() {
  const deals = await getDeals();
  // eslint-disable-next-line react-hooks/purity -- server component, no re-renders
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const oneMonth = 30 * 24 * 60 * 60 * 1000;

  const recentDeals = deals
    .filter((d) => d.updatedAt && (now - new Date(d.updatedAt).getTime()) < oneWeek)
    .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());

  const monthDeals = deals
    .filter((d) => d.updatedAt && (now - new Date(d.updatedAt).getTime()) >= oneWeek && (now - new Date(d.updatedAt).getTime()) < oneMonth)
    .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
    .slice(0, 12);

  const featuredDeals = deals.filter((d) => d.featured).slice(0, 6);

  const weekLabel = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">This Week</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-2">Week of {weekLabel}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
          New & Updated Deals
        </h1>
        <p className="text-[15px] text-zinc-500">
          Fresh deals and updates from the past week. Bookmark this page for weekly check-ins.
        </p>
      </div>

      {/* Weekly digest signup */}
      <div className="mb-10 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[13px] font-semibold text-zinc-200 mb-1">Get new deals every week</p>
            <p className="text-[12px] text-zinc-600">
              We&apos;ll send you the freshest deals straight to your inbox. No spam.
            </p>
          </div>
          <WeeklySignupForm />
        </div>
      </div>

      {recentDeals.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">
            Updated This Week
            <span className="text-xs text-zinc-600 font-normal ml-2">({recentDeals.length})</span>
          </h2>
          <div className="space-y-2">
            {recentDeals.map((deal) => {
              const config = CATEGORY_CONFIG[deal.category];
              const updated = new Date(deal.updatedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <Link
                  key={deal.slug}
                  href={`/deals/${deal.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={deal.logo} alt={deal.name} width={24} height={24} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">{deal.name}</span>
                      <span className="text-[10px] text-zinc-700">{config.icon}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 truncate">{deal.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="value-pill text-xs">{deal.value}</span>
                    <p className="text-[10px] text-zinc-700 mt-1">{updated}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="card p-8 text-center mb-12">
          <p className="text-zinc-500 text-[15px] mb-1">No new updates this week</p>
          <p className="text-[13px] text-zinc-700">Check back soon — we verify and update deals regularly.</p>
        </div>
      )}

      {monthDeals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">Recently Updated</h2>
          <div className="space-y-2">
            {monthDeals.map((deal) => {
              const config = CATEGORY_CONFIG[deal.category];
              return (
                <Link
                  key={deal.slug}
                  href={`/deals/${deal.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={deal.logo} alt={deal.name} width={20} height={20} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">{deal.name}</span>
                    <span className="text-[10px] text-zinc-700 ml-1.5">{config.icon}</span>
                  </div>
                  <span className="value-pill text-xs shrink-0">{deal.value}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-bold text-zinc-100 mb-4">Popular Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {featuredDeals.map((deal) => (
            <Link
              key={deal.slug}
              href={`/deals/${deal.slug}`}
              className="card p-4 group"
            >
              <div className="flex items-center gap-3 mb-1">
                <Image src={deal.logo} alt={deal.name} width={24} height={24} className="object-contain" />
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">{deal.name}</span>
              </div>
              <p className="text-xs text-zinc-500">{deal.tagline}</p>
              <span className="value-pill text-xs mt-2">{deal.value}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/deals" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
          All Deals →
        </Link>
        <Link href="/free-tools-for-students" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
          100+ Free Tools →
        </Link>
        <Link href="/submit" className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all">
          Submit a Deal →
        </Link>
      </div>

      {/*
        JSON-LD structured data for SEO. All values are hardcoded editorial content,
        not user-generated. The .replace() call escapes < to \\u003c to prevent any
        possibility of breaking out of the script tag (OWASP recommendation).
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "New & Updated Deals This Week",
            url: "https://www.studentperks.dev/this-week",
            description: "The latest free tools and student deals added or updated this week.",
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
