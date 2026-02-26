import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getRelatedBooks } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import type { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const book = await getBook(Number(params.id));
    return {
      title: `${book.title} by ${book.author}`,
      description: book.description,
      openGraph: {
        title: `${book.title} — Living Books Hub`,
        description: book.description,
      },
    };
  } catch {
    return { title: "Book Not Found" };
  }
}

export default async function BookDetailPage({ params }: Props) {
  let book;
  let related;
  try {
    [book, related] = await Promise.all([
      getBook(Number(params.id)),
      getRelatedBooks(Number(params.id)),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-warm-gray mb-8">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/search" className="hover:text-ink transition-colors">
          Books
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Left: Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="aspect-[3/4] bg-gradient-to-br from-parchment to-sage-light/20 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/60 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-sage"
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
                  <p className="text-lg font-serif font-bold text-ink/60">
                    {book.title}
                  </p>
                </div>
              )}
            </div>

            {/* Awards */}
            {book.awards && book.awards.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {book.awards.map((award) => (
                  <span
                    key={award}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-light/40 text-leather text-xs font-medium"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1l2.39 4.842 5.34.776-3.865 3.768.912 5.32L10 13.347l-4.777 2.36.912-5.32L2.27 6.617l5.34-.775L10 1z" />
                    </svg>
                    {award}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-warm-gray">by {book.author}</p>

          {book.series && (
            <p className="mt-1 text-sm text-sage font-medium">
              Part of the <em>{book.series}</em> series
            </p>
          )}

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="badge-sage">Ages {book.age_range}</span>
            {book.reading_level && (
              <span className="badge-gold">{book.reading_level}</span>
            )}
            {book.subjects.map((s) => (
              <Link
                key={s}
                href={`/search?subject=${encodeURIComponent(s)}`}
                className="badge bg-ink/5 text-ink/70 hover:bg-ink/10 transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <p className="text-lg text-ink leading-relaxed">
              {book.description}
            </p>
            {book.long_description && (
              <p className="mt-4 text-base text-warm-gray leading-relaxed">
                {book.long_description}
              </p>
            )}
          </div>

          {/* Metadata grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Time Period", value: book.time_period },
              { label: "Region", value: book.region },
              { label: "Language", value: book.language },
              { label: "Pages", value: book.page_count?.toString() },
              { label: "Published", value: book.publication_year?.toString() },
              { label: "Publisher", value: book.publisher },
              { label: "ISBN", value: book.isbn },
            ]
              .filter((m) => m.value)
              .map((m) => (
                <div key={m.label} className="p-3 bg-parchment/50 rounded-lg">
                  <p className="text-[10px] font-medium text-warm-gray/60 uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="text-sm font-medium text-ink mt-0.5">
                    {m.value}
                  </p>
                </div>
              ))}
          </div>

          {/* Where to get it */}
          {book.links.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-serif font-bold text-ink mb-4">
                Where to Get This Book
              </h2>
              <div className="space-y-3">
                {book.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-ink/5 hover:border-sage/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-parchment flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-warm-gray"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-ink group-hover:text-forest transition-colors">
                          {link.source_name}
                        </p>
                        <p className="text-xs text-warm-gray capitalize">
                          {link.link_type === "rent"
                            ? "Borrow for free"
                            : "Buy"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {link.price_hint && (
                        <span className="text-sm font-semibold text-forest">
                          {link.price_hint}
                        </span>
                      )}
                      <svg
                        className="w-5 h-5 text-warm-gray/30 group-hover:text-forest transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Books */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-serif font-bold text-ink mb-6">
                You Might Also Love
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.slice(0, 6).map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
