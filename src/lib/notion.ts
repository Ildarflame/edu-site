import { Client } from "@notionhq/client";
import type { Deal, Category, Audience } from "@/data/deals";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DEALS_DATABASE_ID!;

type NotionRichText = { plain_text: string }[];
type NotionPage = {
  id: string;
  properties: Record<string, any>;
};

function getRichText(prop: any): string {
  if (!prop?.rich_text) return "";
  return (prop.rich_text as NotionRichText).map((t) => t.plain_text).join("");
}

function getTitle(prop: any): string {
  if (!prop?.title) return "";
  return (prop.title as NotionRichText).map((t) => t.plain_text).join("");
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? "";
}

function getMultiSelect(prop: any): string[] {
  if (!prop?.multi_select) return [];
  return prop.multi_select.map((s: any) => s.name);
}

function getCheckbox(prop: any): boolean {
  return prop?.checkbox ?? false;
}

function getUrl(prop: any): string {
  return prop?.url ?? "";
}

function getNumber(prop: any): number {
  return prop?.number ?? 0;
}

function pageToSlug(page: NotionPage): string {
  return getRichText(page.properties["Slug"]) || page.id;
}

function pageToDeal(page: NotionPage): Deal {
  const p = page.properties;
  const stepsRaw = getRichText(p["Steps"]);
  const steps = stepsRaw
    ? stepsRaw.split("\n").filter((s) => s.trim())
    : [];

  return {
    slug: pageToSlug(page),
    name: getTitle(p["Name"]),
    logo: getRichText(p["Logo"]) || `/logos/${pageToSlug(page)}.svg`,
    category: (getSelect(p["Category"]) || "Dev") as Category,
    audiences: getMultiSelect(p["Audiences"]).map(
      (a) => a.toLowerCase().replace(" ", "") as Audience
    ),
    tagline: getRichText(p["Tagline"]),
    description: getRichText(p["Description"]),
    value: getRichText(p["Value"]),
    steps,
    url: getUrl(p["URL"]),
    featured: getCheckbox(p["Featured"]),
  };
}

export async function fetchDealsFromNotion(): Promise<Deal[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  // Use POST to /databases/{id}/query via fetch (SDK missing query method)
  do {
    const body: Record<string, any> = {
      sorts: [{ property: "Name", direction: "ascending" }],
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`Notion API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    pages.push(...(data.results as NotionPage[]));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages.map(pageToDeal);
}

export function isNotionConfigured(): boolean {
  return !!(process.env.NOTION_TOKEN && process.env.NOTION_DEALS_DATABASE_ID);
}
