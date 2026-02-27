"use client";

import Link from "next/link";

export default function BookError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-serif font-bold text-ink mb-2">
          Something went wrong
        </h1>
        <p className="text-warm-gray mb-6">
          We had trouble loading this book. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary text-sm">
            Try Again
          </button>
          <Link href="/search" className="btn-secondary text-sm">
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
