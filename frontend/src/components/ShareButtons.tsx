"use client";

import { useState } from "react";

export function ShareButtons({
  url,
  title,
  description,
  image,
}: {
  url: string;
  title: string;
  description: string;
  image?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description.slice(0, 200));

  function openPopup(shareUrl: string) {
    window.open(shareUrl, "share", "width=600,height=400,scrollbars=yes");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Facebook */}
      <button
        onClick={() =>
          openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
        }
        className="p-2 rounded-lg hover:bg-ink/5 transition-colors"
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4 text-warm-gray hover:text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* Pinterest */}
      <button
        onClick={() =>
          openPopup(
            `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDesc}${image ? `&media=${encodeURIComponent(image)}` : ""}`
          )
        }
        className="p-2 rounded-lg hover:bg-ink/5 transition-colors"
        title="Pin on Pinterest"
        aria-label="Pin on Pinterest"
      >
        <svg className="w-4 h-4 text-warm-gray hover:text-[#E60023]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
        </svg>
      </button>

      {/* X/Twitter */}
      <button
        onClick={() =>
          openPopup(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
          )
        }
        className="p-2 rounded-lg hover:bg-ink/5 transition-colors"
        title="Share on X"
        aria-label="Share on X"
      >
        <svg className="w-4 h-4 text-warm-gray hover:text-ink" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="p-2 rounded-lg hover:bg-ink/5 transition-colors"
        title={copied ? "Copied!" : "Copy link"}
        aria-label={copied ? "Link copied" : "Copy link to clipboard"}
      >
        {copied ? (
          <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-warm-gray hover:text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-5.747l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
          </svg>
        )}
      </button>
    </div>
  );
}
