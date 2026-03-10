"use client";

import { useState, useEffect } from "react";

export default function SaveButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    const timer = setTimeout(() => setAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [animating]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnimating(true);
        onToggle();
      }}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 ${
        saved
          ? "text-red-400 bg-red-500/10"
          : "text-zinc-600 hover:text-red-400 bg-white/[0.03] hover:bg-red-500/10"
      } ${animating ? "scale-125" : ""}`}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
