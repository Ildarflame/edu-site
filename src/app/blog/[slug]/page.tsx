import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | StudentPerks 2026`,
    description: post.description,
    alternates: { canonical: `https://studentperks.dev/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      url: `https://studentperks.dev/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <nav className="text-[13px] text-zinc-700 mb-8 font-medium">
        <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
        <span className="mx-2 text-zinc-800">/</span>
        <span className="text-zinc-500">{post.title}</span>
      </nav>

      <article>
        <header className="mb-10">
          <div className="flex items-center gap-2 text-[11px] text-zinc-700 mb-3">
            <time className="font-medium uppercase tracking-wider">
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {post.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded text-zinc-600">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">{post.title}</h1>
        </header>

        <div className="prose prose-invert prose-base max-w-none prose-headings:font-semibold prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-zinc-300 prose-li:text-zinc-400 prose-li:leading-relaxed prose-code:text-orange-300 prose-code:bg-white/[0.04] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/[0.06] prose-code:text-[13px] prose-hr:border-white/[0.06]">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: "StudentPerks" },
            publisher: { "@type": "Organization", name: "StudentPerks", url: "https://studentperks.dev" },
            mainEntityOfPage: `https://studentperks.dev/blog/${slug}`,
            keywords: post.tags,
          }).replace(/</g, "\\u003c"),
        }}
      />

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-white/[0.06]">
          <h2 className="text-lg font-bold text-zinc-100 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-4 hover:border-white/[0.12] transition-all">
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{p.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 pt-6 border-t border-white/[0.04]">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 hover:text-orange-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>
      </div>
    </main>
  );
}
