import Link from "next/link";
import { deals, getFeaturedDeals, CATEGORY_CONFIG, Category } from "@/data/deals";
import DealCard from "@/components/DealCard";

const stats = [
  { label: "Free Deals", value: deals.length + "+" },
  { label: "Categories", value: Object.keys(CATEGORY_CONFIG).length.toString() },
  { label: "Potential Savings", value: "$10,000+" },
];

const audiences = [
  {
    title: "Students",
    description: "Got a .edu email? Unlock free pro plans, credits, and tools from top companies.",
    emoji: "🎓",
    href: "/deals?audience=students",
  },
  {
    title: "Startups",
    description: "Building something? Get cloud credits, free SaaS tools, and accelerator perks.",
    emoji: "🚀",
    href: "/deals?audience=startups",
  },
  {
    title: "Open Source",
    description: "Maintaining OSS? Access free CI/CD, hosting, and developer tools.",
    emoji: "💻",
    href: "/deals?audience=opensource",
  },
];

export default function Home() {
  const featured = getFeaturedDeals();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Free tools for{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              builders
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover {deals.length}+ free perks, tools, and discounts available for students,
            startups, and open source projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="px-8 py-3 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 transition-all"
            >
              Browse All Deals
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 text-base font-semibold text-gray-700 rounded-full border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-3 bg-white rounded-2xl shadow-lg shadow-gray-100 divide-x divide-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center py-6">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Featured{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Deals
            </span>
          </h2>
          <p className="mt-3 text-gray-500">The most popular perks our community loves</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((deal) => (
            <DealCard key={deal.slug} deal={deal} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            View all deals &rarr;
          </Link>
        </div>
      </section>

      {/* Audiences */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Who is this for?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all"
              >
                <div className="text-4xl mb-4">{a.emoji}</div>
                <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{a.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
            ([cat, config]) => (
              <Link
                key={cat}
                href={`/deals?category=${cat}`}
                className={`group flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all`}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
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
