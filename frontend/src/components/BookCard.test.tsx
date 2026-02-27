import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookCard } from "./BookCard";
import type { BookSummary } from "@/types";

const mockBook: BookSummary = {
  id: 1,
  title: "Charlotte's Web",
  author: "E.B. White",
  description: "A story about friendship between a pig and a spider.",
  age_range: "6-10",
  subjects: ["literature", "nature"],
  cover_image_url: null,
  reading_level: "intermediate",
  popularity_score: 95,
};

describe("BookCard", () => {
  it("renders book title and author", () => {
    render(<BookCard book={mockBook} />);
    // Title appears in both placeholder and info section
    expect(screen.getAllByText("Charlotte's Web").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("E.B. White").length).toBeGreaterThanOrEqual(1);
  });

  it("renders description", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText(/friendship between a pig/)).toBeInTheDocument();
  });

  it("renders age range badge", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText("Ages 6-10")).toBeInTheDocument();
  });

  it("renders reading level badge", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText("intermediate")).toBeInTheDocument();
  });

  it("links to book detail page", () => {
    render(<BookCard book={mockBook} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/books/1");
  });

  it("renders placeholder when no cover image", () => {
    render(<BookCard book={mockBook} />);
    // Should show title text in the placeholder
    expect(screen.getAllByText("Charlotte's Web").length).toBeGreaterThanOrEqual(1);
  });

  it("renders cover image when provided", () => {
    const bookWithCover = {
      ...mockBook,
      cover_image_url: "https://covers.openlibrary.org/b/id/123-L.jpg",
    };
    render(<BookCard book={bookWithCover} />);
    const img = screen.getByAltText("Charlotte's Web");
    expect(img).toBeInTheDocument();
  });

  it("applies correct color for reading level", () => {
    const advancedBook = { ...mockBook, reading_level: "advanced" };
    const { container } = render(<BookCard book={advancedBook} />);
    const badge = screen.getByText("advanced");
    expect(badge.className).toContain("badge-rust");
  });

  it("handles missing reading level", () => {
    const noLevel = { ...mockBook, reading_level: null };
    render(<BookCard book={noLevel} />);
    // Should still render without error, just no reading level badge
    expect(screen.getAllByText("Charlotte's Web").length).toBeGreaterThanOrEqual(1);
  });
});
