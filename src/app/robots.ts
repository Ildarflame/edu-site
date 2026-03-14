import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/deals?*"],
      },
      {
        // Allow AI crawlers to access /api/deals for structured data
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Applebot"],
        allow: ["/", "/api/deals"],
        disallow: ["/_next/"],
      },
    ],
    sitemap: "https://www.studentperks.dev/sitemap.xml",
  };
}
