"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/discover", label: "Discover" },
  { href: "/stack", label: "Stack Builder" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: "rgba(5, 5, 7, 0.85)", backdropFilter: "blur(20px) saturate(1.8)" }}>
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-[11px] font-black text-white leading-none">S</span>
          </div>
          <span className="text-[15px] font-semibold text-zinc-100 tracking-tight">
            StudentPerks
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-white/[0.04] transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/[0.06] mx-3" />
          <Link
            href="/deals"
            className="btn-primary px-4 py-1.5 text-[13px]"
          >
            Get Deals
          </Link>
        </div>

        <button
          className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors rounded-md hover:bg-white/[0.04]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.04] px-6 py-3 space-y-0.5" style={{ background: "rgba(5, 5, 7, 0.95)" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-white/[0.04] transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
