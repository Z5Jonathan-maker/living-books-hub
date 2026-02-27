"use client";

import { trackAffiliateClick } from "@/lib/api";

interface BookLink {
  id: number;
  source_name: string;
  source_logo_url: string | null;
  url: string;
  link_type: string;
  price_hint: string | null;
}

const SOURCE_COLORS: Record<string, { bg: string; hover: string; text: string }> = {
  Amazon: { bg: "bg-[#FF9900]/10", hover: "hover:bg-[#FF9900]/20", text: "text-[#FF9900]" },
  "BookShop.org": { bg: "bg-[#5C8F3C]/10", hover: "hover:bg-[#5C8F3C]/20", text: "text-[#5C8F3C]" },
  ThriftBooks: { bg: "bg-[#4B6CB7]/10", hover: "hover:bg-[#4B6CB7]/20", text: "text-[#4B6CB7]" },
  "Local Library": { bg: "bg-sage-light/30", hover: "hover:bg-sage-light/50", text: "text-forest" },
};

const DEFAULT_COLORS = { bg: "bg-ink/5", hover: "hover:bg-ink/10", text: "text-ink" };

export function AffiliateLinks({
  bookId,
  links,
}: {
  bookId: number;
  links: BookLink[];
}) {
  function handleClick(link: BookLink) {
    // Fire-and-forget tracking
    trackAffiliateClick({
      book_id: bookId,
      link_id: link.id,
      source_name: link.source_name,
      referrer: typeof window !== "undefined" ? window.location.pathname : undefined,
    }).catch(() => {});
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-serif font-bold text-ink mb-4">
        Where to Get This Book
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => {
          const colors = SOURCE_COLORS[link.source_name] || DEFAULT_COLORS;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(link)}
              className={`flex items-center justify-between p-4 rounded-xl border border-ink/5 ${colors.bg} ${colors.hover} transition-all group shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center`}>
                  <svg
                    className={`w-5 h-5 ${colors.text}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`font-semibold ${colors.text}`}>
                    {link.source_name}
                  </p>
                  <p className="text-xs text-warm-gray capitalize">
                    {link.link_type === "rent" ? "Borrow for free" : "Buy"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {link.price_hint && (
                  <span className="text-sm font-bold text-forest bg-white px-2 py-0.5 rounded-md">
                    {link.price_hint}
                  </span>
                )}
                <svg
                  className="w-5 h-5 text-warm-gray/30 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
