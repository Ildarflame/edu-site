"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Audience, Category } from "@/data/deals";

const STORAGE_KEY = "sp_onboarding";

type OnboardingState = {
  audience: Audience | null;
  category: Category | null;
  completed: boolean;
};

const DEFAULT_STATE: OnboardingState = {
  audience: null,
  category: null,
  completed: false,
};

let cachedRaw: string | null = null;
let cachedSnapshot: OnboardingState = DEFAULT_STATE;

function getSnapshot(): OnboardingState {
  const raw = localStorage.getItem(STORAGE_KEY) ?? "{}";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw);
      cachedSnapshot = { ...DEFAULT_STATE, ...parsed };
    } catch {
      cachedSnapshot = DEFAULT_STATE;
    }
  }
  return cachedSnapshot;
}

// Module-level constant — must NOT be an inline literal
const SERVER_SNAPSHOT: OnboardingState = DEFAULT_STATE;

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

function saveState(next: Partial<OnboardingState>) {
  const updated = { ...getSnapshot(), ...next };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  cachedRaw = null;
  emitChange();
}

export function useOnboarding() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

  const setAudience = useCallback((audience: Audience) => {
    saveState({ audience });
  }, []);

  const setCategory = useCallback((category: Category) => {
    saveState({ category });
  }, []);

  const complete = useCallback(() => {
    saveState({ completed: true });
  }, []);

  const skip = useCallback(() => {
    saveState({ ...DEFAULT_STATE, completed: true });
  }, []);

  return { state, setAudience, setCategory, complete, skip };
}
