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

const VALID_AUDIENCES = new Set<string>(["students", "startups", "opensource"]);
const VALID_CATEGORIES = new Set<string>(["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"]);

function validateState(parsed: unknown): OnboardingState {
  if (typeof parsed !== "object" || parsed === null) return DEFAULT_STATE;
  const p = parsed as Record<string, unknown>;
  return {
    audience: VALID_AUDIENCES.has(p.audience as string) ? (p.audience as Audience) : null,
    category: VALID_CATEGORIES.has(p.category as string) ? (p.category as Category) : null,
    completed: typeof p.completed === "boolean" ? p.completed : false,
  };
}

let cachedRaw: string | null = null;
let cachedSnapshot: OnboardingState = DEFAULT_STATE;

function getSnapshot(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  const raw = localStorage.getItem(STORAGE_KEY) ?? "{}";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSnapshot = validateState(JSON.parse(raw));
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
  const updated = { ...cachedSnapshot, ...next };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  cachedRaw = null; // invalidate cache so next read re-parses
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

  const selectCategory = useCallback((category: Category) => {
    saveState({ category, completed: true });
  }, []);

  const skip = useCallback(() => {
    saveState({ ...DEFAULT_STATE, completed: true });
  }, []);

  return { state, setAudience, setCategory, selectCategory, complete, skip };
}
