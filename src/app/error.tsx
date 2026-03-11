"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-zinc-100 mb-3">Something went wrong</h1>
      <p className="text-[15px] text-zinc-500 mb-6">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button onClick={reset} className="btn-primary px-6 py-2.5 text-[14px]">
        Try again
      </button>
    </main>
  );
}
