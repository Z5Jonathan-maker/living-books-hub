"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getChildren, buildCurriculum } from "@/lib/api";
import type { Child } from "@/types";

export default function CurriculumPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "building" | "success" | "error">("idle");
  const [result, setResult] = useState<{ plan_id: number; plan_name: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isPremium = user?.subscription_tier === "premium" && user?.subscription_active;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      getChildren().then((c) => {
        setChildren(c);
        if (c.length > 0) setSelectedChild(c[0].id);
      }).catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-light/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif font-bold text-ink mb-3">AI Curriculum Builder</h1>
        <p className="text-warm-gray mb-6">
          Let AI craft a personalized year-long reading plan for your child — matched to their age, interests, and reading level.
        </p>
        <Link href="/subscribe" className="btn-gold px-8 py-3 text-lg">
          Unlock with Premium — $5.99/mo
        </Link>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-serif font-bold text-ink mb-3">AI Curriculum Builder</h1>
        <p className="text-warm-gray mb-6">
          Add a child profile first so we can personalize the curriculum.
        </p>
        <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  const selectedChildData = children.find((c) => c.id === selectedChild);

  const SUBJECT_OPTIONS = [
    "History", "Science", "Nature Study", "Literature", "Geography",
    "Art", "Music", "Math", "Bible", "Character",
  ];

  async function handleBuild() {
    if (!selectedChild) return;
    setStatus("building");
    setErrorMsg("");
    try {
      const res = await buildCurriculum({
        child_id: selectedChild,
        preferences: subjects.length > 0 ? { subjects } : undefined,
      });
      setResult(res);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to build curriculum");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/40 text-leather text-xs font-medium mb-4">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 1l2.39 4.842 5.34.776-3.865 3.768.912 5.32L10 13.347l-4.777 2.36.912-5.32L2.27 6.617l5.34-.775L10 1z" />
          </svg>
          Premium Feature
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">
          Build {selectedChildData?.name ? `${selectedChildData.name}'s` : "Your Child's"} Reading Year
        </h1>
        <p className="mt-3 text-warm-gray max-w-xl mx-auto">
          Our AI will craft a personalized, term-by-term reading plan from our curated living books catalog.
        </p>
      </div>

      {status === "success" && result ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-light/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink mb-2">{result.plan_name}</h2>
          <p className="text-warm-gray mb-6">{result.message}</p>
          <Link href={`/reading-plan?plan=${result.plan_id}`} className="btn-primary px-8 py-3">
            View Your Curriculum
          </Link>
        </div>
      ) : (
        <div className="card p-6 md:p-8">
          {/* Child selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-ink mb-2">Which child is this for?</label>
            <select
              value={selectedChild || ""}
              onChange={(e) => setSelectedChild(Number(e.target.value))}
              className="input w-full"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.grade_level ? ` (${c.grade_level})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Subject preferences */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-ink mb-2">
              Focus subjects <span className="text-warm-gray font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setSubjects((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )
                  }
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    subjects.includes(s)
                      ? "bg-forest text-white"
                      : "bg-ink/5 text-warm-gray hover:bg-ink/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Build button */}
          <button
            onClick={handleBuild}
            disabled={status === "building"}
            className="btn-gold w-full py-4 text-lg font-bold disabled:opacity-50"
          >
            {status === "building" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Crafting curriculum... this takes a moment
              </span>
            ) : (
              "Build My Year"
            )}
          </button>

          {status === "error" && (
            <p className="mt-3 text-sm text-rust text-center">{errorMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}
