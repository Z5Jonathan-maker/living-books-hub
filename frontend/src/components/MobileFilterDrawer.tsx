"use client";

import { useState } from "react";
import { FilterSidebar } from "./FilterSidebar";
import type { FilterOptions } from "@/types";

export function MobileFilterDrawer({ filters }: { filters: FilterOptions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button - visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink bg-white border border-ink/10 rounded-lg hover:bg-ink/5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-ink/5">
          <h2 className="text-lg font-serif font-bold text-ink">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-warm-gray hover:text-ink rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-8rem)] p-4">
          <FilterSidebar filters={filters} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-ink/5">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest/90 transition-colors"
          >
            Show results
          </button>
        </div>
      </div>
    </>
  );
}
