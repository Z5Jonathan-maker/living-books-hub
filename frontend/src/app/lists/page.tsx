import Link from "next/link";
import { getLists, getListCategories } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Lists",
  description:
    "Hand-picked living book collections for every age, subject, and philosophy. Charlotte Mason, nature study, history, literature, and more.",
  alternates: {
    canonical: "/lists",
  },
};

export default async function ListsPage() {
  let lists;
  let categories;

  try {
    [lists, categories] = await Promise.all([getLists(), getListCategories()]);
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-gray">
          Unable to load lists. Please ensure the API is running.
        </p>
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, typeof lists> = {};
  for (const list of lists) {
    const cat = list.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(list);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="section-heading">Curated Collections</h1>
        <p className="section-subheading mt-4 mx-auto">
          Hand-picked reading lists crafted by living books enthusiasts. Each
          collection is thoughtfully organized to help your family discover the
          perfect books.
        </p>
      </div>

      {Object.entries(grouped).map(([category, catLists]) => (
        <section key={category} className="mb-14">
          <h2 className="text-2xl font-serif font-bold text-ink mb-6 pb-3 border-b border-ink/5">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catLists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.slug}`}
                className="card group p-6 flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gold-light/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gold"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  {list.is_featured && (
                    <span className="badge-gold text-[10px]">Featured</span>
                  )}
                </div>
                <h3 className="mt-4 font-serif font-bold text-ink group-hover:text-forest transition-colors">
                  {list.name}
                </h3>
                <p className="mt-2 text-sm text-warm-gray line-clamp-3 flex-1 leading-relaxed">
                  {list.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-warm-gray/70 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    {list.book_count} books
                  </span>
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
        </section>
      ))}
    </div>
  );
}
