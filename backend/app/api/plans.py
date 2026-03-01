from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.books import _ensure_cover_url
from app.core.auth import require_user
from app.core.database import get_db
from app.models.book import Book
from app.models.reading_plan import ReadingPlan, ReadingPlanItem
from app.models.schemas import (
    BookSummary,
    ImportLocalPlanRequest,
    ReadingPlanCreate,
    ReadingPlanDetail,
    ReadingPlanItemCreate,
    ReadingPlanItemOut,
    ReadingPlanItemUpdate,
    ReadingPlanOut,
)
from app.models.user import User

router = APIRouter(prefix="/api/v1/users/plans", tags=["reading-plans"])


@router.get("", response_model=list[ReadingPlanOut])
async def list_plans(
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """List all reading plans for the current user."""
    result = await db.execute(
        select(ReadingPlan)
        .where(ReadingPlan.user_id == user.id)
        .order_by(ReadingPlan.created_at.desc())
    )
    plans = result.scalars().all()

    out = []
    for p in plans:
        count = (
            await db.execute(
                select(func.count())
                .select_from(ReadingPlanItem)
                .where(ReadingPlanItem.plan_id == p.id)
            )
        ).scalar() or 0
        plan_out = ReadingPlanOut.model_validate(p)
        plan_out.item_count = count
        out.append(plan_out)
    return out


@router.post("", response_model=ReadingPlanOut, status_code=201)
async def create_plan(
    req: ReadingPlanCreate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new reading plan."""
    plan = ReadingPlan(
        user_id=user.id,
        child_id=req.child_id,
        name=req.name,
        description=req.description,
    )
    db.add(plan)
    await db.flush()
    await db.commit()
    plan_out = ReadingPlanOut.model_validate(plan)
    plan_out.item_count = 0
    return plan_out


@router.get("/{plan_id}", response_model=ReadingPlanDetail)
async def get_plan(
    plan_id: int,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a reading plan with all items and book details."""
    result = await db.execute(
        select(ReadingPlan)
        .options(selectinload(ReadingPlan.items).selectinload(ReadingPlanItem.book))
        .where(ReadingPlan.id == plan_id, ReadingPlan.user_id == user.id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    items_out = []
    for item in plan.items:
        book_summary = BookSummary.model_validate(item.book)
        book_summary.cover_image_url = _ensure_cover_url(item.book)
        items_out.append(
            ReadingPlanItemOut(
                id=item.id,
                book=book_summary,
                week_number=item.week_number,
                order_in_week=item.order_in_week,
                notes=item.notes,
                status=item.status,
                created_at=item.created_at,
            )
        )

    return ReadingPlanDetail(
        id=plan.id,
        name=plan.name,
        description=plan.description,
        child_id=plan.child_id,
        is_ai_generated=plan.is_ai_generated,
        created_at=plan.created_at,
        item_count=len(items_out),
        items=items_out,
    )


@router.post("/{plan_id}/items", response_model=ReadingPlanItemOut, status_code=201)
async def add_item_to_plan(
    plan_id: int,
    req: ReadingPlanItemCreate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a book to a reading plan."""
    # Verify plan ownership
    result = await db.execute(
        select(ReadingPlan).where(ReadingPlan.id == plan_id, ReadingPlan.user_id == user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Plan not found")

    # Verify book exists
    book_result = await db.execute(select(Book).where(Book.id == req.book_id))
    book = book_result.scalar_one_or_none()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    item = ReadingPlanItem(
        plan_id=plan_id,
        book_id=req.book_id,
        week_number=req.week_number,
        order_in_week=req.order_in_week,
        notes=req.notes,
    )
    db.add(item)
    await db.flush()
    await db.commit()

    book_summary = BookSummary.model_validate(book)
    book_summary.cover_image_url = _ensure_cover_url(book)
    return ReadingPlanItemOut(
        id=item.id,
        book=book_summary,
        week_number=item.week_number,
        order_in_week=item.order_in_week,
        notes=item.notes,
        status=item.status,
        created_at=item.created_at,
    )


@router.patch("/{plan_id}/items/{item_id}", response_model=ReadingPlanItemOut)
async def update_plan_item(
    plan_id: int,
    item_id: int,
    req: ReadingPlanItemUpdate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a plan item (status, notes, week)."""
    result = await db.execute(
        select(ReadingPlanItem)
        .join(ReadingPlan)
        .options(selectinload(ReadingPlanItem.book))
        .where(
            ReadingPlanItem.id == item_id,
            ReadingPlanItem.plan_id == plan_id,
            ReadingPlan.user_id == user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if req.status is not None:
        item.status = req.status
    if req.notes is not None:
        item.notes = req.notes
    if req.week_number is not None:
        item.week_number = req.week_number

    await db.commit()

    book_summary = BookSummary.model_validate(item.book)
    book_summary.cover_image_url = _ensure_cover_url(item.book)
    return ReadingPlanItemOut(
        id=item.id,
        book=book_summary,
        week_number=item.week_number,
        order_in_week=item.order_in_week,
        notes=item.notes,
        status=item.status,
        created_at=item.created_at,
    )


@router.delete("/{plan_id}", status_code=204)
async def delete_plan(
    plan_id: int,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a reading plan and all its items."""
    result = await db.execute(
        select(ReadingPlan).where(ReadingPlan.id == plan_id, ReadingPlan.user_id == user.id)
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    await db.delete(plan)
    await db.commit()


@router.delete("/{plan_id}/items/{item_id}", status_code=204)
async def delete_plan_item(
    plan_id: int,
    item_id: int,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a book from a reading plan."""
    result = await db.execute(
        select(ReadingPlanItem)
        .join(ReadingPlan)
        .where(
            ReadingPlanItem.id == item_id,
            ReadingPlanItem.plan_id == plan_id,
            ReadingPlan.user_id == user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(item)
    await db.commit()


@router.post("/import-local", response_model=ReadingPlanOut, status_code=201)
async def import_local_plan(
    req: ImportLocalPlanRequest,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Import a localStorage reading plan to the server."""
    plan = ReadingPlan(
        user_id=user.id,
        name=req.name,
        description="Imported from your browser",
    )
    db.add(plan)
    await db.flush()

    added = 0
    for item_data in req.items:
        book_id = item_data.get("book_id")
        if not book_id:
            continue
        # Verify book exists
        book_result = await db.execute(select(Book).where(Book.id == book_id))
        if not book_result.scalar_one_or_none():
            continue
        item = ReadingPlanItem(
            plan_id=plan.id,
            book_id=book_id,
            status=item_data.get("status", "to-read"),
            notes=item_data.get("notes"),
        )
        db.add(item)
        added += 1

    await db.commit()

    plan_out = ReadingPlanOut.model_validate(plan)
    plan_out.item_count = added
    return plan_out
