"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { subscribeNewsletter } from "@/lib/api";

type Variant = "inline" | "card" | "footer";

export function EmailSignup(props: { variant?: Variant; source?: string }) {
  return (
    <Suspense fallback={<EmailSignupFallback variant={props.variant} />}>
      <EmailSignupInner {...props} />
    </Suspense>
  );
}

function EmailSignupFallback({ variant }: { variant?: Variant }) {
  if (variant === "footer") {
    return (
      <div className="flex gap-2 max-w-md">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40"
          disabled
        />
        <button className="px-4 py-2 text-sm font-medium bg-sage text-white rounded-lg opacity-50" disabled>
          Join
        </button>
      </div>
    );
  }
  return null;
}

function EmailSignupInner({
  variant = "inline",
  source = "website",
}: {
  variant?: Variant;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeNewsletter({
        email,
        signup_source: source,
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={variant === "footer" ? "text-center" : ""}>
        <p className={`text-sm font-medium ${variant === "footer" ? "text-sage-light" : "text-forest"}`}>
          You&apos;re in! Check your inbox for a welcome from the Living Books community.
        </p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-sage"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm font-medium bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Join"}
        </button>
        {status === "error" && (
          <p className="text-xs text-rust mt-1">Something went wrong. Try again.</p>
        )}
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-white rounded-2xl border border-sage/20 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <h3 className="font-serif font-bold text-ink">Free Weekly Book Picks</h3>
        </div>
        <p className="text-sm text-warm-gray mb-4">
          Get a hand-picked living book recommendation every week, plus exclusive lists and early access to new features.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input text-sm flex-1"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs text-rust mt-2">Something went wrong. Try again.</p>
        )}
        <p className="text-[11px] text-warm-gray/50 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // inline variant (hero)
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Get free weekly book picks — enter your email"
        className="input text-sm flex-1"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary text-sm whitespace-nowrap disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Join Free"}
      </button>
      {status === "error" && (
        <p className="text-xs text-rust">Something went wrong.</p>
      )}
    </form>
  );
}
