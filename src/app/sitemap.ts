import { MetadataRoute } from "next";
import { getDeals } from "@/lib/deals";
import { getAllPosts } from "@/lib/blog";
import {
  CATEGORY_SEO, AUDIENCE_SEO, ALTERNATIVES_SEO,
  COMPARISON_SEO, USE_CASE_SEO, GUIDE_SEO, TAG_SEO, SEASONAL_SEO, VS_SEO,
} from "@/data/seo-content";
import { UNIVERSITIES } from "@/data/universities";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.studentperks.dev";

// Fixed date for SEO content pages that change infrequently.
// Update this when SEO content (seo-content.ts, universities.ts) is modified.
const seoContentDate = new Date("2026-03-28");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getDeals();
  const posts = getAllPosts();

  const dealUrls: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${baseUrl}/deals/${deal.slug}`,
    lastModified: deal.updatedAt ? new Date(deal.updatedAt) : seoContentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SEO.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const audienceUrls: MetadataRoute.Sitemap = AUDIENCE_SEO.map((aud) => ({
    url: `${baseUrl}/for/${aud.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const crossFilterUrls: MetadataRoute.Sitemap = AUDIENCE_SEO.flatMap((aud) =>
    CATEGORY_SEO.map((cat) => ({
      url: `${baseUrl}/for/${aud.slug}/${cat.slug}`,
      lastModified: seoContentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const topUrls: MetadataRoute.Sitemap = CATEGORY_SEO.map((cat) => ({
    url: `${baseUrl}/top/${cat.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const alternativesUrls: MetadataRoute.Sitemap = ALTERNATIVES_SEO.map((alt) => ({
    url: `${baseUrl}/alternatives/${alt.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const comparisonUrls: MetadataRoute.Sitemap = COMPARISON_SEO.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const useCaseUrls: MetadataRoute.Sitemap = USE_CASE_SEO.map((u) => ({
    url: `${baseUrl}/best/${u.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideUrls: MetadataRoute.Sitemap = GUIDE_SEO.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const seasonalUrls: MetadataRoute.Sitemap = SEASONAL_SEO.map((s) => ({
    url: `${baseUrl}/seasonal/${s.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagUrls: MetadataRoute.Sitemap = TAG_SEO.map((t) => ({
    url: `${baseUrl}/tag/${t.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const studentDiscountUrls: MetadataRoute.Sitemap = deals
    .filter((d) => d.audiences.includes("students"))
    .map((deal) => ({
      url: `${baseUrl}/student-discount/${deal.slug}`,
      lastModified: deal.updatedAt ? new Date(deal.updatedAt) : seoContentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const vsUrls: MetadataRoute.Sitemap = VS_SEO.map((v) => ({
    url: `${baseUrl}/vs/${v.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const universityUrls: MetadataRoute.Sitemap = UNIVERSITIES.map((u) => ({
    url: `${baseUrl}/university/${u.slug}`,
    lastModified: seoContentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/student-discount`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/free-tools-for-students`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/student-freebies-finder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/savings-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/this-week`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/stack`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/vs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/alternatives`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...categoryUrls,
    ...audienceUrls,
    ...crossFilterUrls,
    ...topUrls,
    ...alternativesUrls,
    ...comparisonUrls,
    ...vsUrls,
    ...useCaseUrls,
    ...guideUrls,
    ...seasonalUrls,
    ...tagUrls,
    ...studentDiscountUrls,
    ...universityUrls,
    ...dealUrls,
    ...blogUrls,
  ];
}
