"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

const REPORTED_PREFIX = "sp_reported_";

// Module-level store for reported slugs — follows useSyncExternalStore pattern
// (CLAUDE.md: never seed useState from localStorage directly; use useSyncExternalStore)
let reportedCache: Record<string, boolean> = {};
let listeners: (() => void)[] = [];

function subscribe(key: string, listener: () => void) {
  // Eagerly warm the cache for this key before the first snapshot read.
  // This must happen in subscribe (not in getSnapshot) so that getSnapshot
  // stays pure and free of side-effects.
  if (reportedCache[key] === undefined && typeof window !== "undefined") {
    reportedCache = {
      ...reportedCache,
      [key]: localStorage.getItem(key) === "1",
    };
  }
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
// readReported is no longer needed — cache is warmed in subscribe.

export default function ReportButton({ slug }: { slug: string }) {
  const reportedKey = `${REPORTED_PREFIX}${slug}`;

  const store = useSyncExternalStore(
    // Bind the key so subscribe can warm the cache before the first snapshot.
    useCallback((listener) => subscribe(reportedKey, listener), [reportedKey]),
    getSnapshot,
    getServerSnapshot,
  );
  // Pure snapshot read — cache was warmed in subscribe before this runs.
  const alreadyReported = store[reportedKey] ?? false;

  const [loading, setLoading] = useState(false);

  const handleReport = useCallback(async () => {
    if (alreadyReported || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/report-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        markReported(reportedKey);
      }
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
