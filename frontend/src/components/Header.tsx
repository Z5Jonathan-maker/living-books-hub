"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-forest flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <span className="text-xl font-serif font-bold text-ink tracking-tight">
                Living Books
              </span>
              <span className="text-xl font-serif text-sage ml-1">Hub</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/search"
              className="px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
            >
              Browse Books
            </Link>
            <Link
              href="/lists"
              className="px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
            >
              Curated Lists
            </Link>
            <Link
              href="/what-are-living-books"
              className="px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
            >
              What Are Living Books?
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
            >
              Blog
            </Link>
            <Link
              href="/reading-plan"
              className="px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
            >
              My Reading Plan
            </Link>
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest bg-forest/10 rounded-lg hover:bg-forest/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="ml-2 px-4 py-2 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/subscribe"
                    className="btn-gold text-sm py-2 px-4"
                  >
                    Go Premium
                  </Link>
                </>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-ink/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg
              className="w-6 h-6 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink/5 bg-cream animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
            >
              Browse Books
            </Link>
            <Link
              href="/lists"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
            >
              Curated Lists
            </Link>
            <Link
              href="/what-are-living-books"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
            >
              What Are Living Books?
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
            >
              Blog
            </Link>
            <Link
              href="/reading-plan"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
            >
              My Reading Plan
            </Link>
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-forest hover:text-forest/80 rounded-lg hover:bg-forest/10"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-warm-gray hover:text-ink rounded-lg hover:bg-ink/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/subscribe"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gold hover:text-gold/80 rounded-lg hover:bg-gold-light/20"
                  >
                    Go Premium
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
