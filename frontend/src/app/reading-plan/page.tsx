"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getPlans, getPlanDetail, updatePlanItem, deletePlanItem, importLocalPlan } from "@/lib/api";
import type { BookSummary, ReadingPlan, ReadingPlanDetail } from "@/types";

interface LocalPlanItem {
  book: BookSummary;
  status: "to-read" | "reading" | "completed";
  addedAt: string;
  notes: string;
}

function getStoredPlan(): LocalPlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("living-books-reading-plan") || "[]");
  } catch {
    return [];
  }
}

function storePlan(plan: LocalPlanItem[]) {
  localStorage.setItem("living-books-reading-plan", JSON.stringify(plan));
}

function ReadingPlanInner() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get("plan");

  // Local-only state (guest mode)
  const [localPlan, setLocalPlan] = useState<LocalPlanItem[]>([]);

  // API state (logged-in mode)
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<ReadingPlanDetail | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    planIdParam ? Number(planIdParam) : null
  );

  const [filter, setFilter] = useState<"all" | "to-read" | "reading" | "completed">("all");
  const [mounted, setMounted] = useState(false);
  const [importing, setImporting] = useState(false);

  // Load local plan on mount
  useEffect(() => {
    setLocalPlan(getStoredPlan());
    setMounted(true);
  }, []);

  // Load API plans when logged in
  useEffect(() => {
    if (user) {
      getPlans().then((p) => {
        setPlans(p);
        if (!selectedPlanId && p.length > 0) {
          setSelectedPlanId(p[0].id);
        }
      }).catch(() => {});
    }
  }, [user, selectedPlanId]);

  // Load specific plan detail
  useEffect(() => {
    if (user && selectedPlanId) {
      getPlanDetail(selectedPlanId).then(setActivePlan).catch(() => setActivePlan(null));
    }
  }, [user, selectedPlanId]);

  const handleImportLocal = async () => {
    const local = getStoredPlan();
    if (local.length === 0) return;
    setImporting(true);
    try {
      const items = local.map((i) => ({
        book_id: i.book.id,
        status: i.status,
        notes: i.notes || undefined,
      }));
      const newPlan = await importLocalPlan(items);
      localStorage.removeItem("living-books-reading-plan");
      setLocalPlan([]);
      setPlans((prev) => [newPlan, ...prev]);
      setSelectedPlanId(newPlan.id);
    } catch {
      alert("Failed to import plan");
    } finally {
      setImporting(false);
    }
  };

  // Guest mode: update localStorage
  const updateLocalStatus = useCallback(
    (bookId: number, status: LocalPlanItem["status"]) => {
      const updated = localPlan.map((item) =>
        item.book.id === bookId ? { ...item, status } : item
      );
      setLocalPlan(updated);
      storePlan(updated);
    },
    [localPlan]
  );

  const removeLocalItem = useCallback(
    (bookId: number) => {
      const updated = localPlan.filter((item) => item.book.id !== bookId);
      setLocalPlan(updated);
      storePlan(updated);
    },
    [localPlan]
  );

  // API mode: update item status
  const updateApiStatus = useCallback(
    async (itemId: number, status: string) => {
      if (!activePlan) return;
      try {
        await updatePlanItem(activePlan.id, itemId, { status });
        setActivePlan((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((i) =>
                  i.id === itemId ? { ...i, status } : i
                ),
              }
            : null
        );
      } catch {
        // silently fail
      }
    },
    [activePlan]
  );

  const removeApiItem = useCallback(
    async (itemId: number) => {
      if (!activePlan) return;
      try {
        await deletePlanItem(activePlan.id, itemId);
        setActivePlan((prev) =>
          prev
            ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
            : null
        );
      } catch {
        // silently fail
      }
    },
    [activePlan]
  );

  if (!mounted || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine which items to show
  const isApiMode = !!user && (plans.length > 0 || !!activePlan);
  const items = isApiMode && activePlan
    ? activePlan.items.map((i) => ({
        id: i.id,
        book: i.book,
        status: i.status as "to-read" | "reading" | "completed",
        isApi: true as const,
      }))
    : localPlan.map((i) => ({
        id: i.book.id,
        book: i.book,
        status: i.status,
        isApi: false as const,
      }));

  const filteredItems = filter === "all" ? items : items.filter((i) => i.status === filter);

  const stats = {
    total: items.length,
    toRead: items.filter((i) => i.status === "to-read").length,
    reading: items.filter((i) => i.status === "reading").length,
    completed: items.filter((i) => i.status === "completed").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">
              {isApiMode && activePlan ? activePlan.name : "My Reading Plan"}
            </h1>
            <p className="mt-2 text-warm-gray">
              {isApiMode && activePlan?.description
                ? activePlan.description
                : "Track your family's living books journey."}
            </p>
          </div>
          {isApiMode && activePlan?.is_ai_generated && (
            <span className="badge-gold text-xs">AI Generated</span>
          )}
        </div>

        {/* Plan selector for logged-in users with multiple plans */}
        {user && plans.length > 1 && (
          <div className="mt-4">
            <select
              value={selectedPlanId || ""}
              onChange={(e) => setSelectedPlanId(Number(e.target.value))}
              className="input text-sm"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.item_count} books)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Import prompt for logged-in users with localStorage data */}
        {user && localPlan.length > 0 && (
          <div className="mt-4 card p-4 bg-gold-light/10 border-gold/20 flex items-center justify-between">
            <p className="text-sm text-ink">
              You have {localPlan.length} book{localPlan.length !== 1 ? "s" : ""} in your browser plan. Import to your account?
            </p>
            <button
              onClick={handleImportLocal}
              disabled={importing}
              className="btn-primary text-xs ml-4 disabled:opacity-50"
            >
              {importing ? "Importing..." : "Import"}
            </button>
          </div>
        )}

        {/* Sign-in prompt for guests */}
        {!user && localPlan.length > 0 && (
          <div className="mt-4 card p-4 bg-sage-light/10 border-sage/20">
            <p className="text-sm text-warm-gray">
              <Link href="/login" className="text-forest font-medium hover:underline">Sign in</Link> to save your reading plan across devices and unlock AI-powered curriculum building.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "bg-ink/5 text-ink" },
          { label: "To Read", value: stats.toRead, color: "bg-gold-light/30 text-leather" },
          { label: "Reading", value: stats.reading, color: "bg-sage-light/30 text-forest" },
          { label: "Completed", value: stats.completed, color: "bg-forest/10 text-forest" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-1 opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-warm-gray mb-2">
            <span>Progress</span>
            <span>
              {stats.completed} of {stats.total} books completed (
              {Math.round((stats.completed / stats.total) * 100)}%)
            </span>
          </div>
          <div className="h-3 bg-ink/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sage to-forest rounded-full transition-all duration-500"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {([
          { key: "all", label: "All" },
          { key: "to-read", label: "To Read" },
          { key: "reading", label: "Reading" },
          { key: "completed", label: "Completed" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? "bg-forest text-white"
                : "bg-ink/5 text-warm-gray hover:bg-ink/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Book list */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="card p-5 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/books/${item.book.id}`}
                className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-parchment to-sage-light/20 rounded-lg overflow-hidden relative"
              >
                {item.book.cover_image_url ? (
                  <Image
                    src={item.book.cover_image_url}
                    alt={item.book.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-sage/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/books/${item.book.id}`}
                  className="font-serif font-bold text-ink hover:text-forest transition-colors"
                >
                  {item.book.title}
                </Link>
                <p className="text-sm text-warm-gray">{item.book.author}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="badge-sage text-[10px]">Ages {item.book.age_range}</span>
                  {item.book.subjects.slice(0, 2).map((s) => (
                    <span key={s} className="badge bg-ink/5 text-ink/60 text-[10px]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 sm:items-end">
                <select
                  value={item.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as "to-read" | "reading" | "completed";
                    if (item.isApi) {
                      updateApiStatus(item.id, newStatus);
                    } else {
                      updateLocalStatus(item.book.id, newStatus);
                    }
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 bg-white focus:outline-none focus:ring-1 focus:ring-sage"
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => {
                    if (item.isApi) {
                      removeApiItem(item.id);
                    } else {
                      removeLocalItem(item.book.id);
                    }
                  }}
                  className="text-xs text-rust/60 hover:text-rust transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-parchment flex items-center justify-center">
            <svg className="w-10 h-10 text-warm-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">
            {filter === "all" ? "Your reading plan is empty" : `No ${filter} books`}
          </h2>
          <p className="mt-2 text-warm-gray">
            {filter === "all"
              ? "Browse our library and add books to start your family's reading journey."
              : "Move books between statuses to see them here."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/search" className="btn-primary">Browse Books</Link>
            {user && (
              <Link href="/curriculum" className="btn-gold">Build with AI</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReadingPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReadingPlanInner />
    </Suspense>
  );
}
