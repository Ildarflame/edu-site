"use client";

import { useSyncExternalStore } from "react";

export const DISMISSED_KEY = "sp_popup_dismissed";

let cachedDismissed = false;
let cachedDismissedRaw: string | null = null;

function getSnapshot(): boolean {
  const raw = localStorage.getItem(DISMISSED_KEY) ?? "0";
  if (raw !== cachedDismissedRaw) {
    cachedDismissedRaw = raw;
    cachedDismissed = raw === "1";
  }
  return cachedDismissed;
}

const listeners: (() => void)[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function dismissPopup() {
  try {
    localStorage.setItem(DISMISSED_KEY, "1");
    cachedDismissedRaw = null;
    listeners.forEach((l) => l());
  } catch {}
}

export function usePopupDismissed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
