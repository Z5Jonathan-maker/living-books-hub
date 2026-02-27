import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

async function fetchBookIds(): Promise<number[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/books?per_page=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items.map((b: { id: number }) => b.id);
  } catch {
    return [];
  }
}

async function fetchListSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/lists`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((l: { slug: string }) => l.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bookIds, listSlugs] = await Promise.all([
    fetchBookIds(),
    fetchListSlugs(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/lists`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/what-are-living-books`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog/best-living-books-by-grade-level`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/charlotte-mason-book-list-2026`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/living-books-vs-textbooks`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/how-to-start-living-books-homeschool`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/free-book-list`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const bookPages: MetadataRoute.Sitemap = bookIds.map((id) => ({
    url: `${SITE_URL}/books/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const listPages: MetadataRoute.Sitemap = listSlugs.map((slug) => ({
    url: `${SITE_URL}/lists/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...bookPages, ...listPages];
}
