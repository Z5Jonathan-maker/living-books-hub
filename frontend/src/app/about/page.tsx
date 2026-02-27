import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Living Books Hub",
  description:
    "Learn about Living Books Hub — the first and definitive curated living books library for homeschool and alternative education families. We index and curate the world's best living books so you can find them in seconds.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Living Books Hub",
    description:
      "The world's first organized, searchable hub for living books. Built by homeschool parents, for homeschool families.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-paper-texture bg-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-sage mb-6 inline-block">About Us</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ink leading-tight">
            The Living Books Library
            <br />
            <span className="text-forest">That Should Have Always Existed</span>
          </h1>
          <p className="mt-6 text-xl text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Living Books Hub is the first and definitive curated living books
            library for homeschool and alternative education families. We
            don&apos;t sell books &mdash; we index and curate them perfectly, then
            link you to where you can buy, rent, or borrow.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-heading">Our Mission</h2>
          </div>
          <div className="bg-parchment/40 rounded-2xl p-8 md:p-12 border border-sage/10">
            <div className="max-w-3xl mx-auto text-center">
              <svg
                className="w-10 h-10 mx-auto text-sage mb-6"
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
              <p className="text-lg md:text-xl text-ink leading-relaxed font-serif italic">
                &ldquo;We&apos;re building the world&apos;s best living books
                index &mdash; a single, beautiful, organized place where every
                homeschool family can find the exact right book for any subject,
                any age, any season of learning.&rdquo;
              </p>
              <div className="mt-6 w-16 h-0.5 bg-sage/30 mx-auto" />
              <p className="mt-6 text-warm-gray leading-relaxed">
                Every living book that deserves to be found should be findable.
                Not buried on page seven of a forum thread. Not hidden in a blog
                post from 2011. Not locked inside someone&apos;s personal list
                that was never shared. We believe these books are too important to
                leave scattered, and the families who need them are too busy to
                spend hours tracking them down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-16 md:py-20 bg-parchment/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-sage mb-4 inline-block">The Problem</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight">
                Why We Built This
              </h2>
              <div className="mt-6 text-warm-gray leading-relaxed space-y-4">
                <p>
                  If you&apos;ve ever tried to find the right living book for a
                  subject, you know the pain. The best recommendations are
                  scattered across hundreds of forum posts, personal blogs, PDF
                  lists, Facebook groups, and word-of-mouth conversations that
                  disappear into the void.
                </p>
                <p>
                  There was no single, organized, searchable place to find them.
                  You&apos;d spend hours cross-referencing Ambleside lists with
                  blog recommendations, checking which books are still in print,
                  and trying to figure out the right reading level for your child.
                </p>
                <p className="text-ink font-medium">
                  We&apos;re changing that.
                </p>
                <p>
                  Living Books Hub brings every recommendation, every hidden gem,
                  and every beloved classic into one beautifully organized library
                  &mdash; searchable by title, author, subject, age range, time
                  period, and reading level. The index that the living books
                  community has always needed.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  ),
                  label: "The Old Way",
                  text: "Search 12 different blogs, cross-reference 5 forum threads, check 3 PDFs, ask on Facebook, and still wonder if you missed something.",
                  accent: "bg-rust/10 text-rust",
                  iconColor: "text-rust",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                  label: "The Living Books Hub Way",
                  text: "Search once. Filter by exactly what you need. Find the perfect book in seconds. Click through to buy or borrow.",
                  accent: "bg-sage-light/30 text-forest",
                  iconColor: "text-forest",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-6 shadow-sm border border-ink/5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${item.accent} flex items-center justify-center flex-shrink-0`}
                    >
                      <svg
                        className={`w-5 h-5 ${item.iconColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-ink">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-warm-gray leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mt-4 mx-auto">
              Finding the perfect living book takes three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                ),
                title: "Search & Browse",
                description:
                  "Explore our catalog by title, author, subject, age range, time period, or reading level. Use our curated lists for hand-picked starting points, or let the AI Librarian recommend books tailored to your family.",
              },
              {
                step: "02",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                ),
                title: "Read & Discover",
                description:
                  "Every book has a detailed page with a rich description, age recommendations, subject tags, and context about why it qualifies as a living book. Find the perfect match for your child and your curriculum.",
              },
              {
                step: "03",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                ),
                title: "Click Through to Buy or Borrow",
                description:
                  "We link you directly to Amazon, BookShop.org, ThriftBooks, and your local library. Compare options and choose what works best for your family's budget. We never sell books directly — just help you find them.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative text-center p-8 bg-parchment/20 rounded-2xl border border-sage/10"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-forest text-white text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <div className="w-14 h-14 mx-auto mt-4 mb-5 rounded-2xl bg-sage-light/20 flex items-center justify-center">
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

      {/* Our Promise */}
      <section className="py-16 md:py-20 bg-cream bg-paper-texture">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Our Promise</h2>
            <p className="section-subheading mt-4 mx-auto">
              What you will &mdash; and won&apos;t &mdash; find in our library.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sage/15">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-ink leading-relaxed text-center mb-10 font-serif italic">
                &ldquo;We only include genuine living books. No textbooks. No
                workbooks. No twaddle.&rdquo;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* What we include */}
                <div>
                  <h3 className="font-serif font-bold text-forest mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    What We Include
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Books written by passionate, knowledgeable authors",
                      "Literary storytelling that brings subjects alive",
                      "Titles trusted by the living books community",
                      "Carefully verified age and reading level data",
                      "Books that stand the test of time",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg
                          className="w-4 h-4 text-sage flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span className="text-sm text-ink">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What we exclude */}
                <div>
                  <h3 className="font-serif font-bold text-warm-gray mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    What We Leave Out
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Committee-written textbooks with no soul",
                      "Fill-in-the-blank workbooks and busywork",
                      "Twaddle \u2014 dumbed-down, condescending writing",
                      "Books chosen for trends rather than quality",
                      "Anything that doesn\u2019t respect the reader",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg
                          className="w-4 h-4 text-warm-gray/50 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span className="text-sm text-warm-gray">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-ink/5 text-center">
                <p className="text-sm text-warm-gray leading-relaxed max-w-2xl mx-auto">
                  Every book in our catalog is reviewed against these standards
                  before it&apos;s included. We&apos;d rather have a smaller
                  library of genuinely great books than a bloated one full of
                  filler. Quality over quantity &mdash; always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-forest text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            Ready to Find Your Next Living Book?
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Browse our curated library and discover books that will bring every
            subject alive for your family. The search that used to take hours now
            takes seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-gold text-lg px-8 py-4">
              Browse the Library
            </Link>
            <Link
              href="/what-are-living-books"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              What Are Living Books?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
