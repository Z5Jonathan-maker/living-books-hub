from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.books import _ensure_cover_url
from app.core.auth import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import free_librarian_limiter, librarian_limiter
from app.models.book import Book
from app.models.child import Child
from app.models.schemas import BookSummary, LibrarianRequest, LibrarianResponse
from app.models.user import User
from app.services.ai import ask_librarian_ai

router = APIRouter(prefix="/api/v1/librarian", tags=["librarian"])


async def _deterministic_suggestions(
    message: str, db: AsyncSession
) -> tuple[str, list[BookSummary]]:
    """Fallback: return database-driven suggestions without LLM."""
    msg = message.lower()

    # Extract potential subjects/keywords
    query = select(Book)

    # Simple keyword matching against subjects, title, description
    if len(msg) > 2:
        # Escape SQL LIKE wildcards in user input
        escaped = msg.replace("%", r"\%").replace("_", r"\_")
        query = query.where(
            (Book.title.ilike(f"%{escaped}%", escape="\\"))
            | (Book.author.ilike(f"%{escaped}%", escape="\\"))
            | (Book.description.ilike(f"%{escaped}%", escape="\\"))
        )

    query = query.order_by(Book.popularity_score.desc()).limit(5)
    result = await db.execute(query)
    books = result.scalars().all()

    if books:
        reply = (
            f"Based on your interest in \"{message}\", here are some living books "
            f"I'd recommend from our collection:"
        )
    else:
        # Fallback to top popular books
        result = await db.execute(
            select(Book).order_by(Book.popularity_score.desc()).limit(5)
        )
        books = result.scalars().all()
        reply = (
            "I couldn't find an exact match, but here are some of our most beloved "
            "living books that families love:"
        )

    items = []
    for b in books:
        summary = BookSummary.model_validate(b)
        summary.cover_image_url = _ensure_cover_url(b)
        items.append(summary)
    return reply, items


@router.post("", response_model=LibrarianResponse)
async def ask_librarian(
    request: Request,
    req: LibrarianRequest,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user),
):
    """
    Ask the Librarian — an intelligent book recommendation endpoint.
    Uses Groq Llama 3.3 70B when available, with family context if logged in.
    Falls back to deterministic database-driven recommendations.
    """
    librarian_limiter.check(request)

    # Free tier: 5 requests/day. Premium: unlimited.
    is_premium = user and user.subscription_tier == "premium" and user.subscription_active
    if user and not is_premium:
        await free_librarian_limiter.check(user.id)

    if settings.groq_enabled and settings.groq_api_key:
        try:
            # Get books for context
            result = await db.execute(
                select(Book).order_by(Book.popularity_score.desc()).limit(50)
            )
            books = result.scalars().all()
            book_catalog = "\n".join(
                f"- \"{b.title}\" by {b.author} (ages {b.age_range}, "
                f"subjects: {', '.join(b.subjects)})"
                for b in books
            )

            # Build family context (premium only — personalized recommendations)
            family_context = None
            if user and is_premium:
                children_result = await db.execute(
                    select(Child).where(Child.user_id == user.id)
                )
                children = children_result.scalars().all()
                if children:
                    parts = []
                    for c in children:
                        interests = ", ".join(c.interests) if c.interests else "various"
                        parts.append(
                            f"- {c.name}: grade {c.grade_level or 'unspecified'}, "
                            f"reading level {c.reading_level or 'unspecified'}, "
                            f"interests: {interests}"
                        )
                    family_context = "Children:\n" + "\n".join(parts)

            reply = ask_librarian_ai(req.message, book_catalog, family_context)

            # Find mentioned books
            mentioned = []
            for b in books:
                if b.title.lower() in reply.lower():
                    summary = BookSummary.model_validate(b)
                    summary.cover_image_url = _ensure_cover_url(b)
                    mentioned.append(summary)

            if not mentioned:
                for b in books[:3]:
                    summary = BookSummary.model_validate(b)
                    summary.cover_image_url = _ensure_cover_url(b)
                    mentioned.append(summary)

            return LibrarianResponse(reply=reply, suggested_books=mentioned)
        except Exception:
            pass

    # Fallback to deterministic
    reply, suggested = await _deterministic_suggestions(req.message, db)
    return LibrarianResponse(reply=reply, suggested_books=suggested)
