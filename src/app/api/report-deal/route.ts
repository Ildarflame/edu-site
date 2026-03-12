import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

function notionHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const databaseId = process.env.NOTION_DEALS_DATABASE_ID;
    if (!databaseId || !process.env.NOTION_TOKEN) {
      return NextResponse.json({ error: "not configured" }, { status: 503 });
    }

    // Find the Notion page for this slug directly (no React.cache / getDeals)
    const searchRes = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: notionHeaders(),
        body: JSON.stringify({
          filter: { property: "Slug", rich_text: { equals: slug } },
          page_size: 1,
        }),
      }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ error: "notion search failed" }, { status: 500 });
    }

    const data = await searchRes.json();
    const page = data.results?.[0];
    if (!page) {
      return NextResponse.json({ error: "deal not found" }, { status: 404 });
    }

    const current = page.properties?.Reports?.number ?? 0;

    // Increment Reports property
    const patchRes = await fetch(
      `https://api.notion.com/v1/pages/${page.id}`,
      {
        method: "PATCH",
        headers: notionHeaders(),
        body: JSON.stringify({
          properties: { Reports: { number: current + 1 } },
        }),
      }
    );

    if (!patchRes.ok) {
      return NextResponse.json({ error: "notion patch failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
