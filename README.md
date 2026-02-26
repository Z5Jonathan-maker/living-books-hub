# Living Books Hub

The definitive curated library for homeschool and alternative education families. Discover, search, and find living books that bring every subject alive through masterful storytelling.

**We don't sell books.** We index them perfectly — then link you to where you can buy, rent, or borrow every title.

---

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS | Vercel |
| Backend | FastAPI (Python 3.11+) + SQLAlchemy | Render |
| Database | PostgreSQL (Neon) | Neon |
| Payments | Stripe Subscriptions | — |
| AI | Claude API (optional, feature-flagged) | — |

## Features

- **Instant Search** — Search by title, author, subject, or keyword
- **Advanced Filters** — Age range, reading level, subject, time period, region, language
- **50+ Living Books** — Pre-loaded with classic living books (Charlotte's Web, Paddle-to-the-Sea, etc.)
- **10 Curated Lists** — Hand-picked collections (Charlotte Mason Essentials, Nature Study, etc.)
- **Where to Buy** — Links to Amazon, BookShop.org, ThriftBooks, and your local library
- **Affiliate Support** — Per-source and per-link affiliate tags
- **Ask the Librarian** — AI-powered recommendations (deterministic fallback when AI not configured)
- **Stripe Subscriptions** — Free and Premium tiers
- **SEO Optimized** — Metadata, sitemap, robots.txt, Open Graph tags
- **Responsive** — Mobile-first design
- **CSV Import** — Bulk-add books via CSV upload

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (local or Neon free tier)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/living-books-hub.git
cd living-books-hub

# Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local → set NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
cd ../backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
# Edit .env → set DATABASE_URL to your Postgres connection string
```

### 2. Database Setup

```bash
# Create database (if using local Postgres)
createdb living_books

# Run migrations
cd backend
alembic upgrade head

# Seed with 50+ living books, sources, links, and curated lists
python -m scripts.seed
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (asyncpg) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS |
| `STRIPE_SECRET_KEY` | No | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | No | Stripe price ID for premium tier |
| `ADMIN_API_KEY` | Yes | API key for admin endpoints |
| `LLM_ENABLED` | No | Enable AI librarian (default: false) |
| `ANTHROPIC_API_KEY` | No | Claude API key (only if LLM_ENABLED=true) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |

---

## Deploy

### Backend → Render

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Set environment variables in Render dashboard
6. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Select your GitHub repo, set root directory to `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Deploy

### Database → Neon

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string (use the `asyncpg` variant)
3. Set `DATABASE_URL` in Render env vars
4. Run migrations: `alembic upgrade head`
5. Seed data: `python -m scripts.seed`

---

## Adding Books

### Option 1: Admin API

```bash
curl -X POST http://localhost:8000/api/v1/admin/books \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-admin-key" \
  -d '{
    "title": "Book Title",
    "author": "Author Name",
    "description": "Short description",
    "age_range": "8-12",
    "subjects": ["history", "adventure"]
  }'
```

### Option 2: CSV Import

```bash
curl -X POST http://localhost:8000/api/v1/admin/books/import-csv \
  -H "X-API-Key: your-admin-key" \
  -F "file=@books.csv"
```

CSV columns: `title,author,description,age_range,subjects,reading_level,time_period,region,isbn,cover_image_url,language,series,awards,popularity_score,page_count,publication_year,publisher`

(Subjects and awards are pipe-delimited: `history|adventure`)

### Option 3: Seed Script

Edit `backend/scripts/seed.py` and add books to the `BOOKS` list, then re-run:

```bash
cd backend
python -m scripts.seed
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/books` | Search/filter/paginate books |
| GET | `/api/v1/books/{id}` | Book detail with purchase links |
| GET | `/api/v1/books/{id}/related` | Related books |
| GET | `/api/v1/books/filters` | Available filter options |
| GET | `/api/v1/lists` | All curated lists |
| GET | `/api/v1/lists/{slug}` | List detail with books |
| GET | `/api/v1/stats` | Catalog statistics |
| POST | `/api/v1/librarian` | Ask the Librarian |
| POST | `/api/v1/stripe/create-checkout-session` | Stripe checkout |
| POST | `/api/v1/stripe/webhook` | Stripe webhooks |
| POST | `/api/v1/admin/books` | Create book (admin) |
| POST | `/api/v1/admin/books/import-csv` | Import CSV (admin) |
| POST | `/api/v1/admin/sources` | Create source (admin) |
| POST | `/api/v1/admin/book-links` | Create book link (admin) |
| POST | `/api/v1/admin/lists` | Create curated list (admin) |

Full OpenAPI docs available at `/docs` when the backend is running.

---

## Project Structure

```
living-books-hub/
├── .claude/                 # Claude Code scaffolding
│   ├── CLAUDE.md           # Project constitution
│   ├── settings.json       # Hooks & permissions
│   ├── skills/             # 6 reusable skill definitions
│   └── agents/             # 4 specialized agent configs
├── frontend/               # Next.js App Router
│   ├── src/
│   │   ├── app/            # Pages (home, search, books/[id], lists, subscribe)
│   │   ├── components/     # Reusable UI (Header, Footer, BookCard, etc.)
│   │   ├── lib/            # API client
│   │   └── types/          # TypeScript interfaces
│   ├── tailwind.config.ts
│   └── vercel.json
├── backend/                # FastAPI
│   ├── app/
│   │   ├── api/            # Route handlers (books, lists, admin, stripe, librarian)
│   │   ├── core/           # Config, database
│   │   ├── models/         # SQLAlchemy models + Pydantic schemas
│   │   └── services/       # Business logic
│   ├── migrations/         # Alembic migrations
│   ├── scripts/            # Seed script (50+ books)
│   └── Dockerfile
├── render.yaml             # Render deployment config
├── .gitignore
└── README.md
```
