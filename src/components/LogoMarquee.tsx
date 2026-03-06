"use client";

import Image from "next/image";

const brands = [
  { name: "GitHub", logo: "/logos/github.svg" },
  { name: "Notion", logo: "/logos/notion.svg" },
  { name: "Figma", logo: "/logos/figma.svg" },
  { name: "JetBrains", logo: "/logos/jetbrains.svg" },
  { name: "Vercel", logo: "/logos/vercel.svg" },
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "Copilot", logo: "/logos/copilot.svg" },
  { name: "Spotify", logo: "/logos/spotify.svg" },
  { name: "Coursera", logo: "/logos/coursera.svg" },
  { name: "OpenAI", logo: "/logos/openai.svg" },
  { name: "Stripe", logo: "/logos/stripe.svg" },
  { name: "Docker", logo: "/logos/docker.svg" },
  { name: "Supabase", logo: "/logos/supabase.svg" },
  { name: "Sentry", logo: "/logos/sentry.svg" },
  { name: "MongoDB", logo: "/logos/mongodb.svg" },
];

// Duplicate for seamless loop
const allBrands = [...brands, ...brands];

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-8 border-y border-white/[0.04] bg-white/[0.01]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050507] to-transparent" />

      <div className="marquee flex items-center gap-16 whitespace-nowrap">
        {allBrands.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={24}
              height={24}
              className="opacity-70"
            />
            <span className="text-[14px] font-medium text-zinc-400 tracking-wide select-none">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
