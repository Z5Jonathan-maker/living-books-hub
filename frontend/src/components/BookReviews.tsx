"use client";

import { useEffect, useState, useCallback } from "react";
import { getBookReviews, getReviewSummary } from "@/lib/api";
import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import type { Review, ReviewSummary } from "@/types";

export function BookReviews({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    try {
      const [revs, sum] = await Promise.all([
        getBookReviews(bookId),
        getReviewSummary(bookId),
      ]);
      setReviews(revs);
      setSummary(sum);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-serif font-bold text-ink mb-4">Community Reviews</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-ink/5 rounded w-1/3" />
          <div className="h-20 bg-ink/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-serif font-bold text-ink">Community Reviews</h2>
        {summary && summary.review_count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={summary.avg_rating} size="md" />
            <span className="text-sm text-warm-gray">
              {summary.avg_rating?.toFixed(1)} ({summary.review_count} review{summary.review_count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      <ReviewForm bookId={bookId} onReviewSubmitted={loadReviews} />

      {reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} />
                <span className="text-sm font-medium text-ink">
                  {review.user_name || "Anonymous"}
                </span>
                {review.child_age_when_read && (
                  <span className="text-xs text-warm-gray">
                    Child was age {review.child_age_when_read}
                  </span>
                )}
              </div>
              {review.review_text && (
                <p className="text-sm text-warm-gray leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <p className="mt-4 text-sm text-warm-gray">No reviews yet. Be the first!</p>
      )}
    </div>
  );
}
