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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
        Blog
      </h1>
      <p className="text-zinc-500 mb-10">Guides and tips for getting the best deals</p>

      {posts.length === 0 ? (
        <p className="text-zinc-600">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-4 stagger">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-glow block group bg-[#111113] rounded-xl border border-white/[0.06] p-6"
            >
              <div className="flex items-center gap-3 text-xs text-zinc-600 mb-3">
                <time className="font-medium">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md">{tag}</span>
                  ))}
                </div>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
