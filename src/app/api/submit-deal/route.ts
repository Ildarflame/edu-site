import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ALLOWED_CATEGORIES = ["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"] as const;
const ALLOWED_AUDIENCES = ["Students", "Startups", "Open Source"] as const;

const submitSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url().max(500),
  category: z.enum(ALLOWED_CATEGORIES),
  audiences: z.array(z.enum(ALLOWED_AUDIENCES)).min(1),
  description: z.string().min(1).max(2000),
  email: z.string().email().max(254),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(key);
  }
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 3;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  // Origin check
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("studentperks.dev") && !origin.includes("localhost")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DEALS_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, url, category, audiences, description, email } = parsed.data;
  const slug = slugify(name);

  // Check for duplicate URL
  const checkRes = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "URL", url: { equals: url } },
        page_size: 1,
      }),
    }
  );

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    if (checkData.results?.length > 0) {
      return NextResponse.json({ error: "This deal already exists in our catalog" }, { status: 409 });
    }
  }

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
          Name: { title: [{ text: { content: name } }] },
          URL: { url },
          Category: { select: { name: category } },
          Audiences: { multi_select: notionAudiences },
          Description: { rich_text: [{ text: { content: description } }] },
          Slug: { rich_text: [{ text: { content: slug } }] },
          Featured: { checkbox: false },
          Tagline: { rich_text: [{ text: { content: `Submitted by ${email}` } }] },
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
