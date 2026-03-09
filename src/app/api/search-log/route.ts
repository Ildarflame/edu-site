import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, resultsCount } = await request.json();
    if (typeof query === "string" && query.length >= 2) {
      console.log(`[search] q="${query}" results=${resultsCount}`);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
