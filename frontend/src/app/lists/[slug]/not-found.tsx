import Link from "next/link";

export default function ListNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-parchment flex items-center justify-center">
          <svg
            className="w-8 h-8 text-warm-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink mb-2">
          Collection Not Found
        </h1>
        <p className="text-warm-gray mb-6">
          We couldn&apos;t find this collection. It may have been removed or the
          link may be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/lists" className="btn-primary text-sm">
            Browse All Collections
          </Link>
          <Link href="/" className="btn-secondary text-sm">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
