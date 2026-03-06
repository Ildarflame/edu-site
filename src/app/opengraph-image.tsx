import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EduDeals — Free tools for students, startups & OSS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050507",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
          }}
        >
          EduDeals
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#71717a",
            marginTop: 16,
          }}
        >
          Free tools for students, startups & open source
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["🎓 Students", "🚀 Startups", "💻 Open Source"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#a1a1aa",
                fontSize: 18,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
