"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import DealsGrid from "./DealsGrid";
import type { Deal } from "@/data/deals";

export default function DealsGridWithOnboarding({ deals }: { deals: Deal[] }) {
  const { state } = useOnboarding();
  return (
    <DealsGrid
      deals={deals}
      initialAudience={state.completed && state.audience ? state.audience : undefined}
      initialCategory={state.completed && state.category ? state.category : undefined}
    />
  );
}
