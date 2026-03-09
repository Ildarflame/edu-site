import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Free Developer Tool Guides & Tips 2026 | StudentPerks",
  description: "Get step-by-step guides to claim free developer tools, cloud credits, and student discounts from GitHub, AWS, and more. Updated for 2026.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <p className="section-label mb-2">Blog</p>
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-1">
        Guides & Tips
      </h1>
      <p className="text-[14px] text-zinc-600 mb-10">How to get the most out of free perks</p>

      {posts.length === 0 ? (
        <p className="text-zinc-700 text-[14px]">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group block p-5"
            >
              <div className="flex items-center gap-2.5 text-[11px] text-zinc-700 mb-2.5">
                <time className="font-medium">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</time>
                {post.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded text-zinc-600">{tag}</span>
                ))}
              </div>
              <h2 className="text-[15px] font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                {post.title}
              </h2>
              <p className="mt-1.5 text-[13px] text-zinc-600 leading-relaxed">{post.description}</p>
            </Link>
          ))}
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://studentperks.dev" },
              { "@type": "ListItem", position: 2, name: "Blog" },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
