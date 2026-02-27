export default function BookLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 animate-pulse">
        {/* Cover skeleton */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] bg-parchment rounded-2xl" />
        </div>
        {/* Details skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-10 bg-parchment rounded w-3/4" />
          <div className="h-5 bg-parchment rounded w-1/3" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-20 bg-parchment rounded-full" />
            <div className="h-6 w-24 bg-parchment rounded-full" />
          </div>
          <div className="h-4 bg-parchment rounded w-full mt-6" />
          <div className="h-4 bg-parchment rounded w-full" />
          <div className="h-4 bg-parchment rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
