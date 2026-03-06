import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — EduDeals",
  description: "Guides, tips, and roundups to help you get the most out of student and startup perks.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Blog
        </span>
      </h1>
      <p className="text-gray-500 mb-10">Guides and tips for getting the best deals</p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
