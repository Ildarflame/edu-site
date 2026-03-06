"use client";

import { useState } from "react";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className={`text-emerald-400 ${compact ? "text-[12px]" : "text-[14px]"}`}>
        You&apos;re in! We&apos;ll send you the best deals.
      </p>
    );
  }

  return (
    <div className={compact ? "" : "max-w-md"}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={`flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-orange-500/30 transition-colors ${compact ? "py-1.5 text-[12px]" : "py-2.5 text-[14px]"}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`btn-primary shrink-0 ${compact ? "px-4 py-1.5 text-[12px]" : "px-6 py-2.5 text-[14px]"}`}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="text-red-400 text-[12px] mt-1" role="alert">Something went wrong. Please try again.</p>}
    </div>
  );
}
