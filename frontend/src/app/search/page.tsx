import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { searchBooks, getFilterOptions } from "@/lib/api";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Books",
  description:
    "Search and filter the world's best living books by age, subject, reading level, time period, and more.",
  alternates: {
    canonical: "/search",
  },
};

async function SearchResults({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params: Record<string, string> = {};
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.age_range) params.age_range = searchParams.age_range;
  if (searchParams.subject) params.subject = searchParams.subject;
  if (searchParams.time_period) params.time_period = searchParams.time_period;
  if (searchParams.region) params.region = searchParams.region;
  if (searchParams.reading_level)
    params.reading_level = searchParams.reading_level;
  if (searchParams.sort) params.sort = searchParams.sort;
  if (searchParams.page) params.page = searchParams.page;
  params.per_page = "24";

  try {
    const [results, filters] = await Promise.all([
      searchBooks(params),
      getFilterOptions(),
    ]);

    return (
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter drawer */}
          <div className="lg:hidden mb-4">
            <MobileFilterDrawer filters={filters} />
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-warm-gray">
              <span className="font-medium text-ink">{results.total}</span>{" "}
              {results.total === 1 ? "book" : "books"} found
              {searchParams.q && (
                <>
                  {" "}
                  for &ldquo;
                  <span className="font-medium text-ink">
                    {searchParams.q}
                  </span>
                  &rdquo;
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-warm-gray">Sort:</span>
              <div className="flex gap-1">
                {[
                  { value: "popularity", label: "Popular" },
                  { value: "title", label: "A-Z" },
                  { value: "newest", label: "Newest" },
                ].map((opt) => {
                  const isActive =
                    (searchParams.sort || "popularity") === opt.value;
                  const sortParams = new URLSearchParams(searchParams);
                  sortParams.set("sort", opt.value);
                  return (
                    <Link
                      key={opt.value}
                      href={`/search?${sortParams.toString()}`}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        isActive
                          ? "bg-forest text-white"
                          : "bg-ink/5 text-warm-gray hover:bg-ink/10"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Book grid */}
          {results.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {results.items.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {results.pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: Math.min(results.pages, 10) }, (_, i) => {
                    const page = i + 1;
                    const pageParams = new URLSearchParams(searchParams);
                    pageParams.set("page", String(page));
                    const isActive = results.page === page;
                    return (
                      <Link
                        key={page}
                        href={`/search?${pageParams.toString()}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-forest text-white"
                            : "bg-white border border-ink/10 text-warm-gray hover:bg-ink/5"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-parchment flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-warm-gray/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-serif font-bold text-ink">
                No books found
              </h3>
              <p className="mt-2 text-sm text-warm-gray">
                Try adjusting your search or filters.
              </p>
              <Link href="/search" className="btn-secondary mt-4 text-sm">
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-warm-gray">
          Unable to load books. Please ensure the API is running.
        </p>
      </div>
    );
  }
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <SearchBar />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
