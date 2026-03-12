"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import DealsGrid from "./DealsGrid";
import type { Deal } from "@/data/deals";

export default function DealsGridWithOnboarding({ deals }: { deals: Deal[] }) {
  const { state } = useOnboarding();
  const [mounted, setMounted] = useState(false);
  // Sync DOM hydration state — legitimate mount guard pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  // key forces DealsGrid to remount after hydration so useState initializers
  // run with the real localStorage values (not the SERVER_SNAPSHOT defaults)
  return (
    <DealsGrid
      key={mounted ? "personalized" : "default"}
      deals={deals}
      initialAudience={mounted && state.completed && state.audience ? state.audience : undefined}
      initialCategory={mounted && state.completed && state.category ? state.category : undefined}
    />
  );
}
