import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Curriculum Builder",
  robots: { index: false, follow: false },
};

export default function CurriculumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
