import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                <span className="text-sm font-black text-black">E</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EduDeals</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              The best free tools, credits, and perks — curated for students, startups, and open source builders.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Navigate</h4>
            <div className="space-y-3">
              {[
                { href: "/deals", label: "All Deals" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-zinc-400 hover:text-orange-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {["Dev", "AI", "SaaS", "Learning", "Cloud", "Design"].map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-500 border border-white/[0.06]"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.06] text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} EduDeals. Built for builders.
        </div>
      </div>
    </footer>
  );
}
