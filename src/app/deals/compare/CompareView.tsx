"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Deal, CATEGORY_CONFIG, AUDIENCE_LABELS } from "@/data/deals";

export default function CompareView({ allDeals }: { allDeals: Deal[] }) {
  const searchParams = useSearchParams();
  const slugs = (searchParams.get("deals") ?? "").split(",").filter(Boolean);
  const deals = slugs.map((s) => allDeals.find((d) => d.slug === s)).filter(Boolean) as Deal[];

  if (deals.length < 2) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-[15px]">Select at least 2 deals to compare</p>
        <Link href="/deals" className="text-orange-400 text-[13px] hover:underline mt-2 inline-block">
          Back to deals
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (deal: Deal) => React.ReactNode }[] = [
    {
      label: "Logo",
      render: (deal) => (
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto">
          <Image src={deal.logo} alt={deal.name} width={36} height={36} />
        </div>
      ),
    },
    {
      label: "Name",
      render: (deal) => (
        <Link href={`/deals/${deal.slug}`} className="text-zinc-100 font-semibold text-[14px] hover:text-orange-400 transition-colors">
          {deal.name}
        </Link>
      ),
    },
    {
      label: "Category",
      render: (deal) => (
        <span className="text-[13px] text-zinc-400">
          {CATEGORY_CONFIG[deal.category].icon} {deal.category}
        </span>
      ),
    },
    {
      label: "Value",
      render: (deal) => (
        <span className="text-[13px] font-bold text-orange-400">{deal.value}</span>
      ),
    },
    {
      label: "Audiences",
      render: (deal) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {deal.audiences.map((a) => (
            <span key={a} className="text-[11px] bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 text-zinc-400">
              {AUDIENCE_LABELS[a]}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Description",
      render: (deal) => (
        <p className="text-[12px] text-zinc-500 leading-relaxed">{deal.tagline}</p>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr>
            <th className="text-left text-[12px] font-medium text-zinc-600 py-3 px-4 w-32"></th>
            {deals.map((deal) => (
              <th key={deal.slug} className="text-center py-3 px-4">
                <span className="text-[13px] font-semibold text-zinc-300">{deal.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-white/[0.04]">
              <td className="text-[12px] font-medium text-zinc-600 py-4 px-4 align-middle">{row.label}</td>
              {deals.map((deal) => (
                <td key={deal.slug} className="text-center py-4 px-4 align-middle">
                  {row.render(deal)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 text-center">
        <Link href="/deals" className="text-[13px] text-zinc-500 hover:text-orange-400 transition-colors underline underline-offset-2">
          Back to all deals
        </Link>
      </div>
    </div>
  );
}
