from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.book import Book
from app.models.schemas import BookSummary, LibrarianRequest, LibrarianResponse
from app.api.books import _ensure_cover_url

router = APIRouter(prefix="/api/v1/librarian", tags=["librarian"])


async def _deterministic_suggestions(
    message: str, db: AsyncSession
) -> tuple[str, list[BookSummary]]:
    """Fallback: return database-driven suggestions without LLM."""
    msg = message.lower()

    # Extract potential subjects/keywords
    query = select(Book)

    # Simple keyword matching against subjects, title, description
    search = f"%{msg.split()[0] if msg.split() else ''}%"
    if len(msg) > 2:
        query = query.where(
            (Book.title.ilike(f"%{msg}%"))
            | (Book.author.ilike(f"%{msg}%"))
            | (Book.description.ilike(f"%{msg}%"))
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
    req: LibrarianRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Ask the Librarian — an intelligent book recommendation endpoint.
    When LLM is enabled, uses AI to provide personalized suggestions.
    Otherwise, returns deterministic database-driven recommendations.
    """
    if settings.llm_enabled and settings.anthropic_api_key:
        try:
            import anthropic

            client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

            # Get some books for context
            result = await db.execute(
                select(Book).order_by(Book.popularity_score.desc()).limit(20)
            )
            books = result.scalars().all()
            book_list = "\n".join(
                f"- {b.title} by {b.author} (ages {b.age_range}, subjects: {', '.join(b.subjects)})"
                for b in books
            )

            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                system=(
                    "You are a warm, knowledgeable librarian specializing in 'living books' — "
                    "books that are written by passionate authors, tell stories that bring subjects "
                    "alive, and engage the imagination. You help homeschool and alternative education "
                    "families find the perfect books. Only recommend books from this catalog:\n\n"
                    f"{book_list}\n\n"
                    "Be warm, specific, and helpful. Explain why each book is special."
                ),
                messages=[{"role": "user", "content": req.message}],
            )

            reply = response.content[0].text

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
