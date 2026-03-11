import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "studentperks.dev" }],
      destination: "https://www.studentperks.dev/:path*",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/logos/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/:path*.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
