import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    // Log subscription for Vercel logs — placeholder for future storage
    console.log("[push-subscribe]", JSON.stringify(subscription));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
