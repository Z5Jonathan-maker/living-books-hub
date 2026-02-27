import Link from "next/link";
import { BlogArticle } from "@/components/BlogArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charlotte Mason Book List 2026",
  description:
    "The definitive Charlotte Mason reading list for 2026. Organized by year, subject, and reading level with links to buy or borrow every title.",
  alternates: { canonical: "/blog/charlotte-mason-book-list-2026" },
  openGraph: {
    title: "Charlotte Mason Book List 2026 — Living Books Hub",
    description:
      "The complete Charlotte Mason book list for 2026 — organized and searchable.",
  },
};

export default function CharlotteMasonBookList() {
  return (
    <BlogArticle
      title="Charlotte Mason Book List 2026"
      slug="charlotte-mason-book-list-2026"
      datePublished="2026-02-10"
      description="The definitive Charlotte Mason reading list for 2026 — organized by year, subject, and reading level."
    >
      <p className="text-ink text-lg">
        Charlotte Mason&apos;s educational philosophy centers on living books — real,
        literary works written by passionate authors. If you&apos;re planning a CM
        homeschool year, this guide covers every subject area with our top book
        picks for 2026.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        What Makes a Book &ldquo;Charlotte Mason&rdquo;?
      </h2>
      <p>
        Charlotte Mason didn&apos;t prescribe specific titles — she described
        qualities. A Charlotte Mason book is written by a single author with
        genuine passion for the subject. It uses literary language, tells a
        story or paints a vivid picture, and treats children as intelligent
        people capable of engaging with real ideas.
      </p>
      <p>
        Learn more about the philosophy on our{" "}
        <Link href="/what-are-living-books" className="text-forest underline">
          What Are Living Books?
        </Link>{" "}
        page.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        History &amp; Geography
      </h2>
      <p>
        History is the backbone of a Charlotte Mason education. Rather than
        textbooks, CM families use narrative history — books that tell the story
        of an era through vivid characters and real events.
      </p>
      <p>
        Browse our complete{" "}
        <Link href="/search?subject=history" className="text-forest underline">
          history collection
        </Link>{" "}
        or explore curated lists organized by time period.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Nature Study &amp; Science
      </h2>
      <p>
        Nature study is perhaps the most distinctive element of a CM education.
        It begins with firsthand observation outdoors, supported by living books
        that deepen understanding of the natural world.
      </p>
      <p>
        See our{" "}
        <Link href="/search?subject=nature" className="text-forest underline">
          nature study books
        </Link>{" "}
        for field guides, natural histories, and observational science titles.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Literature &amp; Poetry
      </h2>
      <p>
        CM families read widely across genres — classic novels, fairy tales,
        myths, poetry, and biographies. The key is choosing books with rich
        language that reward narration (the child telling back what they&apos;ve
        read).
      </p>
      <p>
        Explore our{" "}
        <Link href="/search?subject=literature" className="text-forest underline">
          literature collection
        </Link>{" "}
        filtered by age and reading level.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Art, Music &amp; Handicrafts
      </h2>
      <p>
        While these subjects are often taught through direct experience (picture
        study, composer study, hands-on crafts), living books enhance them
        beautifully — biographies of artists, stories about musicians, and
        illustrated craft guides.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Building Your 2026 Curriculum
      </h2>
      <p>
        Start with our{" "}
        <Link href="/lists" className="text-forest underline">
          curated collections
        </Link>{" "}
        — we have lists organized by subject, age, and educational approach. Use
        the{" "}
        <Link href="/reading-plan" className="text-forest underline">
          reading plan feature
        </Link>{" "}
        to build your year&apos;s book list, then find the best prices across
        Amazon, BookShop.org, ThriftBooks, and your local library.
      </p>
      <p>
        Want a quick start? Download our{" "}
        <Link href="/free-book-list" className="text-forest underline">
          free printable list of 50 must-read living books
        </Link>.
      </p>
    </BlogArticle>
  );
}
