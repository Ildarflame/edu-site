"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "saved-deals";

let cachedSnapshot: string[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSnapshot = JSON.parse(raw);
    } catch {
      cachedSnapshot = [];
    }
  }
  return cachedSnapshot;
}

const serverSnapshot: string[] = [];

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

export function useSavedDeals() {
  const savedSlugs = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const toggle = useCallback((slug: string) => {
    const current = getSnapshot();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    cachedRaw = null; // invalidate cache
    emitChange();
  }, []);

  const isSaved = useCallback(
    (slug: string) => savedSlugs.includes(slug),
    [savedSlugs]
  );

  return { savedSlugs, toggle, isSaved, count: savedSlugs.length };
}
