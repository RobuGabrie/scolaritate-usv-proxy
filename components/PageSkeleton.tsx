export function PageSkeleton() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 border-b border-border shrink-0">
        <div className="h-7 w-32 rounded-lg bg-muted mb-2" />
        <div className="h-4 w-56 rounded bg-muted" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 py-6">
        <div className="space-y-3 max-w-2xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted" style={{ width: `${100 - (i % 3) * 8}%` }} />
          ))}
        </div>
      </div>
    </main>
  );
}
