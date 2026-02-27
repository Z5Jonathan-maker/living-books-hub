"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

export function SearchBar(props: { large?: boolean; placeholder?: string }) {
  return (
    <Suspense
      fallback={
        <SearchBarFallback
          large={props.large}
          placeholder={props.placeholder}
        />
      }
    >
      <SearchBarInner {...props} />
    </Suspense>
  );
}

function SearchBarFallback({
  large = false,
  placeholder = "Search by title, author, or topic...",
}: {
  large?: boolean;
  placeholder?: string;
}) {
  return (
    <form className="w-full">
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/50 ${large ? "w-6 h-6" : "w-5 h-5"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          className={`input ${large ? "pl-14 pr-32 py-5 text-lg" : "pl-12 pr-24 py-3 text-sm"} rounded-xl shadow-lg border-ink/5 focus:shadow-xl`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 btn-primary ${large ? "px-6 py-3" : "px-4 py-2 text-sm"} rounded-lg`}
        >
          Search
        </button>
      </div>
    </form>
  );
}

function SearchBarInner({
  large = false,
  placeholder = "Search by title, author, or topic...",
}: {
  large?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/search");
      }
    },
    [query, router],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/50 ${large ? "w-6 h-6" : "w-5 h-5"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`input ${large ? "pl-14 pr-32 py-5 text-lg" : "pl-12 pr-24 py-3 text-sm"} rounded-xl shadow-lg border-ink/5 focus:shadow-xl`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 btn-primary ${large ? "px-6 py-3" : "px-4 py-2 text-sm"} rounded-lg`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
