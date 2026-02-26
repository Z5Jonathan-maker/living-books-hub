from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import admin, books, librarian, lists, stats, stripe_routes
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Living Books Hub API",
    description=(
        "The definitive API for discovering living books — curated, searchable, "
        "and designed for homeschool and alternative education families."
    ),
    version="1.0.0",
    lifespan=lifespan,
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
