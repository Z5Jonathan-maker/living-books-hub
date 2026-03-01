"use client";

import { useState, useEffect } from "react";
import type { BookSummary } from "@/types";
import { LOCAL_PLAN_KEY } from "@/lib/constants";

export function AddToReadingPlan({ book }: { book: BookSummary }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    try {
      const plan = JSON.parse(
        localStorage.getItem(LOCAL_PLAN_KEY) || "[]",
      );
      setAdded(plan.some((item: { book: BookSummary }) => item.book.id === book.id));
    } catch {
      // ignore
    }
  }, [book.id]);

  const handleAdd = () => {
    try {
      const plan = JSON.parse(
        localStorage.getItem(LOCAL_PLAN_KEY) || "[]",
      );
      if (plan.some((item: { book: BookSummary }) => item.book.id === book.id)) {
        // Remove
        const updated = plan.filter(
          (item: { book: BookSummary }) => item.book.id !== book.id,
        );
        localStorage.setItem(
          LOCAL_PLAN_KEY,
          JSON.stringify(updated),
        );
        setAdded(false);
      } else {
        // Add
        plan.push({
          book,
          status: "to-read",
          addedAt: new Date().toISOString(),
          notes: "",
        });
        localStorage.setItem(
          LOCAL_PLAN_KEY,
          JSON.stringify(plan),
        );
        setAdded(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
        added
          ? "bg-sage-light/30 text-forest border border-sage/30"
          : "bg-forest text-white hover:bg-forest/90 shadow-sm hover:shadow-md"
      }`}
    >
      {added ? (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          In Reading Plan
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add to Reading Plan
        </>
      )}
    </button>
  );
}
