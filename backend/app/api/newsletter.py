import hashlib
import hmac
import html as html_mod
from datetime import datetime, timezone
from urllib.parse import quote

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import newsletter_limiter
from app.models.schemas import (
    NewsletterExportResponse,
    NewsletterSubscribeRequest,
    NewsletterSubscribeResponse,
)
from app.models.subscriber import EmailSubscriber


def _unsubscribe_sig(email: str) -> str:
    """Generate HMAC-SHA256 signature for unsubscribe links (full 256-bit)."""
    return hmac.new(
        settings.admin_api_key.encode(), email.encode(), hashlib.sha256
    ).hexdigest()

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

        # Send welcome email (non-blocking — failures don't affect subscription)
        try:
            from app.services.email import send_newsletter_welcome
            send_newsletter_welcome(req.email.lower().strip(), req.name)
        except Exception:
            pass
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
    if not settings.admin_api_key or not hmac.compare_digest(x_admin_key, settings.admin_api_key):
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


@router.get("/unsubscribe")
async def unsubscribe(
    email: str,
    sig: str,
    db: AsyncSession = Depends(get_db),
):
    """HMAC-secured unsubscribe endpoint."""
    email = email.lower().strip()
    expected = _unsubscribe_sig(email)
    if not hmac.compare_digest(sig, expected):
        raise HTTPException(status_code=400, detail="Invalid unsubscribe link")

    result = await db.execute(
        select(EmailSubscriber).where(EmailSubscriber.email == email)
    )
    subscriber = result.scalar_one_or_none()
    if subscriber:
        subscriber.unsubscribed_at = datetime.now(timezone.utc)
        await db.commit()

    return {"message": "You have been unsubscribed. We're sorry to see you go!"}


@router.post("/send-weekly")
async def send_weekly_newsletter(
    x_admin_key: str = Header(..., alias="X-Admin-Key"),
    db: AsyncSession = Depends(get_db),
):
    """Send weekly newsletter featuring highest-popularity unfeatured book. Admin-only."""
    if not settings.admin_api_key or not hmac.compare_digest(x_admin_key, settings.admin_api_key):
        raise HTTPException(status_code=403, detail="Invalid admin key")

    from app.models.book import Book
    from app.models.newsletter_send import NewsletterSend

    # Find highest-popularity book not yet featured
    already_featured = select(NewsletterSend.book_id)
    result = await db.execute(
        select(Book)
        .where(Book.id.notin_(already_featured))
        .order_by(Book.popularity_score.desc())
        .limit(1)
    )
    book = result.scalar_one_or_none()
    if not book:
        return {"sent": 0, "message": "No unfeatured books remaining"}

    # Generate description with Groq if available
    description = book.description
    if settings.groq_enabled and settings.groq_api_key:
        try:
            from app.services.ai import get_groq_client
            client = get_groq_client()
            if client:
                resp = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You write warm, compelling 2-paragraph descriptions of living books for homeschool families. Be specific about why the book is special and who it's perfect for. Keep it under 150 words."},
                        {"role": "user", "content": f"Write a newsletter spotlight for: \"{book.title}\" by {book.author}. Description: {book.description}. Subjects: {', '.join(book.subjects)}. Ages: {book.age_range}."},
                    ],
                    temperature=0.7,
                    max_tokens=300,
                )
                raw = resp.choices[0].message.content or ""
                description = html_mod.escape(raw)
        except Exception:
            pass

    # Get active subscribers
    result = await db.execute(
        select(EmailSubscriber).where(EmailSubscriber.unsubscribed_at.is_(None))
    )
    subscribers = result.scalars().all()

    if not subscribers:
        return {"sent": 0, "message": "No active subscribers"}

    import resend
    resend.api_key = settings.resend_api_key

    subject = f"This Week's Living Book: {book.title}"
    sent = 0

    # Send in batches of 100
    for i in range(0, len(subscribers), 100):
        batch = subscribers[i:i + 100]
        for sub in batch:
            unsub_sig = _unsubscribe_sig(sub.email)
            encoded_email = quote(sub.email, safe="")
            unsub_url = f"{settings.frontend_url.rstrip('/')}/api/v1/newsletter/unsubscribe?email={encoded_email}&sig={unsub_sig}"

            html = f"""
            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #2D5F2D; font-size: 24px;">This Week's Living Book</h1>
                <h2 style="color: #333; font-size: 20px; margin-top: 20px;">
                    "{book.title}" by {book.author}
                </h2>
                <p style="color: #888; font-size: 13px;">Ages {book.age_range} | {', '.join(book.subjects)}</p>
                <div style="color: #555; line-height: 1.6; margin-top: 16px;">
                    {description}
                </div>
                <a href="{settings.frontend_url}/books/{book.id}"
                   style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                          color: white; text-decoration: none; border-radius: 8px;
                          font-weight: bold; margin: 20px 0;">
                    View This Book
                </a>
                <p style="color: #999; font-size: 11px; margin-top: 30px;">
                    <a href="{unsub_url}" style="color: #999;">Unsubscribe</a> from Living Books Hub newsletter.
                </p>
            </div>
            """

            try:
                resend.Emails.send({
                    "from": settings.from_email,
                    "to": [sub.email],
                    "subject": subject,
                    "html": html,
                })
                sent += 1
            except Exception as e:
                masked = sub.email[:3] + "***" if len(sub.email) > 3 else "***"
                print(f"[NEWSLETTER] Failed to send to {masked}: {e}")

    # Record the send
    db.add(NewsletterSend(
        book_id=book.id,
        subject=subject,
        recipient_count=sent,
    ))
    await db.commit()

    return {"sent": sent, "book": book.title}
