"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requestMagicLink } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const result = await requestMagicLink(email.trim());
      setStatus("sent");
      setMessage(result.message);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink">Welcome Back</h1>
          <p className="mt-2 text-warm-gray">
            Sign in to access your family dashboard, reading plans, and more.
          </p>
        </div>

        {status === "sent" ? (
          <div className="bg-white rounded-2xl border border-sage/20 p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-light/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-ink mb-2">Check Your Email</h2>
            <p className="text-warm-gray text-sm">{message}</p>
            <p className="text-xs text-warm-gray/60 mt-4">
              The link expires in 15 minutes. Check your spam folder if you don&apos;t see it.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-sage/20 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input w-full"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Magic Link"}
              </button>
              {status === "error" && (
                <p className="text-sm text-rust text-center">{message}</p>
              )}
            </form>
            <p className="mt-4 text-xs text-warm-gray/60 text-center">
              No password needed. We&apos;ll email you a secure sign-in link.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-warm-gray">
          <Link href="/search" className="text-forest hover:underline">
            Continue browsing without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
