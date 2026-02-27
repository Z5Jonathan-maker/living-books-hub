import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

describe("Header", () => {
  it("renders the logo text", () => {
    render(<Header />);
    expect(screen.getByText("Living Books")).toBeInTheDocument();
    expect(screen.getByText("Hub")).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Header />);
    expect(screen.getAllByText("Browse Books").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Curated Lists").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Blog").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("My Reading Plan").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Go Premium button", () => {
    render(<Header />);
    expect(screen.getAllByText("Go Premium").length).toBeGreaterThanOrEqual(1);
  });

  it("has mobile menu button", () => {
    render(<Header />);
    const button = screen.getByLabelText("Open menu");
    expect(button).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", () => {
    render(<Header />);
    const button = screen.getByLabelText("Open menu");

    // Click to open
    fireEvent.click(button);
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

    // Click to close
    fireEvent.click(screen.getByLabelText("Close menu"));
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("links logo to homepage", () => {
    render(<Header />);
    const logoLink = screen.getByText("Living Books").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
