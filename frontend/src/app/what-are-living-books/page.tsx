import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Are Living Books?",
  description:
    "Discover what makes a living book different from a textbook, why Charlotte Mason championed them, and how they transform education for homeschool families.",
};

export default function WhatAreLivingBooksPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-paper-texture bg-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-sage mb-6 inline-block">The Philosophy</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ink leading-tight">
            What Are Living Books?
          </h1>
          <p className="mt-6 text-xl text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Living books are the opposite of dry, forgettable textbooks. They
            are written by authors who are <em>passionate</em> about their
            subject — who bring knowledge alive through beautiful language,
            vivid storytelling, and genuine human connection.
          </p>
        </div>
      </section>

      {/* Core Definition */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-serif font-bold text-ink mb-6">
              The Idea That Changed Education
            </h2>
            <div className="text-warm-gray leading-relaxed space-y-5 text-base">
              <p>
                The concept of &ldquo;living books&rdquo; comes from{" "}
                <strong className="text-ink">Charlotte Mason</strong>{" "}
                (1842-1923), a British educator who believed that children
                deserve the best ideas presented in the best language. She
                observed that children who read real, literary books — instead
                of simplified, dumbed-down textbooks — developed richer
                vocabularies, deeper understanding, and a genuine love of
                learning.
              </p>
              <p>
                Her insight was simple but revolutionary: <em>a child who reads a
                passionate author telling the story of ancient Rome will remember
                it for life. A child who reads a textbook chapter about ancient
                Rome will forget it by Friday.</em>
              </p>
              <p>
                Living books aren&apos;t a genre. They span every subject —
                history, science, mathematics, nature, biography, literature,
                geography, art, and music. What unites them is quality: they are
                written by someone who truly knows and loves their subject, in
                language that respects the reader&apos;s intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Living vs Dead Books */}
      <section className="py-16 md:py-20 bg-parchment/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-ink text-center mb-12">
            Living Books vs. Textbooks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Living Book */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage/20">
              <div className="w-12 h-12 rounded-xl bg-sage-light/30 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-forest"
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
              <h3 className="text-xl font-serif font-bold text-forest mb-4">
                A Living Book...
              </h3>
              <ul className="space-y-3">
                {[
                  "Is written by one passionate author with a unique voice",
                  "Tells a story or paints a vivid picture",
                  "Engages the imagination and emotions",
                  "Uses rich, literary language worth savoring",
                  "Creates lasting connections with ideas",
                  "Makes you want to keep reading",
                  "Can be read aloud beautifully",
                  "Stands the test of time (often decades or centuries old)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-sage flex-shrink-0 mt-0.5"
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
                  </li>
                ))}
              </ul>
            </div>

            {/* Textbook */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-ink/5">
              <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-warm-gray"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-warm-gray mb-4">
                A Typical Textbook...
              </h3>
              <ul className="space-y-3">
                {[
                  "Is written by a committee with no personal voice",
                  "Lists facts, dates, and definitions",
                  "Appeals only to rote memorization",
                  "Uses simplified, dumbed-down language",
                  "Creates temporary knowledge that fades quickly",
                  "Feels like a chore to read",
                  "Is designed to be scanned, not savored",
                  "Is replaced by a new edition every few years",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-warm-gray/40 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
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
        </div>
      </section>

      {/* Who Is Charlotte Mason */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-ink mb-6">
            Who Was Charlotte Mason?
          </h2>
          <div className="text-warm-gray leading-relaxed space-y-5 text-base">
            <p>
              Charlotte Mason was a British educator who developed a philosophy
              of education built on respect for children as whole persons. She
              believed that education is &ldquo;the science of relations&rdquo;
              — that learning happens when children form living connections with
              ideas, people, nature, and beauty.
            </p>
            <p>
              Her methods include short lessons, narration (children telling back
              what they&apos;ve heard), nature study, picture study, music
              appreciation, handicrafts, and — at the center of everything —{" "}
              <strong className="text-ink">living books</strong>.
            </p>
            <p>
              Today, Charlotte Mason&apos;s ideas are used by hundreds of
              thousands of homeschool families worldwide, as well as by a growing
              number of schools and co-ops. But you don&apos;t have to follow
              her method to benefit from living books — any family that values
              real literature over dumbed-down textbooks will find them
              transformative.
            </p>
          </div>
        </div>
      </section>

      {/* Who Uses Living Books */}
      <section className="py-16 md:py-20 bg-parchment/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-ink text-center mb-12">
            Who Uses Living Books?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Charlotte Mason Families",
                desc: "Living books are the backbone of CM education — used for every subject from history to science.",
              },
              {
                title: "Classical Homeschoolers",
                desc: "The great books tradition overlaps heavily with living books, especially in literature and history.",
              },
              {
                title: "Eclectic Homeschoolers",
                desc: "Families who mix methods often use living books for humanities while using other approaches for math/science.",
              },
              {
                title: "Unschoolers & Relaxed Families",
                desc: "Strewing beautiful books around the house is a core unschooling strategy — and living books are perfect for this.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-forest text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Ready to Discover Living Books?
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Browse our curated library of the world&apos;s best living books —
            organized by age, subject, and reading level. Find the perfect books
            for your family in minutes, not hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-gold text-lg px-8 py-4">
              Browse the Library
            </Link>
            <Link
              href="/lists"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Curated Lists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
