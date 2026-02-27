import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe — Living Books Hub",
  description:
    "Choose a plan to unlock advanced filters, unlimited curated lists, AI-powered book recommendations, and more.",
  alternates: {
    canonical: "/subscribe",
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
