import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/marketing/", "/free-book-list/download/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com"}/sitemap.xml`,
  };
}
