"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "saved-deals";

function getSnapshot(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
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
    emitChange();
  }, []);

  const isSaved = useCallback(
    (slug: string) => savedSlugs.includes(slug),
    [savedSlugs]
  );

  return { savedSlugs, toggle, isSaved, count: savedSlugs.length };
}
