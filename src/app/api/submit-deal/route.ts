import { NextRequest, NextResponse } from "next/server";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DEALS_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, url, category, audiences, description, email } = body as {
    name: string;
    url: string;
    category: string;
    audiences: string[];
    description: string;
    email: string;
  };

  if (!name || !url || !category || !audiences?.length || !description || !email) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const slug = slugify(name);

  const audienceMap: Record<string, string> = {
    Students: "Students",
    Startups: "Startups",
    "Open Source": "Opensource",
  };

  const notionAudiences = audiences.map((a) => ({
    name: audienceMap[a] || a,
  }));

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: name } }],
          },
          URL: {
            url: url,
          },
          Category: {
            select: { name: category },
          },
          Audiences: {
            multi_select: notionAudiences,
          },
          Description: {
            rich_text: [{ text: { content: description.slice(0, 2000) } }],
          },
          Slug: {
            rich_text: [{ text: { content: slug } }],
          },
          Featured: {
            checkbox: false,
          },
          Tagline: {
            rich_text: [{ text: { content: `Submitted by ${email}` } }],
          },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Notion API error:", errText);
      return NextResponse.json({ error: "Failed to submit deal" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit deal error:", err);
    return NextResponse.json({ error: "Failed to submit deal" }, { status: 500 });
  }
}
