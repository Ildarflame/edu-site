import { NextResponse } from "next/server";

const KEY = "786026f8e1a74181b3675dd490aea555";
const HOST = "https://www.studentperks.dev";

export async function POST(req: Request) {
  const { urls } = (await req.json()) as { urls?: string[] };
  if (!urls?.length) return NextResponse.json({ error: "No urls" }, { status: 400 });

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host: "www.studentperks.dev", key: KEY, keyLocation: `${HOST}/${KEY}.txt`, urlList: urls }),
  });

  return NextResponse.json({ status: res.status, submitted: urls.length });
}
