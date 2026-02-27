export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="h-12 bg-ink/5 rounded-xl animate-pulse" />
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-ink/5 rounded animate-pulse mb-2" />
              <div className="space-y-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-3 w-full bg-ink/5 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 w-32 bg-ink/5 rounded animate-pulse" />
            <div className="h-6 w-40 bg-ink/5 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[3/4] bg-ink/5 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 w-3/4 bg-ink/5 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-ink/5 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
