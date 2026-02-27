export default function ListsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-12">
        <div className="h-8 w-64 bg-ink/5 rounded-lg animate-pulse mx-auto" />
        <div className="h-4 w-96 max-w-full bg-ink/5 rounded animate-pulse mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="w-12 h-12 rounded-xl bg-ink/5 animate-pulse" />
            <div className="h-5 w-3/4 bg-ink/5 rounded animate-pulse mt-4" />
            <div className="h-3 w-full bg-ink/5 rounded animate-pulse mt-3" />
            <div className="h-3 w-2/3 bg-ink/5 rounded animate-pulse mt-2" />
            <div className="h-3 w-20 bg-ink/5 rounded animate-pulse mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
