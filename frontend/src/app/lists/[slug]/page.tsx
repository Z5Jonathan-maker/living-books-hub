import Link from "next/link";
import { notFound } from "next/navigation";
import { getListDetail } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const list = await getListDetail(params.slug);
    return {
      title: list.name,
      description: list.description,
    };
  } catch {
    return { title: "List Not Found" };
  }
}

export default async function ListDetailPage({ params }: Props) {
  let list;
  try {
    list = await getListDetail(params.slug);
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
        <Link href="/lists" className="hover:text-ink transition-colors">
          Lists
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{list.name}</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          {list.category && (
            <span className="badge-gold">{list.category}</span>
          )}
          {list.is_featured && (
            <span className="badge-sage">Featured</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight">
          {list.name}
        </h1>
        <p className="mt-4 text-lg text-warm-gray leading-relaxed">
          {list.description}
        </p>
        <p className="mt-3 text-sm text-warm-gray/60">
          {list.book_count} {list.book_count === 1 ? "book" : "books"} in this
          collection
        </p>
      </div>

      {/* Books */}
      <div className="space-y-6">
        {list.items.map((item, index) => (
          <Link
            key={item.id}
            href={`/books/${item.book.id}`}
            className="flex gap-5 p-5 bg-white rounded-xl border border-ink/5 hover:border-sage/20 hover:shadow-md transition-all group"
          >
            {/* Rank number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-parchment flex items-center justify-center">
              <span className="text-sm font-bold text-leather">
                {index + 1}
              </span>
            </div>

            {/* Cover */}
            <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-parchment to-sage-light/20 rounded-lg overflow-hidden">
              {item.book.cover_image_url ? (
                <img
                  src={item.book.cover_image_url}
                  alt={item.book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-sage/50"
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
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-ink group-hover:text-forest transition-colors">
                {item.book.title}
              </h3>
              <p className="text-sm text-warm-gray mt-0.5">
                {item.book.author}
              </p>
              <p className="text-sm text-warm-gray/70 mt-2 line-clamp-2 leading-relaxed">
                {item.book.description}
              </p>
              {item.note && (
                <p className="mt-2 text-sm text-sage italic">
                  &ldquo;{item.note}&rdquo;
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="badge-sage text-[10px]">
                  Ages {item.book.age_range}
                </span>
                {item.book.reading_level && (
                  <span className="badge-gold text-[10px]">
                    {item.book.reading_level}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 self-center">
              <svg
                className="w-5 h-5 text-warm-gray/20 group-hover:text-forest transition-colors"
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
          </Link>
        ))}
      </div>

      {/* Back to lists */}
      <div className="mt-12 text-center">
        <Link href="/lists" className="btn-secondary">
          Browse all collections
        </Link>
      </div>
    </div>
  );
}
