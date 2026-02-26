"use client";

import { useState } from "react";
import { askLibrarian } from "@/lib/api";
import type { BookSummary, LibrarianResponse } from "@/types";
import Link from "next/link";

export function LibrarianChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "librarian"; text: string; books?: BookSummary[] }>
  >([]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage("");
    setConversation((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res: LibrarianResponse = await askLibrarian(userMsg);
      setConversation((prev) => [
        ...prev,
        { role: "librarian", text: res.reply, books: res.suggested_books },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          role: "librarian",
          text: "I'm sorry, I had trouble finding suggestions right now. Try browsing our curated lists instead!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-forest text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Ask the Librarian"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-forest text-white px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold">Ask the Librarian</h3>
          <p className="text-xs text-white/70">
            Tell me what you&apos;re looking for
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80 min-h-[200px]">
        {conversation.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage-light/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-forest"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-sm text-warm-gray">
              Try: &ldquo;nature books for a 7 year old&rdquo; or
              &ldquo;history of ancient Greece&rdquo;
            </p>
          </div>
        )}

        {conversation.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-forest text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] text-sm">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-parchment rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] text-sm text-ink leading-relaxed">
                  {msg.text}
                </div>
                {msg.books && msg.books.length > 0 && (
                  <div className="mt-2 space-y-1.5 ml-2">
                    {msg.books.map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-ink/5 hover:border-sage/30 transition-colors group"
                      >
                        <div className="w-8 h-10 rounded bg-sage-light/30 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-sage"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink group-hover:text-forest truncate">
                            {book.title}
                          </p>
                          <p className="text-[10px] text-warm-gray">
                            {book.author}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-1 px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-sage animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:0.1s]" />
            <div className="w-2 h-2 rounded-full bg-sage animate-bounce [animation-delay:0.2s]" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-ink/5 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What books are you looking for?"
            className="input text-sm py-2.5 flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="btn-primary py-2.5 px-4 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
