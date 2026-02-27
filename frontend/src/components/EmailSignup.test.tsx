import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EmailSignup } from "./EmailSignup";

const mockSubscribe = vi.fn();

vi.mock("@/lib/api", () => ({
  subscribeNewsletter: (...args: unknown[]) => mockSubscribe(...args),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("EmailSignup", () => {
  beforeEach(() => {
    mockSubscribe.mockClear();
    mockSubscribe.mockResolvedValue({ success: true, message: "Subscribed!" });
  });

  it("renders inline variant by default", () => {
    render(<EmailSignup />);
    expect(
      screen.getByPlaceholderText(/free weekly book picks/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join free/i }),
    ).toBeInTheDocument();
  });

  it("renders card variant", () => {
    render(<EmailSignup variant="card" />);
    expect(screen.getByText(/Free Weekly Book Picks/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe free/i }),
    ).toBeInTheDocument();
  });

  it("renders footer variant", () => {
    render(<EmailSignup variant="footer" />);
    expect(
      screen.getByPlaceholderText(/your email address/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join/i })).toBeInTheDocument();
  });

  it("submits email and shows success message", async () => {
    render(<EmailSignup />);
    const input = screen.getByPlaceholderText(/free weekly book picks/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/you're in/i)).toBeInTheDocument();
    });

    expect(mockSubscribe).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com" }),
    );
  });

  it("shows error state on API failure", async () => {
    mockSubscribe.mockRejectedValue(new Error("Network error"));
    render(<EmailSignup />);
    const input = screen.getByPlaceholderText(/free weekly book picks/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("does not submit with empty email", () => {
    render(<EmailSignup />);
    fireEvent.submit(screen.getByPlaceholderText(/free weekly/i).closest("form")!);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("passes signup source to API", async () => {
    render(<EmailSignup source="book_detail" />);
    const input = screen.getByPlaceholderText(/free weekly book picks/i);
    fireEvent.change(input, { target: { value: "user@test.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ signup_source: "book_detail" }),
      );
    });
  });
});
