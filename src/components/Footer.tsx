import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-[9px] font-black text-white">S</span>
              </div>
              <span className="text-[14px] font-semibold text-zinc-300">StudentPerks</span>
            </div>
            <p className="text-[13px] text-zinc-600 leading-relaxed">
              Free tools, credits, and pro plans for students, startups, and open source.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="section-label mb-3">Pages</p>
              <div className="space-y-2">
                {[
                  { href: "/deals", label: "Deals" },
                  { href: "/student-discount", label: "Student Discounts" },
                  { href: "/blog", label: "Blog" },
                  { href: "/about", label: "About" },
                  { href: "/submit", label: "Submit a Deal" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="section-label mb-3">Tools</p>
              <div className="space-y-2">
                {[
                  { href: "/student-freebies-finder", label: "Freebies Finder" },
                  { href: "/free-tools-for-students", label: "100+ Free Tools" },
                  { href: "/savings-calculator", label: "Savings Calculator" },
                  { href: "/this-week", label: "This Week" },
                  { href: "/discover", label: "AI Deal Finder" },
                  { href: "/stack", label: "Stack Builder" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="section-label mb-3">Categories</p>
              <div className="space-y-2">
                {["Dev", "AI", "Cloud", "Design"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/deals?category=${cat}`}
                    className="block text-[13px] text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-[13px] text-zinc-500 font-medium">Get deal alerts</p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.04] text-[12px] text-zinc-700">
          &copy; {new Date().getFullYear()} StudentPerks
        </div>
      </div>
    </footer>
  );
}
