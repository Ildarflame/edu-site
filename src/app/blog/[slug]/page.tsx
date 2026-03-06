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
  return { title: `${post.title} | StudentPerks Blog`, description: post.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
