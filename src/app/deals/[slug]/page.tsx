import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeals, getDealBySlug, getDealsByCategory } from "@/lib/deals";
import { GUIDE_SEO, ALTERNATIVES_SEO, VS_SEO } from "@/data/seo-content";
import CategoryBadge from "@/components/CategoryBadge";
import AudienceBadge from "@/components/AudienceBadge";
import DealCard from "@/components/DealCard";
import DealRating from "@/components/DealRating";
import DealVoting from "@/components/DealVoting";
import ShareButtons from "@/components/ShareButtons";
import DealCTA from "@/components/DealCTA";
import DealStatusBadge from "@/components/DealStatusBadge";
import PushNotification from "@/components/PushNotification";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import CategoryTracker from "@/components/CategoryTracker";
import DealPageTracker from "@/components/DealPageTracker";

export const revalidate = 300;

export async function generateStaticParams() {
  const deals = await getDeals();
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return { title: "Deal Not Found" };
  const title = `${deal.name} — ${deal.tagline} | StudentPerks 2026`.slice(0, 65);
  const description = deal.description.length > 155 ? deal.description.slice(0, 152) + "..." : deal.description;
  return {
    title,
    description,
    alternates: { canonical: `https://www.studentperks.dev/deals/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: `/api/og?slug=${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?slug=${slug}`],
    },
  };
}

export default async function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) notFound();

  const related = (await getDealsByCategory(deal.category)).filter((d) => d.slug !== deal.slug).slice(0, 3);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <CategoryTracker category={deal.category} />
      <DealPageTracker slug={slug} />

      {deal.status === "expired" && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          This deal may have expired or changed. Check the provider&apos;s website for the latest information.
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <Link href={`/category/${deal.category.toLowerCase()}`} className="hover:text-orange-400 transition-colors">{deal.category}</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-400">{deal.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
          <Image src={deal.logo} alt={deal.name} width={36} height={36} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">{deal.name}</h1>
            {deal.status && <DealStatusBadge status={deal.status} />}
          </div>
          <p className="mt-1.5 text-[15px] text-zinc-500">{deal.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Link href={`/category/${deal.category.toLowerCase()}`}>
              <CategoryBadge category={deal.category} />
            </Link>
            {deal.audiences.map((a) => (
              <Link key={a} href={`/for/${a}`}>
                <AudienceBadge audience={a} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="card p-5 mb-8 border-emerald-500/10">
        <p className="text-[11px] font-semibold text-emerald-500/70 uppercase tracking-wider">Estimated value</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">{deal.value}</p>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-[15px] font-semibold text-zinc-200 mb-2">About this deal</h2>
        <p className="text-[14px] text-zinc-500 leading-relaxed">{deal.description}</p>
      </div>

      {/* Steps */}
      <div className="mb-10">
        <h2 className="text-[15px] font-semibold text-zinc-200 mb-4">How to get it</h2>
        <div className="space-y-2">
          {deal.steps.map((step, i) => (
            <div key={i} className="card flex items-start gap-3.5 p-4">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow shadow-orange-500/20">
                {i + 1}
              </span>
              <span className="text-[13px] text-zinc-400 pt-0.5">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video guide */}
      {deal.video && (
        <div className="mb-10">
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-4">Video Guide</h2>
          <YouTubeEmbed url={deal.video} title={`${deal.name} — How to get it`} />
        </div>
      )}

      {/* CTA + Share */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <DealCTA url={deal.url} slug={deal.slug} category={deal.category} audiences={deal.audiences} />
        <div className="flex items-center gap-2">
          <ShareButtons title={deal.name} slug={deal.slug} />
          <PushNotification />
        </div>
      </div>

      {/* Status Voting */}
      <div className="mb-4">
        <DealVoting slug={deal.slug} />
      </div>

      {/* Rating */}
      <div className="mb-8">
        <DealRating slug={deal.slug} />
      </div>

      {/* Cross-links */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-zinc-600">Also popular with:</span>
        {deal.audiences.map((aud) => (
          <Link
            key={aud}
            href={`/for/${aud}`}
            className="text-[13px] text-orange-400 hover:text-orange-300 transition-colors"
          >
            {aud === "students" ? "Students" : aud === "startups" ? "Startups" : "Open Source"}
          </Link>
        ))}
        <span className="text-zinc-800 mx-1">·</span>
        <Link
          href={`/category/${deal.category.toLowerCase()}`}
          className="text-[13px] text-zinc-500 hover:text-orange-400 transition-colors"
        >
          Browse all {deal.category} deals →
        </Link>
      </div>

      {/* Related pages */}
      <div className="mt-4 flex flex-wrap gap-2">
        {deal.audiences.includes("students") && (
          <Link
            href={`/student-discount/${deal.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all"
          >
            Student Discount →
          </Link>
        )}
        {GUIDE_SEO.find((g) => g.dealSlug === deal.slug) && (
          <Link
            href={`/guides/${GUIDE_SEO.find((g) => g.dealSlug === deal.slug)!.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all"
          >
            Step-by-Step Guide →
          </Link>
        )}
        {ALTERNATIVES_SEO.find((a) => deal.name.toLowerCase().includes(a.name.toLowerCase())) && (
          <Link
            href={`/alternatives/${ALTERNATIVES_SEO.find((a) => deal.name.toLowerCase().includes(a.name.toLowerCase()))!.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all"
          >
            Free Alternatives →
          </Link>
        )}
        {VS_SEO.find((v) => v.tool1Slug === deal.slug || v.tool2Slug === deal.slug) && (
          <Link
            href={`/vs/${VS_SEO.find((v) => v.tool1Slug === deal.slug || v.tool2Slug === deal.slug)!.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300 transition-all"
          >
            Compare →
          </Link>
        )}</div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-white/[0.04]">
          <p className="section-label mb-2">More like this</p>
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((d) => <DealCard key={d.slug} deal={d} />)}
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/top/${deal.category.toLowerCase()}`}
              className="text-[14px] font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              Top {deal.category} deals &rarr;
            </Link>
          </div>
        </section>
      )}

      <div className="mt-10 card p-5 text-center">
        <p className="text-[13px] text-zinc-400 mb-1">Want deals like this in your inbox?</p>
        <p className="text-[11px] text-zinc-600 mb-3">Weekly picks, no spam.</p>
        <Link href="/#newsletter" className="btn-primary text-[12px] px-4 py-1.5">
          Subscribe for Free →
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: deal.name,
            applicationCategory: deal.category,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: deal.value,
            },
            description: deal.tagline,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: deal.name,
            description: deal.description,
            url: deal.url,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
              { "@type": "ListItem", position: 2, name: "Deals", item: "https://www.studentperks.dev/deals" },
              { "@type": "ListItem", position: 3, name: deal.category, item: `https://www.studentperks.dev/category/${deal.category.toLowerCase()}` },
              { "@type": "ListItem", position: 4, name: deal.name },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
