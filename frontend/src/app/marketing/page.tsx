import { CopyButton } from "@/components/CopyButton";
import { getCatalogStats } from "@/lib/api";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export const metadata: Metadata = {
  title: "Social Media Templates",
  robots: { index: false, follow: false },
};

export default async function MarketingPage() {
  let bookCount = "99";
  let listCount = "19";
  try {
    const stats = await getCatalogStats();
    bookCount = String(stats.total_books || 99);
    listCount = String(stats.total_lists || 19);
  } catch {
    // fallback to defaults
  }

  const templates = [
    {
      platform: "Facebook Groups",
      emoji: "📘",
      posts: [
        {
          title: "Discovery Post",
          text: `I just found Living Books Hub and it's a GAME CHANGER for finding living books! 📚\n\nIt has ${bookCount}+ books organized by age, subject, and reading level — plus curated lists for everything from nature study to ancient history.\n\nYou can search, compare prices across Amazon/BookShop/ThriftBooks, and plan your year in minutes instead of hours.\n\nCheck it out: ${SITE_URL}?utm_source=facebook&utm_medium=social&utm_campaign=share`,
        },
        {
          title: "Resource Recommendation",
          text: `Fellow CM/homeschool families — if you spend hours searching Facebook for book recommendations, try Living Books Hub. It's a free, searchable database of living books with ${listCount}+ curated lists.\n\nMy favorite part: the "Where to Buy" links that let you compare prices across 4 retailers.\n\n${SITE_URL}?utm_source=facebook&utm_medium=social&utm_campaign=recommend`,
        },
      ],
    },
    {
      platform: "Instagram Caption",
      emoji: "📸",
      posts: [
        {
          title: "Carousel / Reel Caption",
          text: `Stop spending hours searching for living books. 📚✨\n\nLiving Books Hub has ${bookCount}+ curated living books organized by:\n→ Age range (3-14+)\n→ Subject (history, nature, science, literature)\n→ Reading level\n→ Time period & region\n\nPlus ${listCount}+ hand-picked reading lists for Charlotte Mason, classical, and eclectic families.\n\nFree to browse. Link in bio. 🔗\n\n#livingbooks #charlottemason #homeschool #homeschoolbooks #charlottemasonhomeschool #livingbookshub #homeschoolmom #readaloud #booklist`,
        },
      ],
    },
    {
      platform: "Pinterest Pin",
      emoji: "📌",
      posts: [
        {
          title: "Pin Description",
          text: `The BEST Living Books for Homeschool Families 📚 | Free searchable database of ${bookCount}+ living books organized by age, subject, and reading level. Charlotte Mason, classical, and eclectic homeschool book recommendations. Browse curated lists and compare prices across Amazon, BookShop.org, and ThriftBooks. ${SITE_URL}?utm_source=pinterest&utm_medium=social&utm_campaign=pin #livingbooks #homeschool #charlottemason #booklist`,
        },
      ],
    },
    {
      platform: "X / Twitter",
      emoji: "🐦",
      posts: [
        {
          title: "Thread Starter",
          text: `Just discovered @LivingBooksHub — a free, searchable database of ${bookCount}+ living books for homeschool families.\n\nOrganized by age, subject, reading level. ${listCount}+ curated lists. Price comparison across 4 retailers.\n\nIf you use living books, bookmark this: ${SITE_URL}?utm_source=twitter&utm_medium=social&utm_campaign=tweet`,
        },
      ],
    },
    {
      platform: "Reddit",
      emoji: "🔗",
      posts: [
        {
          title: "r/homeschool Post",
          text: `I've been using this free tool called Living Books Hub to find living books for our homeschool and it's saved me hours.\n\nYou can search by age, subject, reading level, and time period. It has ${bookCount}+ books and ${listCount}+ curated lists. Plus it compares prices across Amazon, BookShop.org, and ThriftBooks.\n\nJust thought I'd share in case others are looking for living book recommendations: ${SITE_URL}?utm_source=reddit&utm_medium=social&utm_campaign=homeschool`,
        },
        {
          title: "r/CharlotteMason Post",
          text: `Fellow CM families — have you seen Living Books Hub? It's a free, searchable database of living books organized by age, subject, reading level, and time period.\n\nI've been using it to plan our terms and it's incredibly helpful. ${listCount}+ curated lists, price comparison, and even an AI librarian you can ask for recommendations.\n\n${SITE_URL}?utm_source=reddit&utm_medium=social&utm_campaign=charlottemason`,
        },
      ],
    },
    {
      platform: "YouTube / TikTok",
      emoji: "🎬",
      posts: [
        {
          title: "Short-form Script (30-60s)",
          text: `[HOOK] Stop spending hours searching Facebook groups for living book recommendations.\n\n[BODY] I just found this free tool called Living Books Hub. It has ${bookCount}+ living books searchable by age, subject, reading level, and time period.\n\nYou can browse ${listCount}+ curated lists, compare prices across 4 retailers, and even ask an AI librarian for personalized recommendations.\n\n[CTA] Link in bio — it's free to browse.\n\n${SITE_URL}?utm_source=youtube&utm_medium=social&utm_campaign=short`,
        },
        {
          title: "Longer Video Script (2-3min)",
          text: `[INTRO] If you use living books in your homeschool, you need to know about this tool.\n\n[PROBLEM] Finding the right living books is one of the most time-consuming parts of homeschooling. You're searching Facebook groups, reading blog posts, comparing Amazon prices...\n\n[SOLUTION] Living Books Hub is a free, searchable database of ${bookCount}+ living books. You can filter by age range, subject, reading level, time period, and region.\n\n[FEATURES] They have ${listCount}+ curated lists for specific topics — nature study, ancient history, Charlotte Mason year plans. Every book links to Amazon, BookShop.org, ThriftBooks, and your local library so you can compare prices.\n\n[AI] They even have an AI librarian you can ask — "What are the best nature study books for a 7-year-old?" and it gives you specific recommendations from their catalog.\n\n[CTA] I'll link it below. It's free to browse — no account needed.\n\n${SITE_URL}?utm_source=youtube&utm_medium=social&utm_campaign=long`,
        },
      ],
    },
    {
      platform: "Email a Friend",
      emoji: "✉️",
      posts: [
        {
          title: "Quick Share Email",
          text: `Subject: Found a great tool for finding living books\n\nHey!\n\nI just found this site called Living Books Hub and thought of you. It's a free, searchable database of living books organized by age, subject, and reading level.\n\nThey have ${bookCount}+ books and ${listCount}+ curated lists. You can compare prices across Amazon, BookShop.org, and ThriftBooks.\n\nCheck it out: ${SITE_URL}?utm_source=email&utm_medium=referral&utm_campaign=friend\n\nHope it helps with your planning!`,
        },
      ],
    },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">
        Social Media Templates
      </h1>
      <p className="text-warm-gray mb-10">
        Ready-to-copy social posts to share Living Books Hub with your community.
        All links include UTM tracking for attribution.
      </p>

      <div className="space-y-10">
        {templates.map((section) => (
          <div key={section.platform}>
            <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
              <span>{section.emoji}</span>
              {section.platform}
            </h2>
            <div className="space-y-4">
              {section.posts.map((post) => (
                <div
                  key={post.title}
                  className="bg-white rounded-xl border border-ink/5 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-ink">
                      {post.title}
                    </h3>
                    <CopyButton text={post.text} />
                  </div>
                  <pre className="text-sm text-warm-gray whitespace-pre-wrap font-sans leading-relaxed">
                    {post.text}
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
