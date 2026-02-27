export function StarRating({
  rating,
  size = "sm",
  count,
}: {
  rating: number | null;
  size?: "sm" | "md";
  count?: number;
}) {
  if (rating === null) return null;

  const sizeClass = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= Math.round(rating) ? "text-gold" : "text-ink/10"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.39 4.842 5.34.776-3.865 3.768.912 5.32L10 13.347l-4.777 2.36.912-5.32L2.27 6.617l5.34-.775L10 1z" />
        </svg>
      ))}
      {count !== undefined && (
        <span className="text-xs text-warm-gray ml-1">({count})</span>
      )}
    </div>
  );
}
