import Link from "next/link";
import { deals, getFeaturedDeals, CATEGORY_CONFIG, Category } from "@/data/deals";
import DealCard from "@/components/DealCard";

const stats = [
  { label: "Free Deals", value: `${deals.length}+`, icon: "🎁" },
  { label: "Categories", value: Object.keys(CATEGORY_CONFIG).length.toString(), icon: "📂" },
  { label: "Total Savings", value: "$10K+", icon: "💰" },
];

const audiences = [
  {
    title: "Students",
    description: "Got a .edu email? Unlock free pro plans, credits, and tools from top companies.",
    icon: "🎓",
    href: "/deals?audience=students",
    accent: "from-blue-500/20 to-blue-500/0",
    border: "hover:border-blue-500/30",
  },
  {
    title: "Startups",
    description: "Building something? Get cloud credits, free SaaS tools, and accelerator perks.",
    icon: "🚀",
    href: "/deals?audience=startups",
    accent: "from-orange-500/20 to-orange-500/0",
    border: "hover:border-orange-500/30",
  },
  {
    title: "Open Source",
    description: "Maintaining OSS? Access free CI/CD, hosting, and developer tools.",
    icon: "💻",
    href: "/deals?audience=opensource",
    accent: "from-emerald-500/20 to-emerald-500/0",
    border: "hover:border-emerald-500/30",
  },
];

export default function Home() {
  const featured = getFeaturedDeals();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/8 via-amber-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40">
          {/* Pill badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {deals.length} deals available — all free
            </div>
          </div>

          <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-white">Free tools</span>
            <br />
            <span className="text-gradient">for builders</span>
          </h1>

          <p className="mt-6 text-center text-lg md:text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Curated perks, credits, and pro plans for students, startups, and open source projects.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/deals"
              className="px-8 py-3.5 text-sm font-semibold text-black rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 text-center"
            >
              Browse All Deals
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 text-sm font-semibold text-zinc-300 rounded-lg border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.03] transition-all duration-200 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-3 bg-[#111113] rounded-xl border border-white/[0.06] divide-x divide-white/[0.06]">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center py-6 px-4">
              <div className="text-2xl md:text-3xl font-extrabold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Featured Deals
            </h2>
            <p className="mt-2 text-zinc-500">The most popular perks our community loves</p>
          </div>
          <Link
            href="/deals"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {featured.map((deal) => (
            <DealCard key={deal.slug} deal={deal} />
          ))}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-400"
          >
            View all deals
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Audiences */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Who is this for?
            </h2>
            <p className="mt-2 text-zinc-500">Find deals curated for your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
            {audiences.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className={`card-glow group bg-[#111113] rounded-xl p-8 border border-white/[0.06] ${a.border} relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${a.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="text-3xl mb-4">{a.icon}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{a.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-600 group-hover:text-orange-400/80 transition-colors">
                    Explore deals
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
            ([cat, config]) => (
              <Link
                key={cat}
                href={`/deals?category=${cat}`}
                className="card-glow group flex items-center gap-3 p-4 rounded-xl bg-[#111113] border border-white/[0.06]"
              >
                <span className="text-xl">{config.icon}</span>
                <span className="font-semibold text-sm text-zinc-300 group-hover:text-orange-400 transition-colors duration-200">
                  {cat}
                </span>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}
