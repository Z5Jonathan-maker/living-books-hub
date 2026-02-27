import { describe, it, expect, vi, beforeEach } from "vitest";

// Must mock before importing
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Reset module cache so api.ts picks up our mock
const { searchBooks, getBook, getRelatedBooks, subscribeNewsletter, trackAffiliateClick, getCatalogStats, askLibrarian } = await import("./api");

describe("API Client", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("searchBooks calls /api/v1/books with params", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0, page: 1, per_page: 24, pages: 0 }),
    });

    const result = await searchBooks({ q: "nature", page: "1" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/books?q=nature&page=1"),
      expect.any(Object),
    );
    expect(result.items).toEqual([]);
  });

  it("getBook calls /api/v1/books/{id}", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: "Test Book" }),
    });

    const result = await getBook(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/books/1"),
      expect.any(Object),
    );
    expect(result.title).toBe("Test Book");
  });

  it("getRelatedBooks calls /api/v1/books/{id}/related", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await getRelatedBooks(5);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/books/5/related"),
      expect.any(Object),
    );
  });

  it("subscribeNewsletter POSTs to /api/v1/newsletter/subscribe", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "Welcome!" }),
    });

    const result = await subscribeNewsletter({ email: "test@test.com" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/newsletter/subscribe"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("test@test.com"),
      }),
    );
    expect(result.success).toBe(true);
  });

  it("trackAffiliateClick POSTs to /api/v1/tracking/click", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    await trackAffiliateClick({ book_id: 1, source_name: "Amazon" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tracking/click"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("getCatalogStats calls /api/v1/stats", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ total_books: 50 }),
    });

    const result = await getCatalogStats();
    expect(result.total_books).toBe(50);
  });

  it("askLibrarian POSTs to /api/v1/librarian", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: "Try this book!", suggested_books: [] }),
    });

    const result = await askLibrarian("nature books");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/librarian"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.reply).toContain("book");
  });

  it("throws on non-OK response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(getBook(999)).rejects.toThrow("API error: 404 Not Found");
  });

  it("includes Content-Type header", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });

    await searchBooks({});
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });
});
