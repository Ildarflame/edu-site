"use client";

import { useEffect } from "react";
import { useDealViewCount } from "@/hooks/useDealViewCount";
import { usePopupDismissed } from "@/hooks/useDismissedPopup";
import DealViewPopup from "./DealViewPopup";

export default function DealPageTracker({ slug }: { slug: string }) {
  const { viewCount, track } = useDealViewCount(slug);
  const dismissed = usePopupDismissed();

  useEffect(() => {
    track();
  }, [track]);

  if (dismissed || viewCount < 3) return null;
  return <DealViewPopup />;
}
