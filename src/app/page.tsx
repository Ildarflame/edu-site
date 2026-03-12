import Link from "next/link";
import { getDeals, CATEGORY_CONFIG, type Category } from "@/lib/deals";
import DealCard from "@/components/DealCard";
import RotatingWord from "@/components/RotatingWord";
import CursorGlow from "@/components/CursorGlow";
import AnimatedCounter from "@/components/AnimatedCounter";
import LogoMarquee from "@/components/LogoMarquee";
import ScrollReveal from "@/components/ScrollReveal";
import NewsletterForm from "@/components/NewsletterForm";
import RecommendedDeals from "@/components/RecommendedDeals";
import OnboardingWidget from "@/components/OnboardingWidget";

export const revalidate = 300; // revalidate every 5 min

export default async function Home() {
  const deals = await getDeals();
  const featured = deals.filter((d) => d.featured);

  const homeFaqs = [
    { q: "What is StudentPerks?", a: "StudentPerks is a curated directory of 150+ free tools, cloud credits, and pro plans for students, startups, and open source projects. Every deal is verified and worth over $500K combined." },
    { q: "How do I claim a free deal?", a: "Click any deal to see step-by-step claiming instructions. Most require verification with a .edu email, startup details, or an active open source project." },
    { q: "Are these deals really free?", a: "Yes. All listed deals are either completely free, offer free credits, or provide significant student/startup discounts through official programs from the companies themselves." },
    { q: "Do I need a .edu email?", a: "Many student deals require a .edu email for verification. However, startups and open source deals typically use different verification methods. Check each deal for specific requirements." },
    { q: "How often are deals updated?", a: "We verify and update deals regularly. Pages refresh every 5 minutes from our database. Subscribe to our newsletter to get notified about new deals." },
  ];

  const audiences = [
    {
      title: "Students",
      desc: "Free pro plans with your .edu email",
      icon: "🎓",
      href: "/for/students",
      count: deals.filter(d => d.audiences.includes("students")).length,
      color: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderHover: "hover:border-blue-500/20",
    },
    {
      title: "Startups",
      desc: "Cloud credits & SaaS tools",
      icon: "🚀",
      href: "/for/startups",
      count: deals.filter(d => d.audiences.includes("startups")).length,
      color: "from-orange-500/20 via-orange-500/5 to-transparent",
      borderHover: "hover:border-orange-500/20",
    },
    {
      title: "Open Source",
      desc: "Free CI/CD, hosting & dev tools",
      icon: "💻",
      href: "/for/opensource",
      count: deals.filter(d => d.audiences.includes("opensource")).length,
      color: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderHover: "hover:border-emerald-500/20",
    },
  ];

  return (
    <main>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-grid" />
        <CursorGlow />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          {/* Status pill */}
          <div className="flex justify-center mb-8 animate-in">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {deals.length} deals updated this week
            </div>
          </div>

          {/* Heading */}
          <div className="text-center animate-in delay-1">
            <h1 className="text-5xl sm:text-6xl md:text-[80px] lg:text-[96px] font-extrabold tracking-[-0.03em] leading-[0.9]">
              <span className="text-zinc-100">Free tools</span>
              <br />
              <span className="text-zinc-100">for </span>
              <RotatingWord />
              <noscript><span className="text-orange-500">developers.</span></noscript>
            </h1>
          </div>

          {/* Subheading */}
          <p className="mt-5 text-center text-[17px] md:text-lg text-zinc-500 max-w-md mx-auto leading-relaxed animate-in delay-2">
            {deals.length}+ verified deals worth $500K+ in software — free for students, startups, and open source.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex gap-3 justify-center animate-in delay-3">
            <Link href="/deals" className="btn-primary px-7 py-2.5 text-[14px]">
              Claim Your Free Tools
            </Link>
            <Link href="/about" className="btn-ghost px-7 py-2.5 text-[14px]">
              How it works
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-4 text-center text-[12px] text-zinc-700 animate-in delay-4">
            Joined by 2,400+ developers, students & founders
          </p>

          {/* Onboarding widget — shows only on first visit, hidden after completion */}
          <OnboardingWidget />

          {/* Quick audience pills */}
          <div className="mt-12 flex flex-wrap gap-2 justify-center animate-in delay-4">
            {audiences.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[13px] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-200"
              >
                <span>{a.icon}</span>
                <span className="font-medium">{a.title}</span>
                <span className="text-zinc-600">{a.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOGO MARQUEE ═══ */}
      <LogoMarquee />

      {/* ═══ FEATURED — BENTO GRID ═══ */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-2">Curated picks</p>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
              Featured Deals
            </h2>
          </div>
          <Link
            href="/deals"
            className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 hover:text-orange-400 transition-colors"
          >
            View all
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Bento layout: first 2 large, rest normal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-grid">
          {featured.slice(0, 1).map((deal) => (
            <div key={deal.slug} className="md:col-span-2 lg:col-span-2">
              <DealCard deal={deal} featured />
            </div>
          ))}
          {featured.slice(1, 2).map((deal) => (
            <DealCard key={deal.slug} deal={deal} featured />
          ))}
          {featured.slice(2).map((deal) => (
            <DealCard key={deal.slug} deal={deal} />
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <Link href="/deals" className="text-[13px] font-medium text-orange-400">
            View all deals &rarr;
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ RECOMMENDED ═══ */}
      <RecommendedDeals deals={deals} />

      {/* Divider */}
      <div className="line-fade mx-auto max-w-5xl" />

      {/* ═══ AUDIENCES ═══ */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="section-label mb-2 text-center">For you</p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 text-center mb-10">
          Find your deals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 stagger-grid">
          {audiences.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className={`card ${a.borderHover} group p-6 relative overflow-hidden`}
            >
              {/* Color wash on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-[11px] font-semibold text-zinc-600 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md">
                    {a.count} deals
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-zinc-600 leading-relaxed">{a.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[12px] font-medium text-zinc-700 group-hover:text-orange-400 transition-colors">
                  Explore
                  <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* Divider */}
      <div className="line-fade mx-auto max-w-5xl" />

      {/* ═══ CATEGORIES ═══ */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="section-label mb-2 text-center">Explore</p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 text-center mb-10">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 stagger-grid max-w-4xl mx-auto">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(
            ([cat, config]) => {
              const count = deals.filter(d => d.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="card group flex items-center gap-3 px-4 py-3.5"
                >
                  <span className="text-lg">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-zinc-300 group-hover:text-orange-400 transition-colors">
                      {cat}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-700 font-medium">{count}</span>
                </Link>
              );
            }
          )}
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ DISCOVER MORE ═══ */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="section-label mb-2 text-center">Discover more</p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 text-center mb-8">
          Explore our resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { href: "/vs", title: "Comparisons", desc: "Side-by-side tool comparisons" },
            { href: "/best", title: "Best Tools", desc: "Curated lists by use case" },
            { href: "/guides", title: "Claim Guides", desc: "Step-by-step instructions" },
            { href: "/alternatives", title: "Alternatives", desc: "Free software alternatives" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card group p-4 text-center"
            >
              <span className="block text-[14px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors mb-1">
                {item.title}
              </span>
              <span className="block text-[12px] text-zinc-600">{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ NEWSLETTER ═══ */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="section-label mb-2">Stay updated</p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">Never miss a deal</h2>
        <p className="text-[14px] text-zinc-600 mb-6 max-w-md mx-auto">
          Get the best new deals delivered to your inbox. No spam, unsubscribe anytime.
        </p>
        <div className="flex justify-center">
          <NewsletterForm />
        </div>
      </section>
      </ScrollReveal>

      {/* Divider */}
      <div className="line-fade mx-auto max-w-5xl" />

      {/* ═══ STATS BANNER ═══ */}
      <ScrollReveal>
      <section className="border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-3 divide-x divide-white/[0.04]">
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-bold text-zinc-100">
              <AnimatedCounter target={deals.length} suffix="+" />
            </div>
            <div className="text-[12px] text-zinc-600 mt-1 font-medium">Free deals</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-bold text-zinc-100">
              $<AnimatedCounter target={500} suffix="K+" />
            </div>
            <div className="text-[12px] text-zinc-600 mt-1 font-medium">Potential savings</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-bold text-zinc-100">
              <AnimatedCounter target={100} suffix="%" />
            </div>
            <div className="text-[12px] text-zinc-600 mt-1 font-medium">Free to access</div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ═══ FAQ ═══ */}
      <ScrollReveal>
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="section-label mb-2 text-center">FAQ</p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <div key={i} className="card p-5">
              <h3 className="text-[14px] font-semibold text-zinc-200 mb-2">{faq.q}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* JSON-LD FAQ — controlled editorial content, not user input — safe for inline script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
