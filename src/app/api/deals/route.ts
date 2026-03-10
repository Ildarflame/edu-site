import { NextResponse } from "next/server";
import { getDeals } from "@/lib/deals";

export async function GET() {
  const deals = await getDeals();

  const data = deals.map((d) => ({
    slug: d.slug,
    name: d.name,
    category: d.category,
    audiences: d.audiences,
    tagline: d.tagline,
    value: d.value,
    url: d.url,
    featured: d.featured,
    logo: `https://studentperks.dev${d.logo}`,
    page: `https://studentperks.dev/deals/${d.slug}`,
  }));

  return NextResponse.json(
    {
      count: data.length,
      source: "https://studentperks.dev",
      updated: new Date().toISOString(),
      deals: data,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
