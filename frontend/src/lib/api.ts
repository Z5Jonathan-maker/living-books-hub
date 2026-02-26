const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchBooks(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return fetchAPI<import("@/types").PaginatedBooks>(
    `/api/v1/books?${searchParams.toString()}`
  );
}

export async function getBook(id: number) {
  return fetchAPI<import("@/types").BookDetail>(`/api/v1/books/${id}`);
}

export async function getRelatedBooks(id: number) {
  return fetchAPI<import("@/types").BookSummary[]>(
    `/api/v1/books/${id}/related`
  );
}

export async function getFilterOptions() {
  return fetchAPI<import("@/types").FilterOptions>(`/api/v1/books/filters`);
}

export async function getLists(params?: { featured?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.featured !== undefined) {
    searchParams.set("featured", String(params.featured));
  }
  return fetchAPI<import("@/types").CuratedList[]>(
    `/api/v1/lists?${searchParams.toString()}`
  );
}

export async function getListDetail(slug: string) {
  return fetchAPI<import("@/types").CuratedListDetail>(
    `/api/v1/lists/${slug}`
  );
}

export async function getListCategories() {
  return fetchAPI<string[]>(`/api/v1/lists/categories`);
}

export async function getCatalogStats() {
  return fetchAPI<import("@/types").CatalogStats>(`/api/v1/stats`);
}

export async function askLibrarian(message: string) {
  return fetchAPI<import("@/types").LibrarianResponse>(`/api/v1/librarian`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function createCheckoutSession(
  successUrl: string,
  cancelUrl: string
) {
  return fetchAPI<{ checkout_url: string; session_id: string }>(
    `/api/v1/stripe/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    }
  );
}
