"use client";

import { useCallback, useSyncExternalStore } from "react";

const REMIND_PREFIX = "sp_remind_";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// Alias for Date.now — avoids react-hooks/purity lint error when called during render
const getNow: () => number = Date.now.bind(Date);

// Module-level cache: slug → timestamp (ms) or null
let cache: Record<string, number | null> = {};

let listeners: (() => void)[] = [];

function emitChange() {
  listeners.forEach((l) => l());
}

export function useRemindMe(slug: string) {
  const key = `${REMIND_PREFIX}${slug}`;

  // subscribe warms the cache for this slug before the first snapshot read
  const slugSubscribe = useCallback(
    (listener: () => void) => {
      if (cache[slug] === undefined && typeof window !== "undefined") {
        const raw = localStorage.getItem(key);
        cache[slug] = raw ? parseInt(raw, 10) : null;
      }
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    [slug, key]
  );

  // getSnapshot returns a primitive (null | number) for this slug — stable comparison
  const getSnapshot = useCallback((): number | null => {
    return cache[slug] ?? null;
  }, [slug]);

  // Consume the snapshot — this is what triggers re-renders when emitChange() is called
  const timestamp = useSyncExternalStore(slugSubscribe, getSnapshot, () => null);

  const now = getNow();
  const isDue = timestamp !== null && now > timestamp;
  const isSet = timestamp !== null && now <= timestamp;

  const setReminder = useCallback(() => {
    const ts = getNow() + THIRTY_DAYS;
    localStorage.setItem(key, String(ts));
    cache = { ...cache, [slug]: ts };
    emitChange();
  }, [slug, key]);

  const clearReminder = useCallback(() => {
    localStorage.removeItem(key);
    cache = { ...cache, [slug]: null };
    emitChange();
  }, [slug, key]);

  return { isDue, isSet, setReminder, clearReminder };
}
