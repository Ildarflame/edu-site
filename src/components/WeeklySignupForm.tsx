"use client";

import { useState } from "react";

export default function WeeklySignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency: "weekly", interests: [] }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return <p className="text-[12px] text-emerald-400 font-medium">You&apos;re in ✓</p>;
  }

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[12px] text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/30 w-40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary text-[12px] px-3 py-1.5 shrink-0"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-[11px] text-red-400 mt-1">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
