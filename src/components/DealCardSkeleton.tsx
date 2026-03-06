export default function DealCardSkeleton() {
  return (
    <div className="card block p-5 relative overflow-hidden animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-[10px] bg-white/[0.06]" />
        <div className="h-6 w-16 rounded-md bg-white/[0.06]" />
      </div>

      <div className="h-4 w-3/4 rounded bg-white/[0.06] mb-2" />
      <div className="h-3 w-full rounded bg-white/[0.04] mb-1" />
      <div className="h-3 w-2/3 rounded bg-white/[0.04]" />

      <div className="mt-3.5 flex gap-1.5">
        <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
        <div className="h-5 w-14 rounded-md bg-white/[0.06]" />
      </div>
    </div>
  );
}
