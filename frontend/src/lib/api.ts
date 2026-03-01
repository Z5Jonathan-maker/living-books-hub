const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
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
    `/api/v1/books?${searchParams.toString()}`,
    { next: { revalidate: 300 } } as RequestInit
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
  cancelUrl: string,
  billingCycle?: "annual"
) {
  return fetchAPI<{ checkout_url: string; session_id: string }>(
    `/api/v1/stripe/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(billingCycle === "annual" && { price_id: "annual" }),
      }),
    }
  );
}

export async function subscribeNewsletter(data: {
  email: string;
  name?: string;
  signup_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}) {
  return fetchAPI<{ success: boolean; message: string }>(
    `/api/v1/newsletter/subscribe`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function trackAffiliateClick(data: {
  book_id: number;
  link_id?: number;
  source_name: string;
  referrer?: string;
}) {
  return fetchAPI<{ success: boolean }>(`/api/v1/tracking/click`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Auth ---
export async function requestMagicLink(email: string) {
  return fetchAPI<{ message: string }>(`/api/v1/auth/magic-link`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyMagicLink(token: string) {
  return fetchAPI<{ message: string; user: import("@/types").User }>(
    `/api/v1/auth/verify`,
    { method: "POST", body: JSON.stringify({ token }) }
  );
}

export async function getMe() {
  return fetchAPI<import("@/types").User | null>(`/api/v1/auth/me`);
}

export async function logout() {
  return fetchAPI<{ message: string }>(`/api/v1/auth/logout`, {
    method: "POST",
  });
}

// --- Children ---
export async function getChildren() {
  return fetchAPI<import("@/types").Child[]>(`/api/v1/users/children`);
}

export async function createChild(data: {
  name: string;
  birth_year?: number;
  grade_level?: string;
  interests?: string[];
  reading_level?: string;
}) {
  return fetchAPI<import("@/types").Child>(`/api/v1/users/children`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChild(id: number, data: Record<string, unknown>) {
  return fetchAPI<import("@/types").Child>(`/api/v1/users/children/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteChild(id: number) {
  return fetchAPI<void>(`/api/v1/users/children/${id}`, { method: "DELETE" });
}

// --- Reading Plans ---
export async function getPlans() {
  return fetchAPI<import("@/types").ReadingPlan[]>(`/api/v1/users/plans`);
}

export async function getPlanDetail(id: number) {
  return fetchAPI<import("@/types").ReadingPlanDetail>(
    `/api/v1/users/plans/${id}`
  );
}

export async function createPlan(data: {
  name: string;
  child_id?: number;
  description?: string;
}) {
  return fetchAPI<import("@/types").ReadingPlan>(`/api/v1/users/plans`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addBookToPlan(planId: number, bookId: number) {
  return fetchAPI<import("@/types").ReadingPlanItem>(
    `/api/v1/users/plans/${planId}/items`,
    { method: "POST", body: JSON.stringify({ book_id: bookId }) }
  );
}

export async function updatePlanItem(
  planId: number,
  itemId: number,
  data: { status?: string; notes?: string }
) {
  return fetchAPI<import("@/types").ReadingPlanItem>(
    `/api/v1/users/plans/${planId}/items/${itemId}`,
    { method: "PATCH", body: JSON.stringify(data) }
  );
}

export async function deletePlan(id: number) {
  return fetchAPI<void>(`/api/v1/users/plans/${id}`, { method: "DELETE" });
}

export async function deletePlanItem(planId: number, itemId: number) {
  return fetchAPI<void>(`/api/v1/users/plans/${planId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function importLocalPlan(items: { book_id: number; status: string; notes?: string }[]) {
  return fetchAPI<import("@/types").ReadingPlan>(`/api/v1/users/plans/import-local`, {
    method: "POST",
    body: JSON.stringify({ name: "My Reading Plan", items }),
  });
}

// --- Reviews ---
export async function getBookReviews(bookId: number) {
  return fetchAPI<import("@/types").Review[]>(
    `/api/v1/books/${bookId}/reviews`
  );
}

export async function getReviewSummary(bookId: number) {
  return fetchAPI<import("@/types").ReviewSummary>(
    `/api/v1/books/${bookId}/reviews/summary`
  );
}

export async function submitReview(
  bookId: number,
  data: { rating: number; review_text?: string; child_age_when_read?: number }
) {
  return fetchAPI<import("@/types").Review>(
    `/api/v1/books/${bookId}/reviews`,
    { method: "POST", body: JSON.stringify(data) }
  );
}

// --- AI Curriculum ---
export async function buildCurriculum(data: {
  child_id: number;
  preferences?: { subjects?: string[]; time_periods?: string[] };
}) {
  return fetchAPI<import("@/types").CurriculumResponse>(`/api/v1/ai/curriculum`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
