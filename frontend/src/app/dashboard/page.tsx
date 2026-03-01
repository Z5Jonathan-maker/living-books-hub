"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getChildren, getPlans, createChild, deleteChild, logout } from "@/lib/api";
import type { Child, ReadingPlan } from "@/types";

export default function DashboardPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [childBirthYear, setChildBirthYear] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childInterests, setChildInterests] = useState("");
  const [childLevel, setChildLevel] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      getChildren().then(setChildren).catch(() => {});
      getPlans().then(setPlans).catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!childName.trim()) return;
    setSaving(true);
    try {
      const child = await createChild({
        name: childName.trim(),
        birth_year: childBirthYear ? parseInt(childBirthYear) : undefined,
        grade_level: childGrade || undefined,
        interests: childInterests ? childInterests.split(",").map((s) => s.trim()).filter(Boolean) : [],
        reading_level: childLevel || undefined,
      });
      setChildren((prev) => [...prev, child]);
      setShowAddChild(false);
      setChildName("");
      setChildBirthYear("");
      setChildGrade("");
      setChildInterests("");
      setChildLevel("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add child";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteChild(id: number) {
    if (!confirm("Remove this child profile?")) return;
    try {
      await deleteChild(id);
      setChildren((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to remove child");
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    router.push("/");
  }

  const isPremium = user.subscription_tier === "premium" && user.subscription_active;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">
            {user.name ? `Welcome, ${user.name}` : "Your Dashboard"}
          </h1>
          <p className="text-warm-gray mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPremium ? "bg-gold-light text-leather" : "bg-ink/5 text-warm-gray"}`}>
            {isPremium ? "Premium" : "Free Plan"}
          </span>
          <button onClick={handleLogout} className="text-sm text-warm-gray hover:text-ink">
            Sign Out
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link href="/search" className="card p-5 hover:shadow-md transition-shadow group">
          <h3 className="font-serif font-bold text-ink group-hover:text-forest">Browse Books</h3>
          <p className="text-sm text-warm-gray mt-1">Search the catalog</p>
        </Link>
        <Link href="/reading-plan" className="card p-5 hover:shadow-md transition-shadow group">
          <h3 className="font-serif font-bold text-ink group-hover:text-forest">Reading Plans</h3>
          <p className="text-sm text-warm-gray mt-1">{plans.length} plan{plans.length !== 1 ? "s" : ""}</p>
        </Link>
        {isPremium ? (
          <Link href="/curriculum" className="card p-5 hover:shadow-md transition-shadow group border-gold/30">
            <h3 className="font-serif font-bold text-ink group-hover:text-forest">Build Curriculum</h3>
            <p className="text-sm text-warm-gray mt-1">AI-powered yearly plan</p>
          </Link>
        ) : (
          <Link href="/subscribe" className="card p-5 hover:shadow-md transition-shadow group border-gold/30 bg-gold-light/10">
            <h3 className="font-serif font-bold text-gold">Unlock AI Curriculum</h3>
            <p className="text-sm text-warm-gray mt-1">Build a year of reading with AI</p>
          </Link>
        )}
      </div>

      {/* Children Profiles */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-ink">Your Children</h2>
          <button
            onClick={() => setShowAddChild(true)}
            className="btn-primary text-sm"
            disabled={!isPremium && children.length >= 1}
            title={!isPremium && children.length >= 1 ? "Upgrade to Premium for unlimited children" : ""}
          >
            + Add Child
          </button>
        </div>

        {children.length === 0 && !showAddChild && (
          <div className="card p-8 text-center">
            <p className="text-warm-gray mb-3">Add your children to get personalized recommendations.</p>
            <button onClick={() => setShowAddChild(true)} className="btn-primary text-sm">
              Add Your First Child
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div key={child.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif font-bold text-ink">{child.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-warm-gray">
                    {child.grade_level && <p>Grade: {child.grade_level}</p>}
                    {child.reading_level && <p>Reading level: {child.reading_level}</p>}
                    {child.birth_year && <p>Born: {child.birth_year}</p>}
                  </div>
                  {child.interests.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {child.interests.map((i) => (
                        <span key={i} className="badge-sage text-[10px]">{i}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  className="text-warm-gray/40 hover:text-rust text-sm"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Child Form */}
        {showAddChild && (
          <div className="card p-6 mt-4">
            <h3 className="font-serif font-bold text-ink mb-4">Add a Child</h3>
            <form onSubmit={handleAddChild} className="space-y-3">
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Child's name"
                className="input w-full"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={childBirthYear}
                  onChange={(e) => setChildBirthYear(e.target.value)}
                  placeholder="Birth year (e.g. 2016)"
                  className="input"
                />
                <select
                  value={childGrade}
                  onChange={(e) => setChildGrade(e.target.value)}
                  className="input"
                >
                  <option value="">Grade level</option>
                  {["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={childInterests}
                onChange={(e) => setChildInterests(e.target.value)}
                placeholder="Interests (comma-separated: nature, history, art)"
                className="input w-full"
              />
              <select
                value={childLevel}
                onChange={(e) => setChildLevel(e.target.value)}
                className="input w-full"
              >
                <option value="">Reading level</option>
                <option value="early">Early reader</option>
                <option value="read-aloud">Read-aloud</option>
                <option value="early-intermediate">Early intermediate</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                  {saving ? "Saving..." : "Add Child"}
                </button>
                <button type="button" onClick={() => setShowAddChild(false)} className="btn-secondary text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!isPremium && children.length >= 1 && (
          <p className="mt-3 text-xs text-warm-gray">
            <Link href="/subscribe" className="text-forest hover:underline">Upgrade to Premium</Link> to add unlimited children.
          </p>
        )}
      </div>

      {/* Premium Upsell */}
      {!isPremium && (
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-gold-light/20 to-parchment/30 border border-gold/20">
          <h2 className="text-lg font-serif font-bold text-ink">Get More with Premium</h2>
          <p className="text-sm text-warm-gray mt-1 mb-4">
            Unlimited AI librarian, AI Curriculum Builder, unlimited child profiles and reading plans.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/subscribe" className="btn-gold text-sm px-5 py-2">
              Go Premium — $5.99/mo or $49/yr
            </Link>
          </div>
        </div>
      )}

      {/* Reading Plans */}
      <div>
        <h2 className="text-xl font-serif font-bold text-ink mb-4">Reading Plans</h2>
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/reading-plan?plan=${plan.id}`} className="card p-5 hover:shadow-md transition-shadow group">
                <h3 className="font-serif font-bold text-ink group-hover:text-forest">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-warm-gray mt-1 line-clamp-2">{plan.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-warm-gray">
                  <span>{plan.item_count} book{plan.item_count !== 1 ? "s" : ""}</span>
                  {plan.is_ai_generated && <span className="badge-gold text-[10px]">AI Generated</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-warm-gray mb-3">No reading plans yet. Start by browsing books or use the AI Curriculum Builder.</p>
            <Link href="/search" className="btn-primary text-sm">Browse Books</Link>
          </div>
        )}
      </div>
    </div>
  );
}
