import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StudentPerks — Free tools for students, startups & OSS";
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: -40,
            right: -20,
            width: 400,
            height: 400,
            opacity: 0.07,
          }}
        >
          <path d="M18.5 3L8 18h7l-2 11L25 14h-7l2-11z" fill="#f97316" />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f4f4f5",
            letterSpacing: "-0.03em",
          }}
        >
          StudentPerks
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
