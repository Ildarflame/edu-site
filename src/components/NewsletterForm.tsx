"use client";

import { useState } from "react";

const INTERESTS = [
  { id: "students", label: "Students" },
  { id: "startups", label: "Startups" },
  { id: "opensource", label: "Open Source" },
] as const;

const FREQUENCIES = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
] as const;

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<string>("weekly");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const toggleInterest = (id: string) => {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency, interests }),
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
      <div className={`text-center ${compact ? "py-2" : "py-6"}`}>
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className={`text-emerald-400 font-semibold ${compact ? "text-[13px]" : "text-[15px]"}`}>
          You&apos;re in! We&apos;ll send you the best deals.
        </p>
        <p className="text-zinc-600 text-[12px] mt-1">Check your inbox for a confirmation.</p>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "max-w-lg"}>
      {!compact && (
        <div className="mb-4">
          <p className="text-[12px] text-orange-400/80 font-semibold uppercase tracking-wider mb-1">Free newsletter</p>
          <h3 className="text-lg font-bold text-zinc-100">Get the best deals in your inbox</h3>
          <p className="text-[13px] text-zinc-500 mt-1">Join 500+ developers who get weekly updates on free tools and perks.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
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
        </div>

        {!compact && (
          <>
            {/* Frequency */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-zinc-500 font-medium">Frequency:</span>
              <div className="flex gap-1.5">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id)}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      frequency === f.id
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                        : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[12px] text-zinc-500 font-medium">Interests:</span>
              <div className="flex gap-1.5">
                {INTERESTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      interests.includes(item.id)
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                        : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {status === "error" && (
          <p className="text-red-400 text-[12px]" role="alert">Something went wrong. Please try again.</p>
        )}

        {!compact && (
          <p className="text-[11px] text-zinc-700">No spam, unsubscribe anytime. We respect your privacy.</p>
        )}
      </form>
    </div>
  );
}
