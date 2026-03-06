import { MetadataRoute } from "next";
import { getDeals } from "@/lib/deals";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getDeals();

  const dealUrls: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${baseUrl}/deals/${deal.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...dealUrls,
  ];
}
