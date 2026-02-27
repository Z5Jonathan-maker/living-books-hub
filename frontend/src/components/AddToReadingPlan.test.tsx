import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddToReadingPlan } from "./AddToReadingPlan";
import type { BookSummary } from "@/types";

const mockBook: BookSummary = {
  id: 42,
  title: "The Secret Garden",
  author: "Frances Hodgson Burnett",
  description: "A story about a hidden garden.",
  age_range: "8-12",
  subjects: ["literature"],
  cover_image_url: null,
  reading_level: "intermediate",
  popularity_score: 88,
};

describe("AddToReadingPlan", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Add to Reading Plan button by default", () => {
    render(<AddToReadingPlan book={mockBook} />);
    expect(
      screen.getByRole("button", { name: /add to reading plan/i }),
    ).toBeInTheDocument();
  });

  it("adds book to localStorage on click", () => {
    render(<AddToReadingPlan book={mockBook} />);
    fireEvent.click(
      screen.getByRole("button", { name: /add to reading plan/i }),
    );

    const plan = JSON.parse(
      localStorage.getItem("living-books-reading-plan") || "[]",
    );
    expect(plan.length).toBe(1);
    expect(plan[0].book.id).toBe(42);
    expect(plan[0].status).toBe("to-read");
  });

  it("shows In Reading Plan after adding", () => {
    render(<AddToReadingPlan book={mockBook} />);
    fireEvent.click(
      screen.getByRole("button", { name: /add to reading plan/i }),
    );
    expect(
      screen.getByRole("button", { name: /in reading plan/i }),
    ).toBeInTheDocument();
  });

  it("removes book from plan on second click", () => {
    render(<AddToReadingPlan book={mockBook} />);

    // Add
    fireEvent.click(
      screen.getByRole("button", { name: /add to reading plan/i }),
    );
    expect(
      screen.getByRole("button", { name: /in reading plan/i }),
    ).toBeInTheDocument();

    // Remove
    fireEvent.click(
      screen.getByRole("button", { name: /in reading plan/i }),
    );
    expect(
      screen.getByRole("button", { name: /add to reading plan/i }),
    ).toBeInTheDocument();

    const plan = JSON.parse(
      localStorage.getItem("living-books-reading-plan") || "[]",
    );
    expect(plan.length).toBe(0);
  });

  it("shows In Reading Plan if book already in plan", () => {
    localStorage.setItem(
      "living-books-reading-plan",
      JSON.stringify([
        { book: mockBook, status: "to-read", addedAt: new Date().toISOString() },
      ]),
    );
    render(<AddToReadingPlan book={mockBook} />);
    expect(
      screen.getByRole("button", { name: /in reading plan/i }),
    ).toBeInTheDocument();
  });
});
