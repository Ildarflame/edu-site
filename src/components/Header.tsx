"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/student-discount", label: "Student Discounts" },
];

const toolsDropdown = [
  { href: "/student-freebies-finder", label: "Freebies Finder", desc: "Personalized tool recommendations" },
  { href: "/free-tools-for-students", label: "100+ Free Tools", desc: "Complete student tools list" },
  { href: "/savings-calculator", label: "Savings Calculator", desc: "See how much you save" },
  { href: "/this-week", label: "This Week", desc: "Latest deals & updates" },
  { href: "/discover", label: "AI Deal Finder", desc: "Search deals by keyword" },
  { href: "/stack", label: "Stack Builder", desc: "Build your tech stack" },
];

const rightLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/submit", label: "Submit" },
];

const allMobileLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/student-discount", label: "Student Discounts" },
  { href: "/student-freebies-finder", label: "Freebies Finder" },
  { href: "/free-tools-for-students", label: "100+ Free Tools" },
  { href: "/savings-calculator", label: "Savings Calculator" },
  { href: "/this-week", label: "This Week" },
  { href: "/discover", label: "AI Deal Finder" },
  { href: "/stack", label: "Stack Builder" },
  { href: "/blog", label: "Blog" },
  { href: "/submit", label: "Submit a Deal" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

          {/* Tools dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 inline-flex items-center gap-1 ${
                toolsOpen ? "text-zinc-200 bg-white/[0.04]" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              Tools
              <svg className={`w-3 h-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-white/[0.06] py-2 shadow-xl" style={{ background: "rgba(12, 12, 14, 0.98)", backdropFilter: "blur(20px)" }}>
                {toolsDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setToolsOpen(false)}
                    className="block px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-[13px] font-medium text-zinc-200">{item.label}</span>
                    <span className="block text-[11px] text-zinc-600 mt-0.5">{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {rightLinks.map((link) => (
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
          {allMobileLinks.map((link) => (
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
