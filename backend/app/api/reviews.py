from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_user
from app.core.database import get_db
from app.models.book import Book
from app.models.review import BookReview
from app.models.schemas import ReviewCreate, ReviewOut, ReviewSummary
from app.models.user import User

router = APIRouter(prefix="/api/v1/books", tags=["reviews"])


@router.get("/{book_id}/reviews", response_model=list[ReviewOut])
async def get_reviews(
    book_id: int,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get reviews for a book (public)."""
    offset = (page - 1) * per_page
    result = await db.execute(
        select(BookReview, User.name)
        .join(User)
        .where(BookReview.book_id == book_id)
        .order_by(BookReview.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )

    reviews = []
    for review, user_name in result.all():
        reviews.append(
            ReviewOut(
                id=review.id,
                user_name=user_name or "Anonymous",
                rating=review.rating,
                review_text=review.review_text,
                child_age_when_read=review.child_age_when_read,
                created_at=review.created_at,
            )
        )
    return reviews


@router.get("/{book_id}/reviews/summary", response_model=ReviewSummary)
async def get_review_summary(
    book_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get aggregate rating and count for a book (public)."""
    result = await db.execute(
        select(func.avg(BookReview.rating), func.count())
        .where(BookReview.book_id == book_id)
    )
    row = result.one()
    avg_rating = float(row[0]) if row[0] else None
    count = row[1]
    return ReviewSummary(
        avg_rating=round(avg_rating, 1) if avg_rating else None,
        review_count=count,
    )


@router.post("/{book_id}/reviews", response_model=ReviewOut, status_code=201)
async def create_review(
    book_id: int,
    req: ReviewCreate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a review for a book (one per user per book)."""
    # Verify book exists
    book = (await db.execute(select(Book).where(Book.id == book_id))).scalar_one_or_none()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check for existing review
    existing = (
        await db.execute(
            select(BookReview).where(
                BookReview.user_id == user.id, BookReview.book_id == book_id
            )
        )
    ).scalar_one_or_none()

    if existing:
        # Update existing review
        existing.rating = req.rating
        existing.review_text = req.review_text
        existing.child_age_when_read = req.child_age_when_read
        await db.commit()
        return ReviewOut(
            id=existing.id,
            user_name=user.name or "Anonymous",
            rating=existing.rating,
            review_text=existing.review_text,
            child_age_when_read=existing.child_age_when_read,
            created_at=existing.created_at,
        )

    review = BookReview(
        user_id=user.id,
        book_id=book_id,
        rating=req.rating,
        review_text=req.review_text,
        child_age_when_read=req.child_age_when_read,
    )
    db.add(review)
    await db.flush()
    await db.commit()

    return ReviewOut(
        id=review.id,
        user_name=user.name or "Anonymous",
        rating=review.rating,
        review_text=review.review_text,
        child_age_when_read=review.child_age_when_read,
        created_at=review.created_at,
    )


@router.delete("/{book_id}/reviews", status_code=204)
async def delete_review(
    book_id: int,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete your review for a book."""
    result = await db.execute(
        select(BookReview).where(
            BookReview.user_id == user.id, BookReview.book_id == book_id
        )
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(review)
    await db.commit()
