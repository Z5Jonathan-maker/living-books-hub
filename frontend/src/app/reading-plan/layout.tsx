import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reading Plan — Living Books Hub",
  description:
    "Track your family's living books reading journey. Organize books by status, track progress, and build your personalized reading plan.",
  alternates: {
    canonical: "/reading-plan",
  },
  robots: {
    index: false,
  },
};

export default function ReadingPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
