import hmac
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.drip_event import EmailDripEvent
from app.models.subscriber import EmailSubscriber

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

# Drip campaign schedule: (step, day_offset, subject, body_generator_key)
WELCOME_DRIP = [
    (0, 0, "Welcome to Living Books Hub!", "welcome"),
    (1, 2, "5 Living Books Every Family Should Read", "top_picks"),
    (2, 5, "How to Choose Living Books by Age", "age_guide"),
    (3, 10, "Meet Your AI Librarian", "ai_librarian"),
    (4, 14, "Build Your Reading Year with AI", "premium_cta"),
]


def _drip_html(key: str, frontend_url: str) -> str:
    """Generate drip email HTML by key."""
    bodies = {
        "welcome": f"""
            <h1 style="color: #2D5F2D; font-size: 24px;">Welcome to Living Books Hub!</h1>
            <p style="color: #555; line-height: 1.6;">
                We're so glad you're here. Living Books Hub is the first curated library built
                specifically for homeschool and alternative education families.
            </p>
            <p style="color: #555; line-height: 1.6;">
                Browse our growing collection of living books — organized by age, subject, reading level,
                and time period — and discover titles that will bring every subject alive for your family.
            </p>
            <a href="{frontend_url}/search"
               style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: bold; margin: 20px 0;">
                Start Browsing
            </a>
        """,
        "top_picks": f"""
            <h1 style="color: #2D5F2D; font-size: 24px;">5 Living Books Every Family Should Read</h1>
            <p style="color: #555; line-height: 1.6;">
                Not sure where to start? These five books are beloved by homeschool families across every
                approach — Charlotte Mason, classical, eclectic, and more.
            </p>
            <p style="color: #555; line-height: 1.6;">
                Each one is beautifully written, deeply engaging, and perfect for reading aloud or
                independent reading. Head to our site to explore these picks and more.
            </p>
            <a href="{frontend_url}/search?sort=popularity"
               style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: bold; margin: 20px 0;">
                See Top-Rated Books
            </a>
        """,
        "age_guide": f"""
            <h1 style="color: #2D5F2D; font-size: 24px;">How to Choose Living Books by Age</h1>
            <p style="color: #555; line-height: 1.6;">
                Finding the right living book for each child's age and reading ability is one of the
                biggest challenges for homeschool families. Our latest guide breaks it all down.
            </p>
            <p style="color: #555; line-height: 1.6;">
                From picture books for preschoolers to narrative nonfiction for high schoolers —
                learn how to match books to your child's developmental stage.
            </p>
            <a href="{frontend_url}/blog/best-living-books-by-grade-level"
               style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: bold; margin: 20px 0;">
                Read the Guide
            </a>
        """,
        "ai_librarian": f"""
            <h1 style="color: #2D5F2D; font-size: 24px;">Meet Your AI Librarian</h1>
            <p style="color: #555; line-height: 1.6;">
                Have you tried our AI-powered librarian yet? Tell it what your child is interested in,
                their age, and what subjects you're covering — and it'll recommend the perfect living books.
            </p>
            <p style="color: #555; line-height: 1.6;">
                It's like having a knowledgeable homeschool friend who's read every book in our catalog.
                Free users get 5 questions per day. Premium members get unlimited access with family context.
            </p>
            <a href="{frontend_url}/search"
               style="display: inline-block; padding: 14px 28px; background: #2D5F2D;
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: bold; margin: 20px 0;">
                Try the AI Librarian
            </a>
        """,
        "premium_cta": f"""
            <h1 style="color: #2D5F2D; font-size: 24px;">Build Your Reading Year with AI</h1>
            <p style="color: #555; line-height: 1.6;">
                Ready to take your homeschool to the next level? Our Premium plan includes the
                AI Curriculum Builder — it creates a personalized, term-by-term reading plan for each child.
            </p>
            <p style="color: #555; line-height: 1.6;">
                Plus unlimited AI librarian access, unlimited child profiles, server-synced reading plans,
                and priority access to new features. All for just $5.99/month or $49/year.
            </p>
            <a href="{frontend_url}/subscribe"
               style="display: inline-block; padding: 14px 28px; background: #B8860B;
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: bold; margin: 20px 0;">
                Go Premium — $5.99/mo
            </a>
        """,
    }
    body = bodies.get(key, bodies["welcome"])
    return f"""
    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        {body}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
            You're receiving this because you signed up at Living Books Hub.
        </p>
    </div>
    """


@router.post("/send-drip-batch")
async def send_drip_batch(
    x_admin_key: str = Header(..., alias="X-Admin-Key"),
    db: AsyncSession = Depends(get_db),
):
    """Send pending drip emails for all subscribers. Admin-only, cron-triggered."""
    if not settings.admin_api_key or not hmac.compare_digest(x_admin_key, settings.admin_api_key):
        raise HTTPException(status_code=403, detail="Invalid admin key")

    import resend
    resend.api_key = settings.resend_api_key
    now = datetime.now(timezone.utc)
    sent_count = 0

    for step, day_offset, subject, body_key in WELCOME_DRIP:
        # Find subscribers who signed up >= day_offset days ago and haven't received this step
        cutoff = now - timedelta(days=day_offset)

        # Get subscribers eligible for this step
        already_sent_subquery = (
            select(EmailDripEvent.subscriber_id)
            .where(
                and_(
                    EmailDripEvent.campaign == "welcome",
                    EmailDripEvent.step == step,
                )
            )
        )

        result = await db.execute(
            select(EmailSubscriber)
            .where(
                and_(
                    EmailSubscriber.created_at <= cutoff,
                    EmailSubscriber.id.notin_(already_sent_subquery),
                )
            )
            .limit(100)
        )
        subscribers = result.scalars().all()

        for sub in subscribers:
            try:
                html = _drip_html(body_key, settings.frontend_url)
                resend.Emails.send({
                    "from": settings.from_email,
                    "to": [sub.email],
                    "subject": subject,
                    "html": html,
                })
                db.add(EmailDripEvent(
                    subscriber_id=sub.id,
                    campaign="welcome",
                    step=step,
                ))
                sent_count += 1
            except Exception as e:
                masked = sub.email[:3] + "***" if len(sub.email) > 3 else "***"
                print(f"[DRIP] Failed to send step {step} to {masked}: {e}")

    await db.commit()
    return {"sent": sent_count}
