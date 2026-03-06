"use client";

const brands = [
  "GitHub", "Notion", "Figma", "JetBrains", "Vercel",
  "AWS", "Copilot", "Spotify", "Coursera", "OpenAI",
  "GitHub", "Notion", "Figma", "JetBrains", "Vercel",
  "AWS", "Copilot", "Spotify", "Coursera", "OpenAI",
];

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/[0.04] bg-white/[0.01]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050507] to-transparent" />

      <div className="marquee flex items-center gap-12 whitespace-nowrap">
        {brands.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="text-[13px] font-medium text-zinc-700 tracking-wide select-none"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
