"use client";

import { useState } from "react";
import { CATEGORY_CONFIG } from "@/data/deals";
import type { Category } from "@/data/deals";

const categories = Object.keys(CATEGORY_CONFIG) as Category[];
const audienceOptions = ["Students", "Startups", "Open Source"];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [audiences, setAudiences] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleAudience = (a: string) => {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      new URL(url);
    } catch {
      setStatus("error");
      setErrorMsg("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    if (audiences.length === 0) {
      setStatus("error");
      setErrorMsg("Please select at least one audience");
      return;
    }

    try {
      const res = await fetch("/api/submit-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, category, audiences, description, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
      setName("");
      setUrl("");
      setDescription("");
      setCategory("");
      setAudiences([]);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-[14px] text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-orange-500/30 transition-colors";

  if (status === "success") {
    return (
      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Deal submitted!</h2>
          <p className="text-[14px] text-zinc-500 mb-6">
            Thanks for your submission. We will review it and add it to the site soon.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-[13px] text-orange-400 hover:underline"
          >
            Submit another deal
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <p className="section-label mb-2">Contribute</p>
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">Submit a Deal</h1>
      <p className="text-[14px] text-zinc-600 mb-8">
        Know a free tool or perk for students, startups, or open source? Let us know.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Deal name *</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. GitHub Education" className={inputClass} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">URL *</label>
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Category *</label>
          <select required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="" className="bg-zinc-900">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900">{CATEGORY_CONFIG[cat].icon} {cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Audience *</label>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all duration-150 ${
                  audiences.includes(a)
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : "bg-white/[0.02] text-zinc-600 border-white/[0.05] hover:text-zinc-400"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Description *</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What does this deal offer?" className={inputClass} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Your email *</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
        </div>

        {status === "error" && errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-[13px] text-red-400">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary px-7 py-2.5 text-[14px] w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Submitting..." : "Submit deal"}
        </button>
      </form>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.studentperks.dev" },
              { "@type": "ListItem", position: 2, name: "Submit a Deal" },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
