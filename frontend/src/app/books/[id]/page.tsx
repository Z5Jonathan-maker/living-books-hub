import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getBook, getRelatedBooks, searchBooks } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import { AddToReadingPlan } from "@/components/AddToReadingPlan";
import { BookJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";
import { AffiliateLinks } from "@/components/AffiliateLinks";
import { EmailSignup } from "@/components/EmailSignup";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = { params: { id: string } };

export async function generateStaticParams() {
  try {
    const data = await searchBooks({ sort: "popularity", per_page: "100" });
    return data.items.map((b) => ({ id: b.id.toString() }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const book = await getBook(Number(params.id));
    const description =
      book.description.length > 155
        ? book.description.slice(0, 152) + "..."
        : book.description;
    return {
      title: `${book.title} by ${book.author}`,
      description,
      alternates: {
        canonical: `/books/${book.id}`,
      },
      openGraph: {
        title: `${book.title} by ${book.author}`,
        description,
        type: "book" as const,
        ...(book.cover_image_url ? { images: [book.cover_image_url] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${book.title} by ${book.author}`,
        description,
        ...(book.cover_image_url ? { images: [book.cover_image_url] } : {}),
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
      <BookJsonLd book={book} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Books", url: `${SITE_URL}/search` },
          { name: book.title, url: `${SITE_URL}/books/${book.id}` },
        ]}
      />

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
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
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

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddToReadingPlan
              book={{
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                age_range: book.age_range,
                subjects: book.subjects,
                cover_image_url: book.cover_image_url,
                reading_level: book.reading_level,
                popularity_score: book.popularity_score,
              }}
            />
            <ShareButtons
              url={`${SITE_URL}/books/${book.id}`}
              title={`${book.title} by ${book.author}`}
              description={book.description}
              image={book.cover_image_url}
            />
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
            <AffiliateLinks bookId={book.id} links={book.links} />
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

          {/* Email signup */}
          <div className="mt-16">
            <Suspense>
              <EmailSignup variant="card" source="book-detail" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
