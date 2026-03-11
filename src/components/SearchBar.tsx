"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search deals..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search deals"
        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/10 text-[13px] text-zinc-200 placeholder:text-zinc-700 transition-all"
      />
    </div>
  );
}
