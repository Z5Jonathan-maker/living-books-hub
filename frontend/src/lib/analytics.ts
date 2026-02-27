export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "page_view", {
    page_path: url,
  });
}

export function trackBookClick(bookId: number, bookTitle: string, source: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "affiliate_click", {
    book_id: bookId,
    book_title: bookTitle,
    source,
    event_category: "affiliate",
  });
}

export function trackSearch(query: string, resultCount: number) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "search", {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackSubscribe(source: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "newsletter_subscribe", {
    signup_source: source,
    event_category: "engagement",
  });
}

export function trackAddToReadingPlan(bookId: number, bookTitle: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "add_to_reading_plan", {
    book_id: bookId,
    book_title: bookTitle,
    event_category: "engagement",
  });
}

export function trackShare(platform: string, contentType: string, title: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "share", {
    method: platform,
    content_type: contentType,
    item_id: title,
  });
}
