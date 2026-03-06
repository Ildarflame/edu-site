import { Audience, AUDIENCE_LABELS } from "@/data/deals";

export default function AudienceBadge({ audience }: { audience: Audience }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
      {AUDIENCE_LABELS[audience]}
    </span>
  );
}
