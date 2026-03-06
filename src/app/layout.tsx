import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev"),
  title: "StudentPerks — Free Tools & Perks for Students",
  description:
    "Discover free tools, services, and discounts available for students, startups, and open source projects.",
  openGraph: {
    type: "website",
    title: "StudentPerks — Free Tools & Perks for Students",
    description: "Discover free tools, services, and discounts available for students, startups, and open source projects.",
    siteName: "StudentPerks",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentPerks — Free Tools & Perks for Students",
    description: "Discover free tools, services, and discounts available for students, startups, and open source projects.",
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
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://studentperks.dev",
              description: "Discover free tools, services, and discounts for students, startups, and open source projects.",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
