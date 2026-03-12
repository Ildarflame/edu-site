"use client";

export default function ClaimCounter({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <p className="text-[12px] text-zinc-600 mt-1.5">
      <span className="text-zinc-500 font-medium">{count.toLocaleString()}</span> students saved this
    </p>
  );
}
