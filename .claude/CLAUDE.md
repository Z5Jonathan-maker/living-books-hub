# Living Books Hub - Project Constitution

## Overview
A searchable, curated database helping homeschool/alternative-education parents find "living books." We do NOT store inventory — each book links out to external buy/rent sites with affiliate support.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS → deployed on Vercel
- **Backend**: FastAPI (Python 3.11+) → deployed on Render
- **Database**: Postgres (Neon) with Alembic migrations
- **Auth**: Optional magic-link email auth (v2)
- **Payments**: Stripe subscriptions (free + paid tiers)

## Project Structure
```
/frontend    — Next.js app (App Router, TypeScript, Tailwind)
/backend     — FastAPI app (Python, SQLAlchemy, Alembic)
/shared      — Shared type definitions / schemas
/.claude     — Claude Code project scaffolding
```

## Key Conventions
- All API routes prefixed with `/api/v1/`
- Environment variables in `.env` files (never committed); `.env.example` provided
- Backend uses async SQLAlchemy with Alembic migrations
- Frontend uses server components by default; client components only when needed
- Tailwind for all styling — no CSS modules or styled-components
- All monetary values in cents (integer)

## Code Standards
- **Python**: ruff format + ruff check, type hints everywhere
- **TypeScript**: strict mode, prettier formatting
- **Tests**: pytest (backend), vitest (frontend)
- **Commits**: conventional commits (feat:, fix:, chore:, docs:)

## Protected Files
These files should NOT be edited without explicit instruction:
- `.env` / `.env.local` (secrets)
- `package-lock.json` / `poetry.lock` (lockfiles)
- `alembic.ini` (migration config)

## Database
- Always use Alembic for schema changes — never raw SQL in production
- Models in `backend/app/models/`
- Keep migrations reversible (include downgrade)

## API Design
- RESTful endpoints, JSON responses
- Pydantic schemas for request/response validation
- OpenAPI docs auto-generated at `/docs`

## Deployment
- Frontend: `vercel` CLI or GitHub integration
- Backend: Render web service with `render.yaml`
- Database: Neon Postgres (connection string in env vars)
