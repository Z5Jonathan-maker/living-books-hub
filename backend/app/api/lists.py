from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.books import _ensure_cover_url
from app.core.database import get_db
from app.models.list import CuratedList, ListItem
from app.models.schemas import BookSummary, CuratedListDetail, CuratedListOut, ListItemOut

router = APIRouter(prefix="/api/v1/lists", tags=["curated lists"])


@router.get("", response_model=list[CuratedListOut])
async def get_lists(
    featured: bool | None = None,
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Get all curated lists with book counts."""
    query = select(CuratedList)

    if featured is not None:
        query = query.where(CuratedList.is_featured == featured)
    if category:
        query = query.where(CuratedList.category == category)

    query = query.order_by(CuratedList.is_featured.desc(), CuratedList.name)
    result = await db.execute(query)
    lists = result.scalars().all()

    # Get book counts
    out = []
    for lst in lists:
        count_q = select(func.count()).select_from(ListItem).where(ListItem.list_id == lst.id)
        count = (await db.execute(count_q)).scalar() or 0
        lst_dict = CuratedListOut.model_validate(lst)
        lst_dict.book_count = count
        out.append(lst_dict)

    return out


@router.get("/categories")
async def get_list_categories(db: AsyncSession = Depends(get_db)):
    """Get distinct list categories."""
    result = await db.execute(
        select(CuratedList.category)
        .where(CuratedList.category.isnot(None))
        .distinct()
        .order_by(CuratedList.category)
    )
    return [r[0] for r in result.all()]


@router.get("/{slug}", response_model=CuratedListDetail)
async def get_list_detail(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single curated list with all books."""
    result = await db.execute(
        select(CuratedList)
        .options(selectinload(CuratedList.items).selectinload(ListItem.book))
        .where(CuratedList.slug == slug)
    )
    lst = result.scalar_one_or_none()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")

    items_out = []
    for item in sorted(lst.items, key=lambda x: x.rank):
        book_summary = BookSummary.model_validate(item.book)
        book_summary.cover_image_url = _ensure_cover_url(item.book)
        items_out.append(
            ListItemOut(
                id=item.id,
                book=book_summary,
                rank=item.rank,
                note=item.note,
            )
        )

    return CuratedListDetail(
        id=lst.id,
        name=lst.name,
        slug=lst.slug,
        description=lst.description,
        cover_image_url=lst.cover_image_url,
        category=lst.category,
        is_featured=lst.is_featured,
        book_count=len(items_out),
        created_at=lst.created_at,
        items=items_out,
    )
