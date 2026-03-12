"use client";

import { useState } from "react";
import { dismissPopup } from "@/hooks/useDismissedPopup";

export default function DealViewPopup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function handleDismiss() {
    dismissPopup();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency: "weekly", interests: [] }),
      });
      setStatus("done");
      setTimeout(dismissPopup, 2000);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 z-50 w-[300px] card p-5 shadow-xl shadow-black/40 animate-in">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {status === "done" ? (
        <div className="text-center py-2">
          <div className="text-emerald-400 font-semibold text-[14px] mb-1">You&apos;re in!</div>
          <p className="text-[12px] text-zinc-600">New deals hit your inbox weekly.</p>
        </div>
      ) : (
        <>
          <p className="text-[13px] font-semibold text-zinc-200 mb-1 pr-5">Get new deals weekly</p>
          <p className="text-[12px] text-zinc-600 mb-3">Free, no spam, unsubscribe anytime.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/40 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary py-2 text-[12px] text-center"
            >
              {status === "loading" ? "Subscribing…" : "Get Weekly Deals →"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
