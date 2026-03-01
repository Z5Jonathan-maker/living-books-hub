import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { LibrarianChat } from "@/components/LibrarianChat";
import { EmailSignup } from "@/components/EmailSignup";
import { getCatalogStats, searchBooks, getLists } from "@/lib/api";
import type { CuratedList, BookSummary, CatalogStats } from "@/types";

async function getData() {
  try {
    const [stats, popular, lists] = await Promise.all([
      getCatalogStats(),
      searchBooks({ sort: "popularity", per_page: "8" }),
      getLists({ featured: true }),
    ]);
    return { stats, popularBooks: popular.items, featuredLists: lists };
  } catch {
    return {
      stats: {
        total_books: 0,
        total_lists: 0,
        total_subscribers: 0,
        subjects: [],
        age_ranges: [],
        reading_levels: [],
      } as CatalogStats,
      popularBooks: [] as BookSummary[],
      featuredLists: [] as CuratedList[],
    };
  }
}

export default async function HomePage() {
  const { stats, popularBooks, featuredLists } = await getData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-paper-texture bg-cream overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/50 to-cream" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-light/20 border border-sage/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="text-xs font-medium text-forest">
                {stats.total_books > 0
                  ? `${stats.total_books} living books and growing`
                  : "The living books library is here"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-ink leading-[1.1] tracking-tight">
              Discover the Books
              <br />
              <span className="text-forest">That Bring Learning</span>
              <br />
              <span className="text-forest">Alive</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
              The first curated hub built for homeschool and alternative
              education families. Find the perfect living books — organized,
              searchable, and lovingly indexed — so you can spend less time
              searching and more time reading together.
            </p>

            {/* Search */}
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar
                large
                placeholder="Search by title, author, subject, or time period..."
              />
            </div>

            {/* Quick filters */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { label: "Nature Study", href: "/search?subject=nature" },
                { label: "History", href: "/search?subject=history" },
                { label: "Literature", href: "/search?subject=literature" },
                { label: "Ages 6-10", href: "/search?age_range=6-10" },
                { label: "Read-Alouds", href: "/search?reading_level=read-aloud" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-4 py-1.5 text-sm text-forest bg-white border border-sage/20 rounded-full hover:bg-sage-light/20 transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* Email Signup */}
            <div className="mt-10">
              <EmailSignup variant="inline" source="homepage_hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 bg-white border-b border-ink/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${stats.total_books || 99}+`, label: "Living Books" },
              { value: "4", label: "Trusted Retailers" },
              { value: `${stats.total_lists || 19}+`, label: "Curated Collections" },
              { value: "100%", label: "Free to Browse" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-serif font-bold text-forest">
                  {stat.value}
                </p>
                <p className="text-sm text-warm-gray mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Are Living Books */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-heading">What Are Living Books?</h2>
            <p className="section-subheading mt-4 mx-auto">
              Living books are written by authors who are passionate about their
              subjects. Instead of dry textbook facts, they tell stories that
              ignite the imagination and create lasting connections with
              knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                ),
                title: "Written with Passion",
                description:
                  "Every book in our library is authored by someone deeply knowledgeable and passionate. These aren't committee-written textbooks — they're works of love that make subjects come alive.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                ),
                title: "Expertly Curated & Indexed",
                description:
                  "We've done the work of finding, cataloging, and organizing every title by age, subject, time period, and reading level. One search replaces hours of forum-digging and list-comparing.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-5.747l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
                  />
                ),
                title: "Find It Anywhere",
                description:
                  "We link you directly to where you can buy, borrow, or rent every book — Amazon, BookShop.org, ThriftBooks, your local library. Compare prices and choose what works for your family.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-8">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-sage-light/20 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-forest"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-serif font-bold text-ink mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Curriculum Builder Highlight */}
      <section className="py-16 bg-parchment/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/40 text-leather text-xs font-medium mb-4">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.842 5.34.776-3.865 3.768.912 5.32L10 13.347l-4.777 2.36.912-5.32L2.27 6.617l5.34-.775L10 1z" />
              </svg>
              Premium Feature
            </span>
            <h2 className="section-heading">Build Your Child&apos;s Reading Year with AI</h2>
            <p className="section-subheading mt-4 mx-auto max-w-2xl">
              Tell us about your child — their age, interests, and reading level — and our AI builds a personalized, term-by-term curriculum from our curated catalog. No more hours of planning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />,
                title: "Personalized to Your Child",
                desc: "Matched to their age, grade level, interests, and reading ability. Every child gets a unique plan.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
                title: "A Full Year, Week by Week",
                desc: "Three terms (Fall, Winter, Spring), ~12 weeks each, with 1-2 books per week. Ready to follow from day one.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Only Vetted Living Books",
                desc: "Every recommendation comes from our curated catalog — real living books, not random suggestions.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-ink/5 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold-light/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/curriculum" className="btn-gold text-lg px-8 py-3">
              Build Your Year
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Books */}
      {popularBooks.length > 0 && (
        <section className="py-20 bg-cream bg-paper-texture">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-heading">Most Beloved Books</h2>
                <p className="section-subheading mt-2">
                  The living books families reach for again and again.
                </p>
              </div>
              <Link
                href="/search?sort=popularity"
                className="hidden md:inline-flex btn-secondary text-sm"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {popularBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/search?sort=popularity" className="btn-secondary">
                View all books
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Lists */}
      {featuredLists.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-heading">Curated Collections</h2>
                <p className="section-subheading mt-2">
                  Hand-picked reading lists for every stage and subject.
                </p>
              </div>
              <Link
                href="/lists"
                className="hidden md:inline-flex btn-secondary text-sm"
              >
                All collections
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLists.slice(0, 6).map((list) => (
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
                    {list.category && (
                      <span className="badge-gold text-[10px]">
                        {list.category}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif font-bold text-ink group-hover:text-forest transition-colors">
                    {list.name}
                  </h3>
                  <p className="mt-2 text-sm text-warm-gray line-clamp-2 flex-1">
                    {list.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs text-warm-gray/70">
                    <svg
                      className="w-4 h-4 mr-1"
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Email Signup Card */}
      <section className="py-16 bg-cream bg-paper-texture">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailSignup variant="card" source="homepage_mid" />
        </div>
      </section>

      {/* From the Blog */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-heading">From the Blog</h2>
              <p className="section-subheading mt-2">
                Guides, lists, and insights for your living books journey.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex btn-secondary text-sm"
            >
              All articles
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "The Charlotte Mason Method Explained",
                href: "/blog/charlotte-mason-method-explained",
                desc: "Everything you need to know about CM's philosophy — living books, narration, nature study, and how to start.",
              },
              {
                title: "Best Nature Study Books for Homeschool",
                href: "/blog/best-nature-study-books",
                desc: "Curated nature study living books by age range. Seasonal reads, field guides, and narrative nature books.",
              },
              {
                title: "Homeschool Curriculum Planning Guide",
                href: "/blog/homeschool-curriculum-planning-guide",
                desc: "Step-by-step curriculum planning with living books. Assessment, scheduling, and practical tips.",
              },
              {
                title: "Best Living Books by Grade Level (2026)",
                href: "/blog/best-living-books-by-grade-level",
                desc: "Age-appropriate living book picks from preschool through high school.",
              },
            ].map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="card group p-5 flex flex-col"
              >
                <h3 className="font-serif font-bold text-ink group-hover:text-forest transition-colors text-sm leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-warm-gray line-clamp-3 flex-1">
                  {post.desc}
                </p>
                <span className="mt-3 text-xs font-medium text-sage group-hover:text-forest transition-colors">
                  Read more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            Stop Planning. Start Reading.
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Let AI build your child&apos;s personalized reading year from our curated catalog. Unlimited children, synced reading plans, community reviews, and a smart librarian that knows your family.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe" className="btn-gold text-lg px-8 py-4">
              Go Premium — $5.99/mo or $49/yr
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Librarian Chat Widget */}
      <LibrarianChat />
    </>
  );
}
