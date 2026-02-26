import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Living Books Hub — Discover the World's Best Living Books",
    template: "%s | Living Books Hub",
  },
  description:
    "The definitive curated library for homeschool and alternative education families. Discover, search, and find living books that bring every subject alive through masterful storytelling.",
  keywords: [
    "living books",
    "homeschool",
    "Charlotte Mason",
    "alternative education",
    "children's literature",
    "book recommendations",
    "homeschool books",
    "classical education",
    "nature study",
    "read aloud",
  ],
  openGraph: {
    title: "Living Books Hub — The Definitive Living Books Library",
    description:
      "Discover the world's best living books. Curated collections, powerful search, and expert recommendations for homeschool families.",
    type: "website",
    locale: "en_US",
    siteName: "Living Books Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Living Books Hub",
    description:
      "The definitive curated library of living books for homeschool families.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
