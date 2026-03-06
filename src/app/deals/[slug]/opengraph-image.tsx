import { ImageResponse } from "next/og";
import { getDealBySlug, CATEGORY_CONFIG } from "@/lib/deals";

export const alt = "Deal on StudentPerks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal) {
    return new ImageResponse(
      (
        <div style={{ background: "#050507", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a", fontSize: 32, fontFamily: "sans-serif" }}>
          Deal not found
        </div>
      ),
      { ...size }
    );
  }

  const catConfig = CATEGORY_CONFIG[deal.category];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#050507",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>{catConfig.icon}</span>
          <span style={{ fontSize: 18, color: "#a1a1aa" }}>{deal.category}</span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {deal.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#71717a",
            marginTop: 16,
            maxWidth: 800,
          }}
        >
          {deal.tagline}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
          }}
        >
          <div
            style={{
              padding: "8px 24px",
              borderRadius: 8,
              background: "rgba(16, 185, 129, 0.1)",
              color: "#34d399",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {deal.value}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            fontSize: 20,
            color: "#3f3f46",
          }}
        >
          StudentPerks
        </div>
      </div>
    ),
    { ...size }
  );
}
