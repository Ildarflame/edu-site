"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useState } from "react";

const REPORTED_PREFIX = "sp_reported_";

// Module-level store for reported slugs — follows useSyncExternalStore pattern
// (CLAUDE.md: never seed useState from localStorage directly; use useSyncExternalStore)
let reportedCache: Record<string, boolean> = {};
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
function getSnapshot(): Record<string, boolean> {
  return reportedCache;
}
function getServerSnapshot(): Record<string, boolean> {
  return {};
}
function markReported(key: string) {
  localStorage.setItem(key, "1");
  reportedCache = { ...reportedCache, [key]: true };
  emitChange();
}
function readReported(key: string): boolean {
  if (reportedCache[key] !== undefined) return reportedCache[key];
  const val = localStorage.getItem(key) === "1";
  reportedCache = { ...reportedCache, [key]: val };
  return val;
}

export default function ReportButton({ slug }: { slug: string }) {
  const reportedKey = `${REPORTED_PREFIX}${slug}`;

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Derive "done" from the store snapshot (hydration-safe — SSR returns {} so always false)
  const alreadyReported = store[reportedKey] ?? (typeof window !== "undefined" && readReported(reportedKey));

  const [loading, setLoading] = useState(false);

  const handleReport = useCallback(async () => {
    if (alreadyReported || loading) return;
    setLoading(true);
    try {
      await fetch("/api/report-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      markReported(reportedKey);
    } catch {
      // silently ignore network errors
    } finally {
      setLoading(false);
    }
  }, [alreadyReported, loading, slug, reportedKey]);

  if (alreadyReported) {
    return (
      <span className="text-[12px] text-zinc-700">
        Thanks for the report — we&apos;ll check it.
      </span>
    );
  }

  return (
    <button
      onClick={handleReport}
      disabled={loading}
      className="text-[12px] text-zinc-700 hover:text-zinc-500 transition-colors underline underline-offset-2 decoration-dotted"
    >
      {loading ? "Reporting…" : "Report broken deal"}
    </button>
  );
}
