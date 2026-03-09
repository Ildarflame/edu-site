"use client";

import { useMemo, useEffect, useState } from "react";
import DealCard from "./DealCard";
import type { Deal, Category } from "@/data/deals";

function getPrefs(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = document.cookie.split(";").find((c) => c.trim().startsWith("sp_prefs="));
    if (!raw) return [];
    return JSON.parse(decodeURIComponent(raw.split("=")[1])) as Category[];
  } catch {
    return [];
  }
}

export function trackCategory(category: Category) {
  if (typeof window === "undefined") return;
  const prefs = getPrefs();
  const updated = [category, ...prefs.filter((c) => c !== category)].slice(0, 5);
  document.cookie = `sp_prefs=${encodeURIComponent(JSON.stringify(updated))};path=/;max-age=${60 * 60 * 24 * 90};SameSite=Strict`;
}

export default function RecommendedDeals({ deals }: { deals: Deal[] }) {
  const [prefs, setPrefs] = useState<Category[]>([]);

  // Reading from cookies (external system) on mount — legitimate sync pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPrefs(getPrefs()); }, []);

  const recommended = useMemo(() => {
    if (prefs.length === 0) return [];
    return deals.filter((d) => prefs.includes(d.category)).slice(0, 4);
  }, [deals, prefs]);

  if (recommended.length < 2) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="section-label mb-2">For you</p>
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-8">Recommended Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 stagger-grid">
        {recommended.map((deal) => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>
    </section>
  );
}
