import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-parchment flex items-center justify-center">
          <svg
            className="w-10 h-10 text-warm-gray/40"
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
        <h1 className="text-2xl font-serif font-bold text-ink">
          Page Not Found
        </h1>
        <p className="mt-2 text-warm-gray">
          This book seems to have wandered off the shelf.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/search" className="btn-secondary">
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
