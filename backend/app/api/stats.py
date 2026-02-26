from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.book import Book
from app.models.list import CuratedList
from app.models.schemas import CatalogStats

router = APIRouter(prefix="/api/v1/stats", tags=["stats"])


@router.get("", response_model=CatalogStats)
async def get_catalog_stats(db: AsyncSession = Depends(get_db)):
    """Get high-level catalog statistics for the landing page."""
    total_books = (await db.execute(select(func.count(Book.id)))).scalar() or 0
    total_lists = (await db.execute(select(func.count(CuratedList.id)))).scalar() or 0

    subjects_q = await db.execute(select(func.unnest(Book.subjects)).distinct())
    subjects = sorted([r[0] for r in subjects_q.all()])

    age_q = await db.execute(select(Book.age_range).distinct().order_by(Book.age_range))
    age_ranges = [r[0] for r in age_q.all()]

    level_q = await db.execute(
        select(Book.reading_level).where(Book.reading_level.isnot(None)).distinct()
    )
    reading_levels = sorted([r[0] for r in level_q.all()])

    return CatalogStats(
        total_books=total_books,
        total_lists=total_lists,
        subjects=subjects,
        age_ranges=age_ranges,
        reading_levels=reading_levels,
    )
