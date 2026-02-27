import Link from "next/link";

export default function BookNotFound() {
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink mb-2">
          Book Not Found
        </h1>
        <p className="text-warm-gray mb-6">
          We couldn&apos;t find this book in our library. It may have been
          removed or the link may be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/search" className="btn-primary text-sm">
            Browse All Books
          </Link>
          <Link href="/" className="btn-secondary text-sm">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
