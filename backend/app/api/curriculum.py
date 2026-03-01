import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_premium
from app.core.database import get_db
from app.models.book import Book
from app.models.child import Child
from app.models.reading_plan import ReadingPlan, ReadingPlanItem
from app.models.schemas import CurriculumRequest, CurriculumResponse
from app.models.user import User
from app.services.ai import generate_curriculum

router = APIRouter(prefix="/api/v1/ai", tags=["ai-curriculum"])


@router.post("/curriculum", response_model=CurriculumResponse)
async def build_curriculum(
    req: CurriculumRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_premium),
):
    """
    AI Curriculum Builder — generates a full-year reading plan.
    Premium only.
    """
    # Load child profile
    result = await db.execute(
        select(Child).where(Child.id == req.child_id, Child.user_id == user.id)
    )
    child = result.scalar_one_or_none()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    # Calculate age
    current_year = datetime.datetime.now().year
    child_age = current_year - child.birth_year if child.birth_year else 8

    # Build catalog context — filter by approximate age range
    stmt = select(Book).order_by(Book.popularity_score.desc())
    all_books = (await db.execute(stmt)).scalars().all()

    # Build condensed catalog string
    catalog_lines = []
    for b in all_books[:200]:  # Limit to top 200 for context window
        subjects = ", ".join(b.subjects) if b.subjects else "general"
        catalog_lines.append(
            f"- \"{b.title}\" by {b.author} | Ages {b.age_range} | "
            f"Level: {b.reading_level or 'unspecified'} | Subjects: {subjects}"
        )
    book_catalog = "\n".join(catalog_lines)

    # Generate curriculum via Groq
    try:
        result_data = generate_curriculum(
            child_name=child.name,
            child_age=child_age,
            interests=child.interests,
            reading_level=child.reading_level,
            book_catalog=book_catalog,
            preferences=req.preferences,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate curriculum. Please try again.",
        )

    # Create reading plan
    plan_name = result_data.get("plan_name", f"{child.name}'s Reading Year")
    plan = ReadingPlan(
        user_id=user.id,
        child_id=child.id,
        name=plan_name,
        description=result_data.get("description", "AI-generated curriculum"),
        is_ai_generated=True,
    )
    db.add(plan)
    await db.flush()

    # Match AI-suggested books to actual database books
    matched_count = 0
    for term in result_data.get("terms", []):
        for week in term.get("weeks", []):
            week_num = week.get("week_number", 0)
            for order, book_rec in enumerate(week.get("books", [])):
                title = book_rec.get("title", "")
                if not title:
                    continue

                # Fuzzy match: try exact, then ILIKE
                book_result = await db.execute(
                    select(Book).where(Book.title == title).limit(1)
                )
                book = book_result.scalar_one_or_none()

                if not book:
                    book_result = await db.execute(
                        select(Book).where(Book.title.ilike(f"%{title}%")).limit(1)
                    )
                    book = book_result.scalar_one_or_none()

                if book:
                    item = ReadingPlanItem(
                        plan_id=plan.id,
                        book_id=book.id,
                        week_number=week_num,
                        order_in_week=order,
                        notes=book_rec.get("notes", ""),
                    )
                    db.add(item)
                    matched_count += 1

    await db.commit()

    return CurriculumResponse(
        plan_id=plan.id,
        plan_name=plan_name,
        message=f"Created a reading plan with {matched_count} books for {child.name}!",
    )
