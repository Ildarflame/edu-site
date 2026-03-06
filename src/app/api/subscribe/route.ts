import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_SUBSCRIBERS_DATABASE_ID;

  if (!token || !dbId) {
    // Fallback: just log if Notion not configured for subscribers
    console.log("Newsletter signup:", email);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        Email: { title: [{ text: { content: email } }] },
        "Subscribed At": { date: { start: new Date().toISOString() } },
      },
    }),
  });

  if (!res.ok) {
    console.error("Notion subscribe error:", await res.text());
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
