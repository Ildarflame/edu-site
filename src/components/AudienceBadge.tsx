import { Audience, AUDIENCE_LABELS } from "@/data/deals";

export default function AudienceBadge({ audience }: { audience: Audience }) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.03] text-zinc-500 border border-white/[0.05]">
      {AUDIENCE_LABELS[audience]}
    </span>
  );
}
