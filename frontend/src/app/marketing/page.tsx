import { CopyButton } from "@/components/CopyButton";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export const metadata: Metadata = {
  title: "Social Media Templates",
  robots: { index: false, follow: false },
};

const templates = [
  {
    platform: "Facebook Groups",
    emoji: "📘",
    posts: [
      {
        title: "Discovery Post",
        text: `I just found Living Books Hub and it's a GAME CHANGER for finding living books! 📚\n\nIt has ${99}+ books organized by age, subject, and reading level — plus curated lists for everything from nature study to ancient history.\n\nYou can search, compare prices across Amazon/BookShop/ThriftBooks, and plan your year in minutes instead of hours.\n\nCheck it out: ${SITE_URL}?utm_source=facebook&utm_medium=social&utm_campaign=share`,
      },
      {
        title: "Resource Recommendation",
        text: `Fellow CM/homeschool families — if you spend hours searching Facebook for book recommendations, try Living Books Hub. It's a free, searchable database of living books with 19+ curated lists.\n\nMy favorite part: the "Where to Buy" links that let you compare prices across 4 retailers.\n\n${SITE_URL}?utm_source=facebook&utm_medium=social&utm_campaign=recommend`,
      },
    ],
  },
  {
    platform: "Instagram Caption",
    emoji: "📸",
    posts: [
      {
        title: "Carousel / Reel Caption",
        text: `Stop spending hours searching for living books. 📚✨\n\nLiving Books Hub has 99+ curated living books organized by:\n→ Age range (3-14+)\n→ Subject (history, nature, science, literature)\n→ Reading level\n→ Time period & region\n\nPlus 19+ hand-picked reading lists for Charlotte Mason, classical, and eclectic families.\n\nFree to browse. Link in bio. 🔗\n\n#livingbooks #charlottemason #homeschool #homeschoolbooks #charlottemasonhomeschool #livingbookshub #homeschoolmom #readaloud #booklist`,
      },
    ],
  },
  {
    platform: "Pinterest Pin",
    emoji: "📌",
    posts: [
      {
        title: "Pin Description",
        text: `The BEST Living Books for Homeschool Families 📚 | Free searchable database of 99+ living books organized by age, subject, and reading level. Charlotte Mason, classical, and eclectic homeschool book recommendations. Browse curated lists and compare prices across Amazon, BookShop.org, and ThriftBooks. ${SITE_URL}?utm_source=pinterest&utm_medium=social&utm_campaign=pin #livingbooks #homeschool #charlottemason #booklist`,
      },
    ],
  },
  {
    platform: "X / Twitter",
    emoji: "🐦",
    posts: [
      {
        title: "Thread Starter",
        text: `Just discovered @LivingBooksHub — a free, searchable database of 99+ living books for homeschool families.\n\nOrganized by age, subject, reading level. 19+ curated lists. Price comparison across 4 retailers.\n\nIf you use living books, bookmark this: ${SITE_URL}?utm_source=twitter&utm_medium=social&utm_campaign=tweet`,
      },
    ],
  },
];

export default function MarketingPage() {
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
