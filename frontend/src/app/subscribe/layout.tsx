import type { Metadata } from "next";
import { FAQJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Subscribe — Living Books Hub",
  description:
    "Choose a plan to unlock advanced filters, unlimited curated lists, AI-powered book recommendations, and more.",
  alternates: {
    canonical: "/subscribe",
  },
};

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Cancel your subscription at any time and you'll keep access until the end of your billing period. No contracts, no hidden fees.",
  },
  {
    question: "Do you sell books directly?",
    answer:
      "No — we're a discovery and curation platform. Every book links out to trusted retailers (Amazon, BookShop.org, ThriftBooks) and your local library.",
  },
  {
    question: "What makes a book a 'living book'?",
    answer:
      "Living books are written by passionate authors who bring subjects alive through literary storytelling. They engage the imagination and create lasting impressions — as opposed to dry, fact-dense textbooks.",
  },
  {
    question: "Is this only for Charlotte Mason families?",
    answer:
      "Not at all! While living books are central to Charlotte Mason education, they're beloved by families using many approaches — classical, eclectic, unschooling, and more.",
  },
];

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd questions={faqs} />
      {children}
    </>
  );
}
