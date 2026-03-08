"use client";

import { useState, ReactNode } from "react";

type Props = {
  activeCount: number;
  children: ReactNode;
};

export default function MobileFilterDrawer({ activeCount, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/[0.06] rounded-t-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-zinc-100">Filters</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200 transition-colors" aria-label="Close filters">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
            <button onClick={() => setOpen(false)} className="btn-primary w-full py-2.5 text-[13px] mt-4">
              Show results
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:block">{children}</div>
    </>
  );
}
