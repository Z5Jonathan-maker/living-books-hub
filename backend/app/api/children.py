from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_user
from app.core.database import get_db
from app.models.child import Child
from app.models.schemas import ChildCreate, ChildOut, ChildUpdate
from app.models.user import User

router = APIRouter(prefix="/api/v1/users/children", tags=["children"])


@router.get("", response_model=list[ChildOut])
async def list_children(
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """List all children for the current user."""
    result = await db.execute(
        select(Child).where(Child.user_id == user.id).order_by(Child.created_at)
    )
    return [ChildOut.model_validate(c) for c in result.scalars().all()]


@router.post("", response_model=ChildOut, status_code=201)
async def create_child(
    req: ChildCreate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a child profile. Free tier: max 1 child."""
    # Check limit for free users
    if user.subscription_tier == "free":
        count = (
            await db.execute(
                select(func.count()).select_from(Child).where(Child.user_id == user.id)
            )
        ).scalar() or 0
        if count >= 1:
            raise HTTPException(
                status_code=403,
                detail="Free accounts can add 1 child. Upgrade to Premium for unlimited.",
            )

    child = Child(
        user_id=user.id,
        name=req.name,
        birth_year=req.birth_year,
        grade_level=req.grade_level,
        interests=req.interests,
        reading_level=req.reading_level,
    )
    db.add(child)
    await db.flush()
    await db.commit()
    return ChildOut.model_validate(child)


@router.put("/{child_id}", response_model=ChildOut)
async def update_child(
    child_id: int,
    req: ChildUpdate,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a child profile."""
    result = await db.execute(
        select(Child).where(Child.id == child_id, Child.user_id == user.id)
    )
    child = result.scalar_one_or_none()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    if req.name is not None:
        child.name = req.name
    if req.birth_year is not None:
        child.birth_year = req.birth_year
    if req.grade_level is not None:
        child.grade_level = req.grade_level
    if req.interests is not None:
        child.interests = req.interests
    if req.reading_level is not None:
        child.reading_level = req.reading_level

    await db.commit()
    return ChildOut.model_validate(child)


@router.delete("/{child_id}", status_code=204)
async def delete_child(
    child_id: int,
    user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a child profile."""
    result = await db.execute(
        select(Child).where(Child.id == child_id, Child.user_id == user.id)
    )
    child = result.scalar_one_or_none()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    await db.delete(child)
    await db.commit()
