"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/lib/api";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { checkout_url } = await createCheckoutSession(
        `${window.location.origin}/subscribe?success=true`,
        `${window.location.origin}/subscribe`,
      );
      if (checkout_url) {
        window.location.href = checkout_url;
      }
    } catch (err) {
      alert(
        "Stripe is not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in the backend .env file.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-warm-gray max-w-2xl mx-auto">
          Every family deserves access to the best living books. Start free and
          upgrade when you&apos;re ready for the full experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="card p-8 flex flex-col">
          <div>
            <h2 className="text-2xl font-serif font-bold text-ink">
              Explorer
            </h2>
            <p className="mt-1 text-warm-gray">Perfect for getting started</p>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold text-ink">Free</span>
            <span className="text-warm-gray ml-1">forever</span>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              "Browse the full book catalog",
              "Search & basic filters",
              "1 child profile",
              "Local reading plan (browser only)",
              "Basic AI librarian",
              "View community reviews",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-sage flex-shrink-0 mt-0.5"
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
                <span className="text-sm text-ink">{feature}</span>
              </li>
            ))}
          </ul>
          <button className="mt-8 btn-secondary w-full" disabled>
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="card p-8 flex flex-col border-2 border-gold relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 bg-gold text-white text-xs font-semibold rounded-full">
              MOST POPULAR
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-ink">Premium</h2>
            <p className="mt-1 text-warm-gray">
              The complete living books experience
            </p>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold text-ink">$5.99</span>
            <span className="text-warm-gray ml-1">/month</span>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              "Everything in Explorer, plus:",
              "AI Curriculum Builder — personalized year-long plans",
              "Unlimited child profiles",
              "Server-synced reading plans across devices",
              "Smart AI librarian with family context",
              "Write reviews & ratings",
              "All advanced filters & curated lists",
              "Priority access to new features",
            ].map((feature, i) => (
              <li key={feature} className="flex items-start gap-3">
                <svg
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${i === 0 ? "text-gold" : "text-sage"}`}
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
                <span
                  className={`text-sm ${i === 0 ? "font-semibold text-ink" : "text-ink"}`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-8 btn-gold w-full disabled:opacity-60"
          >
            {loading ? "Redirecting to checkout..." : "Start Premium"}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif font-bold text-ink text-center mb-8">
          Common Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Absolutely. Cancel your subscription at any time and you'll keep access until the end of your billing period. No contracts, no hidden fees.",
            },
            {
              q: "Do you sell books directly?",
              a: "No — we're a discovery and curation platform. Every book links out to trusted retailers (Amazon, BookShop.org, ThriftBooks) and your local library. We help you find the perfect book; you buy it wherever works best for your family.",
            },
            {
              q: "What makes a book a 'living book'?",
              a: "Living books are written by passionate authors who bring subjects alive through literary storytelling. They engage the imagination, connect the reader to real people and ideas, and create lasting impressions — as opposed to dry, fact-dense textbooks.",
            },
            {
              q: "Is this only for Charlotte Mason families?",
              a: "Not at all! While living books are central to Charlotte Mason education, they're beloved by families using many approaches — classical, eclectic, unschooling, and more. Great books transcend methodology.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="p-6 bg-white rounded-xl border border-ink/5"
            >
              <h3 className="font-serif font-bold text-ink">{faq.q}</h3>
              <p className="mt-2 text-sm text-warm-gray leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
