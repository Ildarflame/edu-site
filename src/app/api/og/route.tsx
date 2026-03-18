import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getDealBySlug } from "@/lib/deals";
import { CATEGORY_CONFIG } from "@/data/deals";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const title = req.nextUrl.searchParams.get("title");

  // Generic OG with custom title (for blog posts, etc.)
  if (!slug && title) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)", padding: 80, position: "relative" }}>
          {/* Accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #f97316, #fb923c, #f97316)", display: "flex" }} />
          <div style={{ fontSize: 52, fontWeight: 800, color: "#fafafa", lineHeight: 1.2, marginBottom: 24, maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22, color: "#f97316", fontWeight: 700 }}>StudentPerks</div>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: "#3f3f46", display: "flex" }} />
            <div style={{ fontSize: 18, color: "#71717a" }}>Free Tools for Students & Startups</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  if (!slug) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", color: "#fff", fontSize: 48, fontWeight: 700 }}>
          StudentPerks
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const deal = await getDealBySlug(slug);
  if (!deal) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", color: "#fff", fontSize: 48, fontWeight: 700 }}>
          Deal Not Found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const config = CATEGORY_CONFIG[deal.category];

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)", padding: 80, position: "relative" }}>
        {/* Accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #f97316, #fb923c, #f97316)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>{config.icon}</span>
          <span style={{ fontSize: 20, color: "#a1a1aa", fontWeight: 500 }}>{deal.category}</span>
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#fafafa", lineHeight: 1.1, marginBottom: 16 }}>
          {deal.name}
        </div>
        <div style={{ fontSize: 26, color: "#71717a", marginBottom: 32, maxWidth: 800 }}>
          {deal.tagline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 12, padding: "10px 24px", fontSize: 26, fontWeight: 700, color: "#34d399" }}>
            {deal.value}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, color: "#f97316", fontWeight: 600 }}>StudentPerks</span>
            <span style={{ fontSize: 16, color: "#52525b" }}>— Claim Free</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
