import logging
from contextlib import asynccontextmanager

import fastapi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    admin,
    auth,
    books,
    children,
    curriculum,
    librarian,
    lists,
    newsletter,
    plans,
    reviews,
    stats,
    stripe_routes,
    tracking,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run seed on startup if DB is empty
    try:
        from scripts.seed import seed
        await seed()
    except Exception as e:
        logger.warning("Seed on startup failed: %s", e)
    yield


app = FastAPI(
    title="Living Books Hub API",
    description=(
        "The definitive API for discovering living books — curated, searchable, "
        "and designed for homeschool and alternative education families."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(books.router)
app.include_router(lists.router)
app.include_router(stats.router)
app.include_router(librarian.router)
app.include_router(stripe_routes.router)
app.include_router(admin.router)
app.include_router(newsletter.router)
app.include_router(tracking.router)
app.include_router(auth.router)
app.include_router(children.router)
app.include_router(plans.router)
app.include_router(reviews.router)
app.include_router(curriculum.router)


@app.get("/", tags=["health"])
async def health():
    return {
        "status": "healthy",
        "service": "Living Books Hub API",
        "version": "1.0.0",
    }


@app.get("/api/v1", tags=["health"])
async def api_root():
    return {
        "message": "Welcome to the Living Books Hub API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.post("/api/v1/admin/seed", tags=["admin"])
async def trigger_seed(x_api_key: str = fastapi.Header(...)):
    """Admin-only: trigger database seed. Returns result or error."""
    import hmac
    if not hmac.compare_digest(x_api_key, settings.admin_api_key):
        raise fastapi.HTTPException(status_code=403, detail="Invalid admin key")
    import traceback
    try:
        from scripts.seed import seed
        await seed()
        return {"status": "ok", "message": "Seed completed"}
    except Exception as e:
        return {"status": "error", "error": str(e), "traceback": traceback.format_exc()}
