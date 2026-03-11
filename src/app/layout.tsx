import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.studentperks.dev"),
  title: "StudentPerks — Free Tools for Students & Startups",
  description:
    "Claim 150+ free developer tools, cloud credits, and pro plans for students, startups, and open source projects. Save $500K+ in 2026.",
  alternates: { canonical: "https://www.studentperks.dev" },
  manifest: "/manifest.json",
  other: { "theme-color": "#18181b" },
  openGraph: {
    type: "website",
    title: "StudentPerks — Free Tools for Students & Startups",
    description: "Claim 150+ free developer tools, cloud credits, and pro plans for students, startups, and open source projects. Save $500K+ in 2026.",
    siteName: "StudentPerks",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentPerks — Free Tools for Students & Startups",
    description: "Claim 150+ free developer tools, cloud credits, and pro plans for students, startups, and open source projects. Save $500K+ in 2026.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StudentPerks",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.studentperks.dev",
              description: "Discover free tools, services, and discounts for students, startups, and open source projects.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.studentperks.dev/deals?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="StudentPerks Blog" href="/blog/feed.xml" />
        <link rel="dns-prefetch" href="https://api.notion.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <div className="flex-1" id="main-content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
        {/* SW registration — hardcoded inline script, no user input */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
      </body>
    </html>
  );
}
