"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import type { Audience, Category } from "@/data/deals";

const AUDIENCES: { label: string; value: Audience; icon: string }[] = [
  { label: "Student", value: "students", icon: "🎓" },
  { label: "Startup", value: "startups", icon: "🚀" },
  { label: "Open Source", value: "opensource", icon: "💻" },
];

const CATEGORIES: { label: string; value: Category; icon: string }[] = [
  { label: "Dev", value: "Dev", icon: "🛠" },
  { label: "AI", value: "AI", icon: "🤖" },
  { label: "Cloud", value: "Cloud", icon: "🌐" },
  { label: "Design", value: "Design", icon: "🎨" },
  { label: "SaaS", value: "SaaS", icon: "☁️" },
];

export default function OnboardingWidget() {
  const { state, setAudience, selectCategory, skip } = useOnboarding();
  // Prevent SSR flash: do not render until client-side hydration is complete.
  // Without this, returning users (completed: true in localStorage) see the widget
  // briefly on every page load because the server renders with SERVER_SNAPSHOT (completed: false).
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || state.completed) return null;

  const step = state.audience ? 2 : 1;

  return (
    <div className="mt-8 max-w-sm mx-auto animate-in delay-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] text-zinc-600 uppercase tracking-wider font-medium">
            {step === 1 ? "Who are you?" : "What's your focus?"}
          </p>
          <button
            onClick={skip}
            aria-label="Skip onboarding"
            className="text-[11px] text-zinc-700 hover:text-zinc-500 transition-colors"
          >
            Skip →
          </button>
        </div>

        {step === 1 && (
          <div className="flex gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.value}
                onClick={() => setAudience(a.value)}
                className="flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-400 text-zinc-400 transition-all text-[12px] font-medium"
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => selectCategory(c.value)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-400 text-zinc-400 transition-all text-[12px] font-medium"
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
