"use client";

import { useEffect } from "react";
import { trackCategory } from "./RecommendedDeals";
import type { Category } from "@/data/deals";

export default function CategoryTracker({ category }: { category: Category }) {
  useEffect(() => { trackCategory(category); }, [category]);
  return null;
}
