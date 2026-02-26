from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.book import Book, BookLink, Source
from app.models.schemas import BookOut, BookSearchParams, BookSummary, BookLinkOut, PaginatedBooks

router = APIRouter(prefix="/api/v1/books", tags=["books"])


@router.get("", response_model=PaginatedBooks)
async def search_books(
    q: str | None = None,
    age_range: str | None = None,
    subject: str | None = None,
    time_period: str | None = None,
    region: str | None = None,
    reading_level: str | None = None,
    language: str | None = None,
    sort: str = "popularity",
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Search and filter books with pagination."""
    query = select(Book)

    # Text search
    if q:
        search_term = f"%{q}%"
        query = query.where(
            (Book.title.ilike(search_term))
            | (Book.author.ilike(search_term))
            | (Book.description.ilike(search_term))
        )

    # Filters
    if age_range:
        query = query.where(Book.age_range == age_range)
    if subject:
        query = query.where(Book.subjects.any(subject))
    if time_period:
        query = query.where(Book.time_period == time_period)
    if region:
        query = query.where(Book.region == region)
    if reading_level:
        query = query.where(Book.reading_level == reading_level)
    if language:
        query = query.where(Book.language == language)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Sorting
    if sort == "popularity":
        query = query.order_by(Book.popularity_score.desc())
    elif sort == "title":
        query = query.order_by(Book.title.asc())
    elif sort == "author":
        query = query.order_by(Book.author.asc())
    elif sort == "newest":
        query = query.order_by(Book.created_at.desc())
    else:
        query = query.order_by(Book.popularity_score.desc())

    # Pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    result = await db.execute(query)
    books = result.scalars().all()

    return PaginatedBooks(
        items=[BookSummary.model_validate(b) for b in books],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page if per_page else 1,
    )


@router.get("/filters")
async def get_filter_options(db: AsyncSession = Depends(get_db)):
    """Get available filter values for the UI."""
    # Get distinct age ranges
    age_ranges_q = await db.execute(
        select(Book.age_range).distinct().order_by(Book.age_range)
    )
    age_ranges = [r[0] for r in age_ranges_q.all()]

    # Get distinct reading levels
    levels_q = await db.execute(
        select(Book.reading_level).where(Book.reading_level.isnot(None)).distinct()
    )
    reading_levels = sorted([r[0] for r in levels_q.all()])

    # Get all subjects (flatten arrays)
    subjects_q = await db.execute(
        select(func.unnest(Book.subjects)).distinct()
    )
    subjects = sorted([r[0] for r in subjects_q.all()])

    # Get distinct time periods
    periods_q = await db.execute(
        select(Book.time_period).where(Book.time_period.isnot(None)).distinct()
    )
    time_periods = sorted([r[0] for r in periods_q.all()])

    # Get distinct regions
    regions_q = await db.execute(
        select(Book.region).where(Book.region.isnot(None)).distinct()
    )
    regions = sorted([r[0] for r in regions_q.all()])

    # Get distinct languages
    langs_q = await db.execute(select(Book.language).distinct())
    languages = sorted([r[0] for r in langs_q.all()])

    return {
        "age_ranges": age_ranges,
        "reading_levels": reading_levels,
        "subjects": subjects,
        "time_periods": time_periods,
        "regions": regions,
        "languages": languages,
    }


@router.get("/{book_id}", response_model=BookOut)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single book with all details and purchase links."""
    result = await db.execute(
        select(Book)
        .options(selectinload(Book.links).selectinload(BookLink.source))
        .where(Book.id == book_id)
    )
    book = result.scalar_one_or_none()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Build response with source info in links
    links_out = []
    for link in book.links:
        links_out.append(
            BookLinkOut(
                id=link.id,
                source_name=link.source.name,
                source_logo_url=link.source.logo_url,
                url=link.url,
                link_type=link.link_type,
                price_hint=link.price_hint,
            )
        )

    book_dict = {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "description": book.description,
        "long_description": book.long_description,
        "reading_level": book.reading_level,
        "age_range": book.age_range,
        "subjects": book.subjects,
        "time_period": book.time_period,
        "region": book.region,
        "isbn": book.isbn,
        "cover_image_url": book.cover_image_url,
        "language": book.language,
        "series": book.series,
        "awards": book.awards,
        "popularity_score": book.popularity_score,
        "page_count": book.page_count,
        "publication_year": book.publication_year,
        "publisher": book.publisher,
        "created_at": book.created_at,
        "links": links_out,
    }
    return BookOut(**book_dict)


@router.get("/{book_id}/related", response_model=list[BookSummary])
async def get_related_books(book_id: int, limit: int = 6, db: AsyncSession = Depends(get_db)):
    """Get related books based on shared subjects and age range."""
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Find books sharing subjects or age range, excluding current
    query = (
        select(Book)
        .where(Book.id != book_id)
        .where(
            (Book.subjects.overlap(book.subjects))
            | (Book.age_range == book.age_range)
        )
        .order_by(Book.popularity_score.desc())
        .limit(limit)
    )
    result = await db.execute(query)
    related = result.scalars().all()
    return [BookSummary.model_validate(b) for b in related]
