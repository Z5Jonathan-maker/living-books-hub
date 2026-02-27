"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { verifyMagicLink } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function VerifyInner() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }

    verifyMagicLink(token)
      .then((result) => {
        setStatus("success");
        setUser(result.user);
        setTimeout(() => router.push("/dashboard"), 1500);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Invalid or expired link. Please request a new one.");
      });
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-sage border-t-transparent rounded-full animate-spin" />
            <h1 className="text-xl font-serif font-bold text-ink">Signing you in...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-light/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-serif font-bold text-ink">Welcome!</h1>
            <p className="text-warm-gray mt-2">Redirecting to your dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rust/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-serif font-bold text-ink">Sign-in Failed</h1>
            <p className="text-warm-gray mt-2">{message}</p>
            <a href="/login" className="btn-primary mt-4 inline-block">Try Again</a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyInner />
    </Suspense>
  );
}
