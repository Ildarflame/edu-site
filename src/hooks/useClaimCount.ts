"use client";

import { useCallback, useSyncExternalStore } from "react";

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
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

let listeners: (() => void)[] = [];
function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
function emitChange() {
  listeners.forEach((l) => l());
}

export function useClaimCount(slug: string) {
  const stored = useSyncExternalStore(
    subscribe,
    () => getStored()[slug] || 0,
    () => 0
  );

  const count = getBaseCount(slug) + stored;
  const claimed = stored > 0;

  const increment = useCallback(() => {
    const all = getStored();
    if (all[slug]) return;
    all[slug] = 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    emitChange();
  }, [slug]);

  return { count, increment, claimed };
}
