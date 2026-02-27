import type { BookDetail, CuratedListDetail } from "@/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com";

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Living Books Hub",
    url: SITE_URL,
    description:
      "The definitive curated library of living books for homeschool and alternative education families.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BookJsonLd({ book }: { book: BookDetail }) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    description: book.description,
    url: `${SITE_URL}/books/${book.id}`,
  };

  if (book.isbn) jsonLd.isbn = book.isbn;
  if (book.cover_image_url) jsonLd.image = book.cover_image_url;
  if (book.publication_year) jsonLd.datePublished = String(book.publication_year);
  if (book.publisher) {
    jsonLd.publisher = { "@type": "Organization", name: book.publisher };
  }
  if (book.language) jsonLd.inLanguage = book.language;
  if (book.page_count) jsonLd.numberOfPages = book.page_count;

  if (book.links.length > 0) {
    jsonLd.offers = book.links
      .filter((l) => l.link_type === "buy")
      .map((link) => ({
        "@type": "Offer",
        url: link.url,
        seller: { "@type": "Organization", name: link.source_name },
        ...(link.price_hint ? { price: link.price_hint } : {}),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ItemListJsonLd({ list }: { list: CuratedListDetail }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.name,
    description: list.description,
    url: `${SITE_URL}/lists/${list.slug}`,
    numberOfItems: list.items.length,
    itemListElement: list.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/books/${item.book.id}`,
      name: item.book.title,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "Living Books Hub",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Living Books Hub",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
