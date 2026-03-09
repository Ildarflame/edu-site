import { cache } from "react";
import { unstable_cache } from "next/cache";
import { deals as hardcodedDeals, type Deal, type Category, type Audience } from "@/data/deals";
import { fetchDealsFromNotion, isNotionConfigured } from "./notion";

async function fetchDeals(): Promise<Deal[]> {
  if (isNotionConfigured()) {
    try {
      const notionDeals = await fetchDealsFromNotion();
      if (notionDeals.length > 0) return notionDeals;
    } catch (e) {
      console.error("Failed to fetch from Notion, using fallback:", e);
    }
  }
  return hardcodedDeals;
}

const getCachedDeals = unstable_cache(fetchDeals, ["deals"], {
  revalidate: 300,
  tags: ["deals"],
});

export const getDeals = cache(getCachedDeals);

export async function getDealBySlug(slug: string): Promise<Deal | undefined> {
  const deals = await getDeals();
  return deals.find((d) => d.slug === slug);
}

export async function getDealsByCategory(category: Category): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.category === category);
}

export async function getDealsByAudience(audience: Audience): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.audiences.includes(audience));
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.featured);
}

export type { Deal, Category, Audience };
export { CATEGORY_CONFIG, AUDIENCE_LABELS } from "@/data/deals";
