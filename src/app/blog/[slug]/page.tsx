import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | EduDeals Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-sm text-zinc-600 mb-8 font-medium">
        <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="text-zinc-400">{post.title}</span>
      </nav>

      <article>
        <header className="mb-10">
          <time className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3">{post.title}</h1>
          <div className="mt-4 flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-md text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-orange-400 hover:prose-a:text-orange-300 prose-strong:text-zinc-200 prose-li:text-zinc-400 prose-code:text-orange-300 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/[0.06] prose-hr:border-white/[0.06]">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-white/[0.06]">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-orange-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </main>
  );
}
