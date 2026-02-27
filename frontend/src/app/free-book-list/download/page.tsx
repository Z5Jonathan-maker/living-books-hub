import Link from "next/link";
import { searchBooks } from "@/lib/api";
import { PrintListButton } from "@/components/PrintListButton";
import type { BookSummary } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Free Living Books List — Print & Go",
  robots: { index: false, follow: false },
};

export default async function DownloadPage() {
  let books: BookSummary[];
  try {
    const result = await searchBooks({ sort: "popularity", per_page: "50" });
    books = result.items;
  } catch {
    books = [];
  }

  // Group by age range
  const ageGroups: Record<string, typeof books> = {};
  for (const book of books) {
    const range = book.age_range || "All Ages";
    if (!ageGroups[range]) ageGroups[range] = [];
    ageGroups[range].push(book);
  }

  const sortedGroups = Object.entries(ageGroups).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print-list">
      <div className="text-center mb-12 no-print">
        <span className="badge-sage mb-4 inline-block">You&apos;re In!</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">
          50 Must-Read Living Books
        </h1>
        <p className="mt-3 text-warm-gray">
          Print this page or save it as a PDF for your homeschool planning.
        </p>
        <div className="mt-4">
          <PrintListButton />
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">50 Must-Read Living Books</h1>
        <p className="text-sm text-gray-600">
          From Living Books Hub — livingbookshub.com
        </p>
      </div>

      {sortedGroups.map(([ageRange, groupBooks]) => (
        <div key={ageRange} className="mb-10">
          <h2 className="text-xl font-serif font-bold text-forest mb-4 pb-2 border-b border-sage/20">
            Ages {ageRange}
          </h2>
          <div className="space-y-3">
            {groupBooks.map((book, i) => (
              <div key={book.id} className="flex items-start gap-3 py-2">
                <span className="text-sm font-bold text-warm-gray/40 w-6 text-right flex-shrink-0">
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <Link
                    href={`/books/${book.id}`}
                    className="font-serif font-bold text-ink hover:text-forest transition-colors"
                  >
                    {book.title}
                  </Link>
                  <span className="text-sm text-warm-gray ml-2">
                    by {book.author}
                  </span>
                  {book.reading_level && (
                    <span className="ml-2 badge-gold text-[10px]">
                      {book.reading_level}
                    </span>
                  )}
                </div>
                {/* Checkbox for print */}
                <div className="hidden print:block w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 text-center no-print">
        <p className="text-sm text-warm-gray mb-4">
          Want to explore more? Browse all {books.length}+ living books in our
          library.
        </p>
        <Link href="/search" className="btn-primary">
          Browse the Full Library
        </Link>
      </div>
    </div>
  );
}
