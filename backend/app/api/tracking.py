import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.rate_limit import tracking_limiter
from app.models.click_event import ClickEvent
from app.models.schemas import ClickTrackRequest, ClickTrackResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/tracking", tags=["tracking"])


@router.post("/click", response_model=ClickTrackResponse)
async def track_click(
    request: Request,
    req: ClickTrackRequest,
    db: AsyncSession = Depends(get_db),
):
    """Record an affiliate link click event. Fire-and-forget — always returns success."""
    tracking_limiter.check(request)
    try:
        event = ClickEvent(
            book_id=req.book_id,
            link_id=req.link_id,
            source_name=req.source_name,
            referrer=req.referrer,
        )
        db.add(event)
        await db.commit()
    except Exception:
        logger.exception("Failed to record click event for book_id=%s", req.book_id)
        await db.rollback()
    return ClickTrackResponse(success=True)
