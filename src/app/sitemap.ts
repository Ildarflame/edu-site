import { MetadataRoute } from "next";
import { getDeals } from "@/lib/deals";
import { getAllPosts } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev";

const categories = ["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"];
const audiences = ["students", "startups", "opensource"];

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
    priority: 0.6,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/deals?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const audienceUrls: MetadataRoute.Sitemap = audiences.map((aud) => ({
    url: `${baseUrl}/deals?audience=${aud}`,
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
    ...dealUrls,
    ...blogUrls,
  ];
}
