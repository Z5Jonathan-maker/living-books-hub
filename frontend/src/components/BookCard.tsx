import Link from "next/link";
import Image from "next/image";
import type { BookSummary } from "@/types";

const READING_LEVEL_COLORS: Record<string, string> = {
  early: "badge-sage",
  "read-aloud": "badge-sage",
  "early-intermediate": "badge-sage",
  intermediate: "badge-gold",
  advanced: "badge-rust",
  "teacher-reference": "badge-rust",
};

export function BookCard({ book }: { book: BookSummary }) {
  const levelClass =
    READING_LEVEL_COLORS[book.reading_level || ""] || "badge-sage";

  return (
    <Link href={`/books/${book.id}`} className="group">
      <div className="card h-full flex flex-col">
        {/* Cover placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-parchment to-sage-light/20 flex items-center justify-center relative overflow-hidden">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/60 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-sage"
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
              <p className="text-sm font-serif font-semibold text-ink/60 line-clamp-2">
                {book.title}
              </p>
              <p className="text-xs text-warm-gray mt-1">{book.author}</p>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif font-semibold text-ink group-hover:text-forest transition-colors line-clamp-2 text-sm leading-snug">
            {book.title}
          </h3>
          <p className="text-xs text-warm-gray mt-1">{book.author}</p>
          <p className="text-xs text-warm-gray/80 mt-2 line-clamp-2 leading-relaxed flex-1">
            {book.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="badge-sage text-[10px]">Ages {book.age_range}</span>
            {book.reading_level && (
              <span className={`${levelClass} text-[10px]`}>
                {book.reading_level}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
