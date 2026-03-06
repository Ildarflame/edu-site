"use client";

import { useState } from "react";
import { CATEGORY_CONFIG } from "@/data/deals";
import type { Category } from "@/data/deals";

const categories = Object.keys(CATEGORY_CONFIG) as Category[];
const audienceOptions = ["Students", "Startups", "Open Source"];

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [audiences, setAudiences] = useState<string[]>([]);

  const toggleAudience = (a: string) => {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Deal Name: ${name}\nURL: ${url}\nCategory: ${category}\nAudiences: ${audiences.join(", ")}\n\nDescription:\n${description}`;
    window.location.href = `mailto:deals@studentperks.dev?subject=${encodeURIComponent(`New Deal: ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-[14px] text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-orange-500/30 transition-colors";

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <p className="section-label mb-2">Contribute</p>
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">Submit a Deal</h1>
      <p className="text-[14px] text-zinc-600 mb-8">
        Know a free tool or perk for students, startups, or open source? Let us know.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Deal name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. GitHub Education" className={inputClass} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">URL</label>
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Category</label>
          <select required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="" className="bg-zinc-900">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900">{CATEGORY_CONFIG[cat].icon} {cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Audience</label>
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
          <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What does this deal offer?" className={inputClass} />
        </div>

        <button type="submit" className="btn-primary px-7 py-2.5 text-[14px] w-full">
          Submit deal
        </button>
      </form>
    </main>
  );
}
