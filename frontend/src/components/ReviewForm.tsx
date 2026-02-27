"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { submitReview } from "@/lib/api";
import Link from "next/link";

export function ReviewForm({
  bookId,
  onReviewSubmitted,
}: {
  bookId: number;
  onReviewSubmitted?: () => void;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [childAge, setChildAge] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!user) {
    return (
      <div className="card p-6 text-center">
        <p className="text-warm-gray text-sm">
          <Link href="/login" className="text-forest hover:underline font-medium">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await submitReview(bookId, {
        rating,
        review_text: reviewText.trim() || undefined,
        child_age_when_read: childAge ? parseInt(childAge) : undefined,
      });
      setStatus("saved");
      onReviewSubmitted?.();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit review");
    }
  }

  if (status === "saved") {
    return (
      <div className="card p-6 text-center">
        <p className="text-forest font-medium">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h3 className="font-serif font-bold text-ink">Write a Review</h3>

      {/* Star rating input */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating) ? "text-gold" : "text-ink/15"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 1l2.39 4.842 5.34.776-3.865 3.768.912 5.32L10 13.347l-4.777 2.36.912-5.32L2.27 6.617l5.34-.775L10 1z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Your thoughts <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          placeholder="What did your family think of this book?"
          className="input w-full resize-none"
        />
      </div>

      {/* Child age */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Child&apos;s age when read <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <input
          type="number"
          min="1"
          max="18"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
          placeholder="e.g. 8"
          className="input w-24"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || status === "saving"}
        className="btn-primary text-sm disabled:opacity-50"
      >
        {status === "saving" ? "Submitting..." : "Submit Review"}
      </button>

      {status === "error" && (
        <p className="text-sm text-rust">{errorMsg}</p>
      )}
    </form>
  );
}
