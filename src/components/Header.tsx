"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/student-freebies-finder", label: "Freebies Finder" },
  { href: "/discover", label: "Discover" },
  { href: "/stack", label: "Stack Builder" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: "rgba(5, 5, 7, 0.85)", backdropFilter: "blur(20px) saturate(1.8)" }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-[13px] focus:font-medium"
      >
        Skip to main content
      </a>
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]">
            <defs>
              <linearGradient id="hdr-bolt" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#f59e0b"/>
              </linearGradient>
            </defs>
            <path d="M18.5 3L8 18h7l-2 11L25 14h-7l2-11z" fill="url(#hdr-bolt)" stroke="url(#hdr-bolt)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
