import { Audience, AUDIENCE_LABELS } from "@/data/deals";

export default function AudienceBadge({ audience }: { audience: Audience }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
      {AUDIENCE_LABELS[audience]}
    </span>
  );
}
