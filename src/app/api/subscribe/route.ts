import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter (per IP, 5 requests per minute)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) {
      rateLimit.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  cleanupRateLimit();
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const VALID_FREQUENCIES = ["weekly", "biweekly", "monthly"] as const;

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
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

  const { email, frequency, interests, categories } = body;
  if (!email || typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Validate frequency
  if (frequency !== undefined) {
    if (typeof frequency !== "string" || !VALID_FREQUENCIES.includes(frequency.trim() as typeof VALID_FREQUENCIES[number])) {
      return NextResponse.json({ error: "Invalid frequency. Must be weekly, biweekly, or monthly" }, { status: 400 });
    }
    body.frequency = frequency.trim();
  }

  // Validate interests
  if (interests !== undefined) {
    if (!isStringArray(interests) || interests.length > 10) {
      return NextResponse.json({ error: "Invalid interests. Must be an array of up to 10 strings" }, { status: 400 });
    }
    if (interests.some((i) => i.trim().length === 0 || i.trim().length > 50)) {
      return NextResponse.json({ error: "Each interest must be 1-50 characters" }, { status: 400 });
    }
    body.interests = interests.map((i) => i.trim());
  }

  // Validate categories
  if (categories !== undefined) {
    if (!isStringArray(categories) || categories.length > 10) {
      return NextResponse.json({ error: "Invalid categories. Must be an array of up to 10 strings" }, { status: 400 });
    }
    if (categories.some((c) => c.trim().length === 0 || c.trim().length > 50)) {
      return NextResponse.json({ error: "Each category must be 1-50 characters" }, { status: 400 });
    }
    body.categories = categories.map((c) => c.trim());
  }

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_SUBSCRIBERS_DATABASE_ID;

  const trimmedEmail = email.trim();
  const trimmedFrequency = body.frequency;
  const trimmedInterests = body.interests;
  const trimmedCategories = body.categories;

  if (!token || !dbId) {
    console.log("Newsletter signup:", trimmedEmail, "frequency:", trimmedFrequency, "interests:", trimmedInterests);
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
        Email: { title: [{ text: { content: trimmedEmail } }] },
        "Subscribed At": { date: { start: new Date().toISOString() } },
        ...(trimmedFrequency ? { Frequency: { select: { name: trimmedFrequency } } } : {}),
        ...(trimmedInterests && trimmedInterests.length > 0
          ? { Interests: { multi_select: trimmedInterests.map((i) => ({ name: i })) } }
          : {}),
        ...(trimmedCategories && trimmedCategories.length > 0
          ? { Categories: { multi_select: trimmedCategories.map((c) => ({ name: c })) } }
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
