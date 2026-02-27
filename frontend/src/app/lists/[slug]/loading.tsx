export default function ListLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
      <div className="max-w-3xl mb-12">
        <div className="h-6 w-20 bg-parchment rounded-full mb-4" />
        <div className="h-10 bg-parchment rounded w-2/3 mb-4" />
        <div className="h-5 bg-parchment rounded w-full" />
        <div className="h-5 bg-parchment rounded w-3/4 mt-2" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-5 p-5 bg-white rounded-xl border border-ink/5">
            <div className="w-8 h-8 rounded-full bg-parchment" />
            <div className="w-16 h-20 bg-parchment rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-parchment rounded w-1/2" />
              <div className="h-4 bg-parchment rounded w-1/3" />
              <div className="h-4 bg-parchment rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
