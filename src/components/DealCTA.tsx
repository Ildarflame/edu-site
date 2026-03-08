"use client";

import { track } from "@vercel/analytics";

type Props = {
  url: string;
  slug: string;
  category: string;
  audiences: string[];
};

export default function DealCTA({ url, slug, category, audiences }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("deal_click", { slug, category, audience: audiences.join(",") })}
      className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-[14px]"
    >
      Claim this perk
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </a>
  );
}
