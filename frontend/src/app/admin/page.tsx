"use client";

import { useState, FormEvent, ChangeEvent } from "react";

type Tab = "add-book" | "import-csv" | "add-to-list";

const READING_LEVELS = [
  { value: "early", label: "Early" },
  { value: "read-aloud", label: "Read-Aloud" },
  { value: "early-intermediate", label: "Early Intermediate" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "teacher-reference", label: "Teacher Reference" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("add-book");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Add Book State ---
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    description: "",
    age_range: "",
    subjects: "",
    reading_level: "",
    time_period: "",
    region: "",
    isbn: "",
    cover_image_url: "",
    language: "",
    series: "",
    awards: "",
    popularity_score: "",
    page_count: "",
    publication_year: "",
    publisher: "",
  });

  // --- Add to List State ---
  const [listForm, setListForm] = useState({
    list_id: "",
    book_id: "",
    rank: "",
    note: "",
  });

  // --- CSV State ---
  const [csvFile, setCsvFile] = useState<File | null>(null);

  function clearMessage() {
    setMessage(null);
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 6000);
  }

  function handleBookChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setBookForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleListChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setListForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // --- Add Book Submit ---
  async function handleAddBook(e: FormEvent) {
    e.preventDefault();
    clearMessage();

    if (!apiKey.trim()) {
      showMessage("error", "Please enter your admin API key.");
      return;
    }
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      showMessage("error", "Title and author are required.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: bookForm.title,
        author: bookForm.author,
      };

      if (bookForm.description) payload.description = bookForm.description;
      if (bookForm.age_range) payload.age_range = bookForm.age_range;
      if (bookForm.subjects)
        payload.subjects = bookForm.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      if (bookForm.reading_level)
        payload.reading_level = bookForm.reading_level;
      if (bookForm.time_period) payload.time_period = bookForm.time_period;
      if (bookForm.region) payload.region = bookForm.region;
      if (bookForm.isbn) payload.isbn = bookForm.isbn;
      if (bookForm.cover_image_url)
        payload.cover_image_url = bookForm.cover_image_url;
      if (bookForm.language) payload.language = bookForm.language;
      if (bookForm.series) payload.series = bookForm.series;
      if (bookForm.awards)
        payload.awards = bookForm.awards
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      if (bookForm.popularity_score)
        payload.popularity_score = Number(bookForm.popularity_score);
      if (bookForm.page_count)
        payload.page_count = Number(bookForm.page_count);
      if (bookForm.publication_year)
        payload.publication_year = Number(bookForm.publication_year);
      if (bookForm.publisher) payload.publisher = bookForm.publisher;

      const res = await fetch(`${API_URL}/api/v1/admin/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.detail || err?.message || `Request failed with status ${res.status}`,
        );
      }

      const data = await res.json();
      showMessage(
        "success",
        `Book "${data.title || bookForm.title}" added successfully (ID: ${data.id}).`,
      );
      setBookForm({
        title: "",
        author: "",
        description: "",
        age_range: "",
        subjects: "",
        reading_level: "",
        time_period: "",
        region: "",
        isbn: "",
        cover_image_url: "",
        language: "",
        series: "",
        awards: "",
        popularity_score: "",
        page_count: "",
        publication_year: "",
        publisher: "",
      });
    } catch (err) {
      showMessage(
        "error",
        err instanceof Error ? err.message : "Failed to add book.",
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Import CSV Submit ---
  async function handleImportCsv(e: FormEvent) {
    e.preventDefault();
    clearMessage();

    if (!apiKey.trim()) {
      showMessage("error", "Please enter your admin API key.");
      return;
    }
    if (!csvFile) {
      showMessage("error", "Please select a CSV file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch(`${API_URL}/api/v1/admin/books/import-csv`, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.detail || err?.message || `Request failed with status ${res.status}`,
        );
      }

      const data = await res.json();
      showMessage(
        "success",
        `CSV imported successfully. ${data.imported_count ?? data.count ?? ""} books processed.`,
      );
      setCsvFile(null);
      // Reset the file input
      const fileInput = document.getElementById(
        "csv-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      showMessage(
        "error",
        err instanceof Error ? err.message : "Failed to import CSV.",
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Add to List Submit ---
  async function handleAddToList(e: FormEvent) {
    e.preventDefault();
    clearMessage();

    if (!apiKey.trim()) {
      showMessage("error", "Please enter your admin API key.");
      return;
    }
    if (!listForm.list_id.trim() || !listForm.book_id.trim()) {
      showMessage("error", "List ID and Book ID are required.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        book_id: Number(listForm.book_id),
      };
      if (listForm.rank) payload.rank = Number(listForm.rank);
      if (listForm.note) payload.note = listForm.note;

      const res = await fetch(
        `${API_URL}/api/v1/admin/lists/${listForm.list_id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.detail || err?.message || `Request failed with status ${res.status}`,
        );
      }

      showMessage(
        "success",
        `Book ${listForm.book_id} added to list ${listForm.list_id} successfully.`,
      );
      setListForm({ list_id: "", book_id: "", rank: "", note: "" });
    } catch (err) {
      showMessage(
        "error",
        err instanceof Error ? err.message : "Failed to add book to list.",
      );
    } finally {
      setLoading(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "add-book", label: "Add Book" },
    { key: "import-csv", label: "Import CSV" },
    { key: "add-to-list", label: "Add to List" },
  ];

  return (
    <section className="bg-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-warm-gray">
          Manage books, import data, and curate lists for Living Books Hub.
        </p>

        {/* API Key Input */}
        <div className="mt-8 card p-6">
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-warm-gray mb-2"
          >
            Admin API Key
          </label>
          <input
            id="api-key"
            type="password"
            className="input"
            placeholder="Enter your admin API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-sage-light/30 text-forest border border-sage/30"
                : "bg-rust/10 text-rust border border-rust/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-ink/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                clearMessage();
              }}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-forest"
                  : "text-warm-gray hover:text-ink"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* ======================== ADD BOOK TAB ======================== */}
          {activeTab === "add-book" && (
            <form onSubmit={handleAddBook} className="card p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-ink mb-6">
                Add a New Book
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="input"
                    placeholder="e.g. Paddle-to-the-Sea"
                    value={bookForm.title}
                    onChange={handleBookChange}
                    required
                  />
                </div>

                {/* Author */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Author *
                  </label>
                  <input
                    name="author"
                    type="text"
                    className="input"
                    placeholder="e.g. Holling Clancy Holling"
                    value={bookForm.author}
                    onChange={handleBookChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="input min-h-[100px]"
                    placeholder="A brief description of the book..."
                    value={bookForm.description}
                    onChange={handleBookChange}
                    rows={3}
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Age Range
                  </label>
                  <input
                    name="age_range"
                    type="text"
                    className="input"
                    placeholder="e.g. 6-10"
                    value={bookForm.age_range}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Reading Level */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Reading Level
                  </label>
                  <select
                    name="reading_level"
                    className="input"
                    value={bookForm.reading_level}
                    onChange={handleBookChange}
                  >
                    <option value="">Select a level</option>
                    {READING_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subjects */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Subjects{" "}
                    <span className="text-warm-gray/50 font-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    name="subjects"
                    type="text"
                    className="input"
                    placeholder="e.g. geography, nature, adventure"
                    value={bookForm.subjects}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Time Period */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Time Period
                  </label>
                  <input
                    name="time_period"
                    type="text"
                    className="input"
                    placeholder="e.g. 1940s"
                    value={bookForm.time_period}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Region
                  </label>
                  <input
                    name="region"
                    type="text"
                    className="input"
                    placeholder="e.g. North America"
                    value={bookForm.region}
                    onChange={handleBookChange}
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    ISBN
                  </label>
                  <input
                    name="isbn"
                    type="text"
                    className="input"
                    placeholder="e.g. 978-0395150825"
                    value={bookForm.isbn}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Language
                  </label>
                  <input
                    name="language"
                    type="text"
                    className="input"
                    placeholder="e.g. English"
                    value={bookForm.language}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Cover Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    name="cover_image_url"
                    type="url"
                    className="input"
                    placeholder="https://..."
                    value={bookForm.cover_image_url}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Series */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Series
                  </label>
                  <input
                    name="series"
                    type="text"
                    className="input"
                    placeholder="e.g. Holling C. Holling Classics"
                    value={bookForm.series}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Publisher */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Publisher
                  </label>
                  <input
                    name="publisher"
                    type="text"
                    className="input"
                    placeholder="e.g. Houghton Mifflin"
                    value={bookForm.publisher}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Awards */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Awards{" "}
                    <span className="text-warm-gray/50 font-normal">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    name="awards"
                    type="text"
                    className="input"
                    placeholder="e.g. Caldecott Honor, Newbery Medal"
                    value={bookForm.awards}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Popularity Score */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Popularity Score
                  </label>
                  <input
                    name="popularity_score"
                    type="number"
                    className="input"
                    placeholder="e.g. 85"
                    value={bookForm.popularity_score}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Page Count */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Page Count
                  </label>
                  <input
                    name="page_count"
                    type="number"
                    className="input"
                    placeholder="e.g. 64"
                    value={bookForm.page_count}
                    onChange={handleBookChange}
                  />
                </div>

                {/* Publication Year */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Publication Year
                  </label>
                  <input
                    name="publication_year"
                    type="number"
                    className="input"
                    placeholder="e.g. 1941"
                    value={bookForm.publication_year}
                    onChange={handleBookChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Book..." : "Add Book"}
                </button>
              </div>
            </form>
          )}

          {/* ======================== IMPORT CSV TAB ======================== */}
          {activeTab === "import-csv" && (
            <form onSubmit={handleImportCsv} className="card p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-ink mb-2">
                Import Books from CSV
              </h2>
              <p className="text-sm text-warm-gray mb-6">
                Upload a CSV file with book data. The file should include headers
                matching the book fields (title, author, description, etc.).
              </p>

              <div>
                <label className="block text-sm font-medium text-warm-gray mb-1.5">
                  CSV File
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-ink/10 rounded-lg hover:border-sage/40 transition-colors bg-cream/50"
                  >
                    <svg
                      className="w-10 h-10 text-warm-gray/40 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    {csvFile ? (
                      <span className="text-sm text-ink font-medium">
                        {csvFile.name}
                      </span>
                    ) : (
                      <span className="text-sm text-warm-gray">
                        Click to select a CSV file
                      </span>
                    )}
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) =>
                        setCsvFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Importing..." : "Import CSV"}
                </button>
              </div>
            </form>
          )}

          {/* ======================== ADD TO LIST TAB ======================== */}
          {activeTab === "add-to-list" && (
            <form onSubmit={handleAddToList} className="card p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-ink mb-2">
                Add Book to a Curated List
              </h2>
              <p className="text-sm text-warm-gray mb-6">
                Associate a book with a curated list by providing both IDs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* List ID */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    List ID *
                  </label>
                  <input
                    name="list_id"
                    type="text"
                    className="input"
                    placeholder="e.g. 12"
                    value={listForm.list_id}
                    onChange={handleListChange}
                    required
                  />
                </div>

                {/* Book ID */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Book ID *
                  </label>
                  <input
                    name="book_id"
                    type="text"
                    className="input"
                    placeholder="e.g. 42"
                    value={listForm.book_id}
                    onChange={handleListChange}
                    required
                  />
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Rank
                  </label>
                  <input
                    name="rank"
                    type="number"
                    className="input"
                    placeholder="e.g. 1"
                    value={listForm.rank}
                    onChange={handleListChange}
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-warm-gray mb-1.5">
                    Note
                  </label>
                  <input
                    name="note"
                    type="text"
                    className="input"
                    placeholder="e.g. Essential read for ages 8-10"
                    value={listForm.note}
                    onChange={handleListChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding to List..." : "Add to List"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
