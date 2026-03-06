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
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/blog" className="hover:text-purple-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{post.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{post.title}</h1>
          <div className="mt-3 flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-a:text-purple-600 hover:prose-a:text-purple-700">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link href="/blog" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
          &larr; Back to all posts
        </Link>
      </div>
    </main>
  );
}
