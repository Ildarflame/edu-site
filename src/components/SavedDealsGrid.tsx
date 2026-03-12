"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSavedDeals } from "@/hooks/useSavedDeals";
import { useRemindMe } from "@/hooks/useRemindMe";
import type { Deal } from "@/data/deals";
import DealStatusBadge from "./DealStatusBadge";

function RemindButton({ slug, name }: { slug: string; name: string }) {
  const { isDue, isSet, setReminder, clearReminder } = useRemindMe(slug);

  if (isDue) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-amber-400 font-medium">
          Time to check if you claimed {name}
        </span>
        <button
          onClick={clearReminder}
          className="text-[11px] text-zinc-700 hover:text-zinc-500 underline underline-offset-2 decoration-dotted"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (isSet) {
    return (
      <button
        onClick={clearReminder}
        className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        Reminder set ✓ (cancel)
      </button>
    );
  }

  return (
    <button
      onClick={setReminder}
      className="text-[11px] text-zinc-600 hover:text-orange-400 transition-colors"
    >
      Remind me in 30 days
    </button>
  );
}

export default function SavedDealsGrid({ allDeals }: { allDeals: Deal[] }) {
  const [mounted, setMounted] = useState(false);
  // Sync DOM hydration state — legitimate mount guard pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  const { savedSlugs } = useSavedDeals();
  const savedDeals = allDeals.filter((d) => savedSlugs.includes(d.slug));

  if (!mounted) return null;

  if (savedSlugs.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-zinc-400 text-[15px] mb-2">No saved deals yet</p>
        <p className="text-[13px] text-zinc-600 mb-4">
          Tap the heart icon on any deal to save it here.
        </p>
        <Link href="/deals" className="btn-primary text-[13px]">
          Browse Deals →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {savedDeals.map((deal) => (
        <div key={deal.slug} className="card p-4">
          <div className="flex items-start gap-3">
            <Link
              href={`/deals/${deal.slug}`}
              className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden"
            >
              <Image src={deal.logo} alt={deal.name} width={24} height={24} className="object-contain" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/deals/${deal.slug}`}
                  className="text-sm font-semibold text-zinc-200 hover:text-orange-400 transition-colors"
                >
                  {deal.name}
                </Link>
                {/* Always show status badge; default to "verified" if not set in Notion */}
                <DealStatusBadge status={deal.status ?? "verified"} />
                <span className="value-pill text-[11px]">{deal.value}</span>
              </div>
              <div className="mt-1.5">
                <RemindButton slug={deal.slug} name={deal.name} />
              </div>
            </div>
            <Link
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-[12px] px-3 py-1.5 shrink-0"
            >
              Claim →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
