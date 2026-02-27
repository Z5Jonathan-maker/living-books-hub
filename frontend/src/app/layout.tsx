import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WebSiteJsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://livingbookshub.com"
  ),
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
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-forest focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <WebSiteJsonLd />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
