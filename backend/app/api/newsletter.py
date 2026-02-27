from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select, func
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import newsletter_limiter
from app.models.subscriber import EmailSubscriber
from app.models.schemas import (
    NewsletterSubscribeRequest,
    NewsletterSubscribeResponse,
    NewsletterExportResponse,
)

router = APIRouter(prefix="/api/v1/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterSubscribeResponse)
async def subscribe(
    request: Request,
    req: NewsletterSubscribeRequest,
    db: AsyncSession = Depends(get_db),
):
    newsletter_limiter.check(request)
    """Subscribe to the newsletter. Idempotent — re-subscribing the same email is a no-op."""
    try:
        stmt = (
            pg_insert(EmailSubscriber)
            .values(
                email=req.email.lower().strip(),
                name=req.name,
                signup_source=req.signup_source,
                utm_source=req.utm_source,
                utm_medium=req.utm_medium,
                utm_campaign=req.utm_campaign,
            )
            .on_conflict_do_nothing(index_elements=["email"])
        )
        await db.execute(stmt)
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Unable to process subscription right now.")
    return NewsletterSubscribeResponse(
        success=True, message="You're subscribed! Welcome to the Living Books community."
    )


@router.get("/export", response_model=list[NewsletterExportResponse])
async def export_subscribers(
    x_admin_key: str = Header(..., alias="X-Admin-Key"),
    db: AsyncSession = Depends(get_db),
):
    """Admin-only export of all subscribers."""
    if x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")

    result = await db.execute(
        select(EmailSubscriber).order_by(EmailSubscriber.created_at.desc())
    )
    subscribers = result.scalars().all()
    return [
        NewsletterExportResponse(
            email=s.email,
            name=s.name,
            signup_source=s.signup_source,
            created_at=s.created_at,
        )
        for s in subscribers
    ]
