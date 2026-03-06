import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-extrabold text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              EduDeals
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Discover free tools and perks for students, startups, and open
              source projects.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Links</h4>
            <div className="space-y-2">
              <Link href="/deals" className="block text-sm text-gray-500 hover:text-gray-700">Deals</Link>
              <Link href="/blog" className="block text-sm text-gray-500 hover:text-gray-700">Blog</Link>
              <Link href="/about" className="block text-sm text-gray-500 hover:text-gray-700">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {["Dev", "AI", "SaaS", "Learning", "Cloud", "Design", "Entertainment"].map((cat) => (
                <span key={cat} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} EduDeals. Made for students, by students.
        </div>
      </div>
    </footer>
  );
}
