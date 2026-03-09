import { MetadataRoute } from "next";
import { getDeals } from "@/lib/deals";
import { getAllPosts } from "@/lib/blog";
import {
  CATEGORY_SEO, AUDIENCE_SEO, ALTERNATIVES_SEO,
  COMPARISON_SEO, USE_CASE_SEO, GUIDE_SEO, TAG_SEO,
} from "@/data/seo-content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getDeals();
  const posts = getAllPosts();

  const dealUrls: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${baseUrl}/deals/${deal.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SEO.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const audienceUrls: MetadataRoute.Sitemap = AUDIENCE_SEO.map((aud) => ({
    url: `${baseUrl}/for/${aud.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const crossFilterUrls: MetadataRoute.Sitemap = AUDIENCE_SEO.flatMap((aud) =>
    CATEGORY_SEO.map((cat) => ({
      url: `${baseUrl}/for/${aud.slug}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const topUrls: MetadataRoute.Sitemap = CATEGORY_SEO.map((cat) => ({
    url: `${baseUrl}/top/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const alternativesUrls: MetadataRoute.Sitemap = ALTERNATIVES_SEO.map((alt) => ({
    url: `${baseUrl}/alternatives/${alt.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const comparisonUrls: MetadataRoute.Sitemap = COMPARISON_SEO.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const useCaseUrls: MetadataRoute.Sitemap = USE_CASE_SEO.map((u) => ({
    url: `${baseUrl}/best/${u.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideUrls: MetadataRoute.Sitemap = GUIDE_SEO.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const tagUrls: MetadataRoute.Sitemap = TAG_SEO.map((t) => ({
    url: `${baseUrl}/tag/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...categoryUrls,
    ...audienceUrls,
    ...crossFilterUrls,
    ...topUrls,
    ...alternativesUrls,
    ...comparisonUrls,
    ...useCaseUrls,
    ...guideUrls,
    ...tagUrls,
    ...dealUrls,
    ...blogUrls,
  ];
}
