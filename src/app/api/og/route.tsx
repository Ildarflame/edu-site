import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getDealBySlug } from "@/lib/deals";
import { CATEGORY_CONFIG } from "@/data/deals";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
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
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#09090b", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 40 }}>{config.icon}</span>
          <span style={{ fontSize: 20, color: "#a1a1aa", fontWeight: 500 }}>{deal.category}</span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#fafafa", lineHeight: 1.1, marginBottom: 20 }}>
          {deal.name}
        </div>
        <div style={{ fontSize: 28, color: "#71717a", marginBottom: 32 }}>
          {deal.tagline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 12, padding: "8px 20px", fontSize: 24, fontWeight: 700, color: "#34d399" }}>
            {deal.value}
          </div>
          <span style={{ fontSize: 18, color: "#52525b" }}>studentperks.dev</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
