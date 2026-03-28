import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.studentperks.dev"),
  title: "150+ Free Developer Tools for Students & Startups (2026)",
  description:
    "Free JetBrains, GitHub Copilot, Azure $100, AWS $100K — 150+ verified deals for students, startups & open source projects. Claim in minutes.",
  alternates: { canonical: "https://www.studentperks.dev" },
  manifest: "/manifest.json",
  other: { "theme-color": "#18181b" },
  openGraph: {
    type: "website",
    title: "150+ Free Developer Tools for Students & Startups (2026)",
    description: "Free JetBrains, GitHub Copilot, Azure $100, AWS $100K — 150+ verified deals for students, startups & open source projects. Claim in minutes.",
    siteName: "StudentPerks",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "150+ Free Developer Tools for Students & Startups (2026)",
    description: "Free JetBrains, GitHub Copilot, Azure $100, AWS $100K — 150+ verified deals for students, startups & open source projects. Claim in minutes.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${outfit.variable}`}>
      <head>
        {/* WebSite + Organization schema — all values hardcoded, no user input — safe for inline script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "StudentPerks",
                url: "https://www.studentperks.dev",
                description: "Discover free tools, services, and discounts for students, startups, and open source projects.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://www.studentperks.dev/deals?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "StudentPerks",
                url: "https://www.studentperks.dev",
                logo: "https://www.studentperks.dev/logos/icon-512.png",
                description: "150+ free tools, credits, and discounts for students, startups, and open source projects.",
                sameAs: [
                  "https://github.com/Ildarflame/awesome-student-developer-deals",
                ],
              },
            ]).replace(/</g, "\\u003c"),
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="StudentPerks Blog" href="/blog/feed.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.notion.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
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
