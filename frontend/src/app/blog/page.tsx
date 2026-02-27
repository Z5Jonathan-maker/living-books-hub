import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Living Books Hub",
  description:
    "Articles, guides, and reading lists for homeschool families who use living books. Charlotte Mason resources, grade-level recommendations, and practical advice.",
  alternates: {
    canonical: "/blog",
  },
};

const articles = [
  {
    slug: "best-living-books-by-grade-level",
    title: "Best Living Books by Grade Level (2026)",
    description:
      "A comprehensive guide to the best living books for every age, from preschool through high school. Updated for 2026 with the latest recommendations.",
    date: "2026-02-15",
    category: "Reading Lists",
  },
  {
    slug: "charlotte-mason-book-list-2026",
    title: "Charlotte Mason Book List 2026",
    description:
      "The definitive Charlotte Mason reading list for 2026 — organized by year, subject, and reading level. Includes classics and modern additions.",
    date: "2026-02-10",
    category: "Charlotte Mason",
  },
  {
    slug: "living-books-vs-textbooks",
    title: "Living Books vs Textbooks: Why It Matters",
    description:
      "What makes living books different from textbooks? An in-depth look at the research, the philosophy, and the practical differences for your homeschool.",
    date: "2026-02-05",
    category: "Philosophy",
  },
  {
    slug: "how-to-start-living-books-homeschool",
    title: "How to Start a Living Books Homeschool",
    description:
      "A step-by-step guide for families new to living books. How to choose books, structure your day, and build a curriculum around real literature.",
    date: "2026-01-28",
    category: "Getting Started",
  },
];

export default function BlogPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-paper-texture bg-cream py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink">
            Living Books Blog
          </h1>
          <p className="mt-4 text-lg text-warm-gray max-w-2xl mx-auto">
            Guides, reading lists, and practical advice for families who use
            living books in their homeschool.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="block group p-6 md:p-8 bg-white rounded-xl border border-ink/5 hover:border-sage/20 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge-sage text-[10px]">
                    {article.category}
                  </span>
                  <time
                    dateTime={article.date}
                    className="text-xs text-warm-gray/50"
                  >
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-ink group-hover:text-forest transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-warm-gray leading-relaxed">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-forest">
                  Read more
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
