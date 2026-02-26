import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sage flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <span className="text-lg font-serif font-bold text-white">
                Living Books Hub
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              The definitive curated library of living books for homeschool and
              alternative education families. Discover books that bring every
              subject alive.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Discover
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-sm hover:text-white transition-colors"
                >
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/lists"
                  className="text-sm hover:text-white transition-colors"
                >
                  Curated Lists
                </Link>
              </li>
              <li>
                <Link
                  href="/search?subject=nature"
                  className="text-sm hover:text-white transition-colors"
                >
                  Nature Study
                </Link>
              </li>
              <li>
                <Link
                  href="/search?subject=history"
                  className="text-sm hover:text-white transition-colors"
                >
                  Living History
                </Link>
              </li>
            </ul>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              By Age
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search?age_range=3-7"
                  className="text-sm hover:text-white transition-colors"
                >
                  Early Readers (3-7)
                </Link>
              </li>
              <li>
                <Link
                  href="/search?age_range=6-10"
                  className="text-sm hover:text-white transition-colors"
                >
                  Elementary (6-10)
                </Link>
              </li>
              <li>
                <Link
                  href="/search?age_range=8-12"
                  className="text-sm hover:text-white transition-colors"
                >
                  Middle Grades (8-12)
                </Link>
              </li>
              <li>
                <Link
                  href="/search?age_range=10-14"
                  className="text-sm hover:text-white transition-colors"
                >
                  Upper Grades (10-14)
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/subscribe"
                  className="text-sm hover:text-white transition-colors"
                >
                  Go Premium
                </Link>
              </li>
              <li>
                <span className="text-sm text-white/40">
                  What are Living Books?
                </span>
              </li>
              <li>
                <span className="text-sm text-white/40">Contact Us</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Living Books Hub. All rights
            reserved.
          </p>
          <p className="text-xs text-white/30">
            We earn commissions from affiliate links at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
