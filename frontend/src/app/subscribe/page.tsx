"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createCheckoutSession } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function SuccessBanner() {
  const { refresh } = useAuth();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="max-w-2xl mx-auto mb-12 p-8 bg-sage-light/20 border border-sage/30 rounded-2xl text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-forest"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-serif font-bold text-ink">
        Welcome to Premium!
      </h2>
      <p className="mt-2 text-warm-gray">
        Your subscription is active. You now have full access to every premium
        feature.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard" className="btn-gold px-6 py-3">
          Go to Dashboard
        </Link>
        <Link href="/curriculum" className="btn-secondary px-6 py-3">
          Try AI Curriculum Builder
        </Link>
      </div>
    </div>
  );
}

function CanceledBanner() {
  return (
    <div className="max-w-2xl mx-auto mb-12 p-6 bg-gold-light/20 border border-gold/30 rounded-2xl text-center">
      <p className="text-ink font-medium">
        Checkout canceled. No worries — you can subscribe whenever you&apos;re
        ready.
      </p>
    </div>
  );
}

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual",
  );
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const { user } = useAuth();
  const isPremium =
    user?.subscription_tier === "premium" && user?.subscription_active;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { checkout_url } = await createCheckoutSession(
        `${window.location.origin}/subscribe?success=true`,
        `${window.location.origin}/subscribe?canceled=true`,
        billingCycle === "annual" ? "annual" : undefined,
      );
      if (checkout_url) {
        window.location.href = checkout_url;
      }
    } catch {
      alert(
        "Subscriptions are not available yet. Please try again later or contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {isSuccess && <SuccessBanner />}
      {isCanceled && <CanceledBanner />}

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-warm-gray max-w-2xl mx-auto">
          Every family deserves access to the best living books. Start free and
          upgrade when you&apos;re ready for the full experience.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white border border-ink/10 rounded-full p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
              billingCycle === "monthly"
                ? "bg-forest text-white"
                : "text-warm-gray hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
              billingCycle === "annual"
                ? "bg-forest text-white"
                : "text-warm-gray hover:text-ink"
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs font-semibold text-sage">
              Save 32%
            </span>
          </button>
        </div>
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
              "Full catalog + all filters + all lists",
              "Basic AI librarian (5/day)",
              "View & write reviews",
              "1 child profile",
              "1 server-synced reading plan",
              "Weekly newsletter",
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
            {billingCycle === "monthly" ? (
              <>
                <span className="text-4xl font-bold text-ink">$5.99</span>
                <span className="text-warm-gray ml-1">/month</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold text-ink">$49</span>
                <span className="text-warm-gray ml-1">/year</span>
                <p className="text-sm text-sage mt-1">
                  $4.08/mo — save $22.88 vs monthly
                </p>
              </>
            )}
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              "Everything in Explorer, plus:",
              "Unlimited AI librarian with family context",
              "AI Curriculum Builder — personalized year-long plans",
              "Unlimited child profiles",
              "Unlimited server-synced reading plans",
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
          {isPremium ? (
            <button className="mt-8 btn-gold w-full" disabled>
              You&apos;re Premium
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-8 btn-gold w-full disabled:opacity-60"
            >
              {loading
                ? "Redirecting to checkout..."
                : billingCycle === "annual"
                  ? "Start Premium — $49/yr"
                  : "Start Premium — $5.99/mo"}
            </button>
          )}
        </div>
      </div>

      {/* Trust signals */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-warm-gray">
          <svg className="w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>Cancel anytime &mdash; no questions asked</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-warm-gray">
          <svg className="w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span>Secure payments powered by Stripe</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-warm-gray">
          <svg className="w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <span>Join 100+ homeschool families</span>
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
            {
              q: "What's the difference between monthly and annual?",
              a: "Both plans give you the same features. The annual plan saves you $22.88 per year (32% off) — it's $49/year instead of $71.88/year on the monthly plan.",
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
