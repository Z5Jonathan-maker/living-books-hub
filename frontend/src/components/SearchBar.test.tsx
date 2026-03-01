import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders an input and search button", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar placeholder="Find a book..." />);
    expect(screen.getByPlaceholderText("Find a book...")).toBeInTheDocument();
  });

  it("navigates to /search with query on submit", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    fireEvent.change(input, { target: { value: "nature" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/search?q=nature");
  });

  it("navigates to /search without query when input is empty", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/search");
  });

  it("trims whitespace from query", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    fireEvent.change(input, { target: { value: "  history  " } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/search?q=history");
  });

  it("encodes special characters in query", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    fireEvent.change(input, { target: { value: "charlotte's web" } });
    fireEvent.submit(input.closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/search?q=charlotte's%20web");
  });

  it("applies large variant styles", () => {
    render(<SearchBar large />);
    const input = screen.getByPlaceholderText(/search by title/i);
    expect(input.className).toContain("text-lg");
  });
});
