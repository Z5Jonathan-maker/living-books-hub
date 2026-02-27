import { EmailSignup } from "@/components/EmailSignup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Printable: 50 Must-Read Living Books",
  description:
    "Download our free printable list of 50 must-read living books for homeschool families. Organized by age and subject. Perfect for Charlotte Mason, classical, and eclectic homeschoolers.",
  alternates: {
    canonical: "/free-book-list",
  },
  openGraph: {
    title: "Free Printable: 50 Must-Read Living Books",
    description:
      "Download our free printable list of the top 50 living books for homeschool families, organized by age and subject.",
  },
};

export default function FreeBookListPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-paper-texture bg-cream py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-gold mb-6 inline-block">Free Download</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
            50 Must-Read Living Books
          </h1>
          <p className="mt-6 text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
            The essential printable checklist for homeschool families. Organized
            by age and subject, featuring the most beloved living books chosen
            by experienced homeschool educators.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-ink mb-8 text-center">
            What&apos;s Inside
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {[
              "50 hand-picked living books across all subjects",
              "Organized by age range (3-7, 6-10, 8-12, 10-14+)",
              "Covers history, science, nature, literature & more",
              "Print-friendly format — perfect for your planner",
              "Includes author and recommended reading level",
              "Updated for 2026 with latest recommendations",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-forest flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>

          {/* Email gate */}
          <div className="max-w-lg mx-auto">
            <EmailSignup variant="card" source="lead_magnet" />
            <p className="text-center text-xs text-warm-gray/50 mt-4">
              After subscribing, you&apos;ll be redirected to the printable list.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
