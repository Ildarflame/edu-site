import { deals as hardcodedDeals, type Deal, type Category, type Audience } from "@/data/deals";
import { fetchDealsFromNotion, isNotionConfigured } from "./notion";

let cachedDeals: Deal[] | null = null;

export async function getDeals(): Promise<Deal[]> {
  if (cachedDeals) return cachedDeals;

  if (isNotionConfigured()) {
    try {
      cachedDeals = await fetchDealsFromNotion();
      if (cachedDeals.length > 0) return cachedDeals;
    } catch (e) {
      console.error("Failed to fetch from Notion, using fallback:", e);
    }
  }

  cachedDeals = hardcodedDeals;
  return cachedDeals;
}

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
