export const metadata = {
  title: "Offline — StudentPerks",
};

export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-2">You&apos;re offline</h1>
      <p className="text-[14px] text-zinc-500 max-w-sm">
        It looks like you&apos;ve lost your internet connection. Please check your connection and try again.
      </p>
    </main>
  );
}
