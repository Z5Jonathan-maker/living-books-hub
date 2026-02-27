import Link from "next/link";
import { BlogArticle } from "@/components/BlogArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Living Books by Grade Level (2026)",
  description:
    "A comprehensive guide to the best living books for every age, from preschool through high school. Organized by grade level with recommendations for history, science, literature, and nature study.",
  alternates: { canonical: "/blog/best-living-books-by-grade-level" },
  openGraph: {
    title: "Best Living Books by Grade Level (2026) — Living Books Hub",
    description:
      "The definitive guide to choosing living books by grade level. Updated for 2026.",
  },
};

export default function BestBooksByGradeLevel() {
  return (
    <BlogArticle
      title="Best Living Books by Grade Level (2026)"
      slug="best-living-books-by-grade-level"
      datePublished="2026-02-15"
      description="A comprehensive guide to the best living books for every age, from preschool through high school."
    >
      <p className="text-ink text-lg">
        One of the biggest challenges for homeschool families is finding the
        right living books for each child&apos;s age and reading ability. This guide
        breaks down our top recommendations by grade level, covering history,
        science, nature study, and literature.
      </p>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Preschool &amp; Kindergarten (Ages 3-6)
      </h2>
      <p>
        At this age, living books should be rich in beautiful illustrations and
        lyrical language. Read-alouds are the primary format. Focus on picture
        books that tell real stories about nature, animals, and the world.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Nature:</strong> Books about seasons, animals, and gardens
          build a foundation for scientific observation. Browse our{" "}
          <Link href="/search?subject=nature&age_range=3-7" className="text-forest underline">
            nature books for ages 3-7
          </Link>.
        </li>
        <li>
          <strong>Stories:</strong> Folk tales, fairy tales, and Aesop&apos;s fables
          introduce narrative structure and moral reasoning.
        </li>
        <li>
          <strong>Poetry:</strong> Mother Goose, Robert Louis Stevenson&apos;s{" "}
          <em>A Child&apos;s Garden of Verses</em>, and other lyrical collections
          build language and rhythm.
        </li>
      </ul>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Early Elementary (Ages 6-8, Grades 1-3)
      </h2>
      <p>
        Children begin to read independently and can handle longer narratives.
        This is the golden age for chapter-book read-alouds and early independent
        readers.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>History:</strong> Engaging historical narratives that bring
          past eras to life through story. See our{" "}
          <Link href="/search?subject=history&age_range=6-10" className="text-forest underline">
            history books for ages 6-10
          </Link>.
        </li>
        <li>
          <strong>Science:</strong> Observation-based books about insects,
          weather, plants, and the human body.
        </li>
        <li>
          <strong>Literature:</strong> Classic chapter books that reward
          re-reading — stories with vivid characters and moral depth.
        </li>
      </ul>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Upper Elementary (Ages 8-11, Grades 4-6)
      </h2>
      <p>
        Students can now handle complex narratives, multiple perspectives, and
        longer works. This is when living books truly shine — they make history,
        science, and geography come alive in ways no textbook can match.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>History:</strong> Biographical and narrative history spanning
          ancient civilizations through the modern era. Check our{" "}
          <Link href="/search?subject=history&age_range=8-12" className="text-forest underline">
            history books for ages 8-12
          </Link>.
        </li>
        <li>
          <strong>Science &amp; Nature:</strong> More detailed explorations of
          biology, astronomy, geology, and the natural world.
        </li>
        <li>
          <strong>Literature:</strong> Classic novels, adventure stories, and
          literary fiction that expand vocabulary and empathy.
        </li>
      </ul>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Middle School &amp; High School (Ages 11-14+, Grades 7-12)
      </h2>
      <p>
        Older students are ready for primary sources, mature themes, and
        challenging prose. Living books at this level include original works of
        literature, narrative nonfiction, and philosophical texts.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>History:</strong> Primary source narratives, eyewitness
          accounts, and deeply-researched historical narrative. Explore our{" "}
          <Link href="/search?subject=history&age_range=10-14" className="text-forest underline">
            history books for ages 10-14+
          </Link>.
        </li>
        <li>
          <strong>Science:</strong> Books by scientists writing for general
          audiences — making complex topics accessible without dumbing them down.
        </li>
        <li>
          <strong>Literature:</strong> The great novels, poetry collections, and
          essays that form the backbone of a liberal arts education.
        </li>
      </ul>

      <h2 className="text-2xl font-serif font-bold text-ink mt-10 mb-4">
        Finding the Right Books
      </h2>
      <p>
        Every child is different. Use our{" "}
        <Link href="/search" className="text-forest underline">
          advanced search
        </Link>{" "}
        to filter by age range, subject, reading level, and time period. Or
        explore our{" "}
        <Link href="/lists" className="text-forest underline">
          19+ curated collections
        </Link>{" "}
        built by experienced homeschool educators.
      </p>
    </BlogArticle>
  );
}
