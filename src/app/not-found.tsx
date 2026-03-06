import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-extrabold text-zinc-800 mb-4">404</p>
      <h1 className="text-xl font-bold text-zinc-100 mb-2">Page not found</h1>
      <p className="text-[14px] text-zinc-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="btn-primary px-6 py-2.5 text-[14px]">
          Go home
        </Link>
        <Link href="/deals" className="btn-ghost px-6 py-2.5 text-[14px]">
          Browse deals
        </Link>
      </div>
    </main>
  );
}
