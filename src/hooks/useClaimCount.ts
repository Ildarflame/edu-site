"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "claim-counts";

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getBaseCount(slug: string): number {
  return 50 + (hashCode(slug) % 450);
}

function getStored(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useClaimCount(slug: string) {
  const [count, setCount] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const stored = getStored();
    const increment = stored[slug] || 0;
    setCount(getBaseCount(slug) + increment);
    setClaimed(increment > 0);
  }, [slug]);

  const increment = useCallback(() => {
    const stored = getStored();
    if (stored[slug]) return;
    stored[slug] = 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setCount((prev) => prev + 1);
    setClaimed(true);
  }, [slug]);

  return { count, increment, claimed };
}
