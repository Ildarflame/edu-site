"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sp_deal_views";

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

export function useDealViewCount(slug: string) {
  const viewed = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const track = useCallback(() => {
    const current = getSnapshot();
    if (current.includes(slug)) return;
    const updated = [...current, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    cachedRaw = null;
    emitChange();
  }, [slug]);

  return { viewCount: viewed.length, track };
}
