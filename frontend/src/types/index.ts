export interface BookSummary {
  id: number;
  title: string;
  author: string;
  description: string;
  age_range: string;
  subjects: string[];
  cover_image_url: string | null;
  reading_level: string | null;
  popularity_score: number;
}

export interface BookLink {
  id: number;
  source_name: string;
  source_logo_url: string | null;
  url: string;
  link_type: string;
  price_hint: string | null;
}

export interface BookDetail extends BookSummary {
  long_description: string | null;
  time_period: string | null;
  region: string | null;
  isbn: string | null;
  language: string;
  series: string | null;
  awards: string[] | null;
  page_count: number | null;
  publication_year: number | null;
  publisher: string | null;
  links: BookLink[];
  created_at: string;
}

export interface PaginatedBooks {
  items: BookSummary[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface CuratedList {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  category: string | null;
  is_featured: boolean;
  book_count: number;
  created_at: string;
}

export interface ListItem {
  id: number;
  book: BookSummary;
  rank: number;
  note: string | null;
}

export interface CuratedListDetail extends CuratedList {
  items: ListItem[];
}

export interface FilterOptions {
  age_ranges: string[];
  reading_levels: string[];
  subjects: string[];
  time_periods: string[];
  regions: string[];
  languages: string[];
}

export interface CatalogStats {
  total_books: number;
  total_lists: number;
  total_subscribers: number;
  subjects: string[];
  age_ranges: string[];
  reading_levels: string[];
}

export interface LibrarianResponse {
  reply: string;
  suggested_books: BookSummary[];
}
