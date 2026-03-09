"use client";

import { memo, useMemo } from "react";

const pageBtn = "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all duration-150";
const pageBtnActive = "bg-orange-500/10 text-orange-400 border-orange-500/20";
const pageBtnInactive = "bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.1]";
const pageBtnDisabled = "bg-white/[0.01] text-zinc-800 border-white/[0.03] cursor-not-allowed";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default memo(function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Page navigation">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className={`${pageBtn} ${currentPage <= 1 ? pageBtnDisabled : pageBtnInactive}`}
        aria-label="Previous page"
      >
        Previous
      </button>
      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-zinc-700 text-[12px]">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${pageBtn} ${p === currentPage ? pageBtnActive : pageBtnInactive}`}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className={`${pageBtn} ${currentPage >= totalPages ? pageBtnDisabled : pageBtnInactive}`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
});
