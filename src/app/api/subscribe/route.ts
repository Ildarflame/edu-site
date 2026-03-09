import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter (per IP, 5 requests per minute)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Origin check
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("studentperks.dev") && !origin.includes("localhost")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email?: string; frequency?: string; interests?: string[]; categories?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, frequency, interests } = body;
  if (!email || typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_SUBSCRIBERS_DATABASE_ID;

  if (!token || !dbId) {
    console.log("Newsletter signup:", email, "frequency:", frequency, "interests:", interests);
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
        ...(frequency ? { Frequency: { select: { name: frequency } } } : {}),
        ...(interests && interests.length > 0
          ? { Interests: { multi_select: interests.map((i) => ({ name: i })) } }
          : {}),
        ...(body.categories && body.categories.length > 0
          ? { Categories: { multi_select: body.categories.map((c) => ({ name: c })) } }
          : {}),
      },
    }),
  });

  if (!res.ok) {
    console.error("Notion subscribe error:", await res.text());
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
