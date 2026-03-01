import { CopyButton } from "@/components/CopyButton";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export const metadata: Metadata = {
  title: "Directory Submission Copy",
  robots: { index: false, follow: false },
};

const submissions = [
  {
    directory: "HSLDA",
    emoji: "🏛️",
    entries: [
      {
        title: "Resource Listing",
        text: `Living Books Hub — Free Searchable Living Books Database

Living Books Hub is a free, curated database of living books for homeschool families. Search 100+ titles by age range, subject, reading level, time period, and region. Browse 19+ curated reading lists for Charlotte Mason, classical, and eclectic homeschoolers. Compare prices across Amazon, BookShop.org, ThriftBooks, and local libraries. Features an AI-powered librarian for personalized book recommendations.

Website: ${SITE_URL}
Category: Curriculum & Resources
Cost: Free to browse, optional premium features
Ages: Pre-K through High School`,
      },
    ],
  },
  {
    directory: "Cathy Duffy Reviews",
    emoji: "📝",
    entries: [
      {
        title: "Review Submission",
        text: `Product Name: Living Books Hub
Website: ${SITE_URL}
Developer: Living Books Hub
Price: Free (Premium plan available)
Category: Reference / Book Finding Tool
Ages/Grades: All ages (Pre-K through adult)

Description for Review:
Living Books Hub is a free online tool that helps homeschool families discover and organize living books. The searchable database includes 100+ curated titles organized by age range, subject area, reading level, time period, and geographic region.

Key features:
- Advanced search with multiple filters (age, subject, reading level, time period, region)
- 19+ curated reading lists for specific topics and approaches (Charlotte Mason, nature study, ancient history, etc.)
- Price comparison across Amazon, BookShop.org, ThriftBooks, and local library availability
- AI-powered librarian that provides personalized book recommendations
- Reading plan builder for organizing books by week/term
- Community reviews and ratings from other homeschool families

The tool is particularly valuable for Charlotte Mason and literature-based homeschoolers who want a centralized place to find, compare, and plan their living book selections. It eliminates the hours typically spent searching Facebook groups and blogs for recommendations.

Approach: Neutral — supports Charlotte Mason, classical, eclectic, and unschooling families
Religious Content: None (secular tool, includes books from all perspectives)`,
      },
    ],
  },
  {
    directory: "Homeschool.com",
    emoji: "🏠",
    entries: [
      {
        title: "Directory Listing",
        text: `Living Books Hub — The Definitive Living Books Library

Find the perfect living books for your homeschool in seconds. Living Books Hub is a free, searchable database of curated living books organized by age, subject, reading level, and time period.

Features:
- 100+ living books with detailed descriptions and metadata
- 19+ curated reading lists for Charlotte Mason, classical, and eclectic families
- Price comparison across Amazon, BookShop.org, ThriftBooks, and local libraries
- AI-powered librarian for personalized recommendations
- Reading plan builder to organize your year
- Community reviews from homeschool families

Free to browse — no account required.

${SITE_URL}`,
      },
    ],
  },
  {
    directory: "A2Z Homeschooling",
    emoji: "🔤",
    entries: [
      {
        title: "Resource Description",
        text: `Living Books Hub
${SITE_URL}
Category: Book Resources / Curriculum Planning

A free, searchable database of living books for homeschool families. Filter by age range (Pre-K through high school), subject, reading level, time period, and geographic region. Browse curated reading lists for Charlotte Mason, nature study, history, science, and more. Compare book prices across multiple retailers. An AI librarian provides personalized recommendations based on your child's age and interests.

Ideal for: Charlotte Mason, Classical, Literature-Based, Eclectic homeschoolers
Cost: Free`,
      },
    ],
  },
  {
    directory: "Charlotte Mason Institute",
    emoji: "📖",
    entries: [
      {
        title: "CM-Focused Description",
        text: `Living Books Hub — A Free Tool for Charlotte Mason Families

Living Books Hub was built with Charlotte Mason educators in mind. Our curated database helps you discover living books — the kind of rich, literary works that Mason championed — organized in ways that support term planning and curriculum development.

Search by age range, subject, reading level, time period, and region to find books that fit your family's needs. Browse curated reading lists designed for CM families, including nature study collections, history cycle resources, and literature recommendations by age.

Our AI librarian understands Charlotte Mason philosophy and can recommend specific living books based on your child's age, interests, and current studies. Every book includes price comparison across multiple retailers and local library availability.

Free to use at ${SITE_URL}`,
      },
    ],
  },
  {
    directory: "Product Hunt",
    emoji: "🚀",
    entries: [
      {
        title: "Tagline",
        text: `The Goodreads of living books — search, compare, and plan your homeschool reading`,
      },
      {
        title: "Description",
        text: `Living Books Hub is a free, searchable database of curated living books for homeschool families.

The problem: Homeschool parents spend hours in Facebook groups and blog posts searching for book recommendations, comparing prices, and organizing reading lists.

The solution: A purpose-built search engine for living books with:
- Advanced filters (age, subject, reading level, time period, region)
- 19+ curated reading lists
- Price comparison across Amazon, BookShop.org, ThriftBooks, and libraries
- AI-powered librarian for personalized recommendations
- Reading plan builder for organizing your year

Built for Charlotte Mason, classical, and literature-based homeschool families. Free to browse — no account needed.

${SITE_URL}`,
      },
    ],
  },
  {
    directory: "IndieHackers",
    emoji: "🛠️",
    entries: [
      {
        title: "Maker Story",
        text: `Living Books Hub — How I built a niche book discovery tool for homeschool families

My wife and I homeschool our kids using living books (the Charlotte Mason approach — real literature instead of textbooks). The #1 pain point? Finding the right books.

Every week she'd spend hours in Facebook groups asking "What's a good living book about ancient Egypt for a 7-year-old?" and getting 47 different answers with no way to compare them.

So I built Living Books Hub — a free, searchable database of curated living books with:
- Filters for age range, subject, reading level, time period, and region
- Curated reading lists for specific topics
- Price comparison across Amazon, BookShop.org, ThriftBooks, and local libraries
- An AI librarian that gives personalized recommendations

The stack: Next.js frontend, Python/FastAPI backend, MongoDB for the catalog. Deployed on Vercel + Render.

Revenue model: Free to browse (always will be). Premium plan for advanced features like AI-generated curriculum plans, unlimited reading plans, and priority support.

Target audience: Charlotte Mason and literature-based homeschool families — a passionate, underserved niche.

${SITE_URL}`,
      },
    ],
  },
  {
    directory: "AlternativeTo",
    emoji: "🔄",
    entries: [
      {
        title: "Alternative Listing",
        text: `Living Books Hub
Alternative to: Simply Charlotte Mason Bookfinder, Ambleside Online Book Lists, Exodus Books

Tags: Education, Homeschool, Books, Charlotte Mason, Literature

Description:
Living Books Hub is a free, searchable database of living books for homeschool families. Unlike static book lists (Ambleside Online) or single-retailer catalogs (Simply Charlotte Mason, Exodus Books), Living Books Hub lets you search across all living books with advanced filters, compare prices across multiple retailers, and get AI-powered personalized recommendations.

Key differentiators:
- Search by age, subject, reading level, time period, AND region (not just category)
- Price comparison across Amazon, BookShop.org, ThriftBooks, and local libraries
- AI librarian for personalized recommendations
- Reading plan builder for organizing books by week/term
- Community reviews from other homeschool families
- Free to browse with no account required

Platform: Web
Pricing: Free (Premium plan available)

${SITE_URL}`,
      },
    ],
  },
];

export default function DirectorySubmissionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">
        Directory Submission Copy
      </h1>
      <p className="text-warm-gray mb-10">
        Pre-written copy for submitting Living Books Hub to directories,
        review sites, and communities. Click copy to grab any block.
      </p>

      <div className="space-y-10">
        {submissions.map((section) => (
          <div key={section.directory}>
            <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
              <span>{section.emoji}</span>
              {section.directory}
            </h2>
            <div className="space-y-4">
              {section.entries.map((entry) => (
                <div
                  key={entry.title}
                  className="bg-white rounded-xl border border-ink/5 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-ink">
                      {entry.title}
                    </h3>
                    <CopyButton text={entry.text} />
                  </div>
                  <pre className="text-sm text-warm-gray whitespace-pre-wrap font-sans leading-relaxed">
                    {entry.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
