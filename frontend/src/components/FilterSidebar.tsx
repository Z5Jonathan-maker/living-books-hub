"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { FilterOptions } from "@/types";

export function FilterSidebar({ filters }: { filters: FilterOptions }) {
  return (
    <Suspense fallback={null}>
      <FilterSidebarInner filters={filters} />
    </Suspense>
  );
}

function FilterSidebarInner({ filters }: { filters: FilterOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    const q = searchParams.get("q");
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  }, [router, searchParams]);

  const hasFilters =
    searchParams.has("age_range") ||
    searchParams.has("subject") ||
    searchParams.has("reading_level") ||
    searchParams.has("time_period") ||
    searchParams.has("region");

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-rust hover:text-rust/80 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Age Range */}
      <FilterGroup
        label="Age Range"
        options={filters.age_ranges}
        selected={searchParams.get("age_range") || ""}
        onSelect={(v) => setFilter("age_range", v)}
        prefix="Ages "
      />

      {/* Subjects */}
      <FilterGroup
        label="Subject"
        options={filters.subjects.slice(0, 15)}
        selected={searchParams.get("subject") || ""}
        onSelect={(v) => setFilter("subject", v)}
      />

      {/* Reading Level */}
      <FilterGroup
        label="Reading Level"
        options={filters.reading_levels}
        selected={searchParams.get("reading_level") || ""}
        onSelect={(v) => setFilter("reading_level", v)}
      />

      {/* Time Period */}
      {filters.time_periods.length > 0 && (
        <FilterGroup
          label="Time Period"
          options={filters.time_periods}
          selected={searchParams.get("time_period") || ""}
          onSelect={(v) => setFilter("time_period", v)}
        />
      )}

      {/* Region */}
      {filters.regions.length > 0 && (
        <FilterGroup
          label="Region"
          options={filters.regions}
          selected={searchParams.get("region") || ""}
          onSelect={(v) => setFilter("region", v)}
        />
      )}
    </aside>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
  prefix = "",
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  prefix?: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium text-warm-gray mb-2">{label}</h3>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(selected === opt ? "" : opt)}
            className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selected === opt
                ? "bg-forest text-white font-medium"
                : "text-ink/70 hover:bg-ink/5"
            }`}
          >
            {prefix}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
