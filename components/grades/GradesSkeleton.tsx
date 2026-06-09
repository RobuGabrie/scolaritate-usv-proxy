export function GradesSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-14 sm:pt-6 pb-4 border-b border-border shrink-0">
        <div className="h-7 w-32 rounded-lg bg-muted mb-3" />
        <div className="flex gap-2">
          <div className="h-7 w-20 rounded-xl bg-muted" />
          <div className="h-7 w-20 rounded-xl bg-muted" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 py-4">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              <div className="h-4 rounded bg-muted" style={{ width: `${40 + (i % 3) * 15}%` }} />
              <div className="h-4 w-10 rounded bg-muted ml-auto" />
              <div className="h-4 w-8 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
