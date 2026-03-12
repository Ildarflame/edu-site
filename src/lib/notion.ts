import { z } from "zod";
import type { Deal, Category, Audience } from "@/data/deals";

const databaseId = process.env.NOTION_DEALS_DATABASE_ID ?? "";

const CATEGORIES: Category[] = ["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"];
const AUDIENCES: Audience[] = ["students", "startups", "opensource"];

const dealSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  logo: z.string(),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  audiences: z.array(z.enum(AUDIENCES as [Audience, ...Audience[]])).min(1),
  tagline: z.string(),
  description: z.string(),
  value: z.string(),
  steps: z.array(z.string()),
  url: z.string(),
  featured: z.boolean(),
  updatedAt: z.string().optional(),
  status: z.enum(["verified", "expired"]).optional(),
  regions: z.array(z.string()).optional(),
  video: z.string().optional(),
  tips: z.string().optional(),
  requirements: z.string().optional(),
});

type NotionRichText = { plain_text: string }[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionProperty = any;

type NotionPage = {
  id: string;
  last_edited_time?: string;
  properties: Record<string, NotionProperty>;
};

function getRichText(prop: NotionProperty): string {
  if (!prop?.rich_text) return "";
  return (prop.rich_text as NotionRichText).map((t) => t.plain_text).join("");
}

function getTitle(prop: NotionProperty): string {
  if (!prop?.title) return "";
  return (prop.title as NotionRichText).map((t) => t.plain_text).join("");
}

function getSelect(prop: NotionProperty): string {
  return prop?.select?.name ?? "";
}

function getMultiSelect(prop: NotionProperty): string[] {
  if (!prop?.multi_select) return [];
  return prop.multi_select.map((s: { name: string }) => s.name);
}

function getCheckbox(prop: NotionProperty): boolean {
  return prop?.checkbox ?? false;
}

function getUrl(prop: NotionProperty): string {
  return prop?.url ?? "";
}

function pageToSlug(page: NotionPage): string {
  return getRichText(page.properties["Slug"]) || page.id;
}

function pageToDeal(page: NotionPage): Deal | null {
  const p = page.properties;
  const stepsRaw = getRichText(p["Steps"]);
  const steps = stepsRaw
    ? stepsRaw.split("\n").filter((s) => s.trim())
    : [];

  const raw = {
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
    updatedAt: page.last_edited_time,
    status: (getSelect(p["Status"]).toLowerCase() || undefined) as "verified" | "expired" | undefined,
    regions: getMultiSelect(p["Regions"]).length > 0 ? getMultiSelect(p["Regions"]) : undefined,
    video: getUrl(p["Video"]) || undefined,
    tips: getRichText(p["Tips"]) || undefined,
    requirements: getRichText(p["Requirements"]) || undefined,
  };

  const result = dealSchema.safeParse(raw);
  if (!result.success) {
    console.warn(`Invalid deal "${raw.name || raw.slug}":`, result.error.issues);
    return null;
  }
  return result.data;
}

export async function fetchDealsFromNotion(): Promise<Deal[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
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

  return pages.map(pageToDeal).filter((d): d is Deal => d !== null);
}

export function isNotionConfigured(): boolean {
  return !!(process.env.NOTION_TOKEN && process.env.NOTION_DEALS_DATABASE_ID);
}
