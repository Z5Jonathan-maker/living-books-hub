from urllib.parse import urlparse

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user, require_user
from app.core.config import settings
from app.core.database import get_db
from app.models.schemas import CheckoutSessionCreate, SubscriptionStatus
from app.models.user import User

router = APIRouter(prefix="/api/v1/stripe", tags=["stripe"])

# Set Stripe API key once at module load (not per-request)
if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key


def _validate_redirect_url(url: str, field: str) -> None:
    """Ensure redirect URLs belong to known frontend domains."""
    parsed = urlparse(url)
    frontend_host = urlparse(settings.frontend_url).hostname
    allowed = {frontend_host}
    if settings.debug:
        allowed.update({"localhost", "127.0.0.1"})
    if parsed.hostname not in allowed:
        raise HTTPException(
            status_code=400, detail=f"Invalid {field} domain"
        )
    if parsed.scheme not in ("https", "http"):
        raise HTTPException(
            status_code=400, detail=f"Invalid {field} scheme"
        )


@router.post("/create-checkout-session")
async def create_checkout_session(
    body: CheckoutSessionCreate,
    user: User = Depends(require_user),
):
    """Create a Stripe Checkout session for subscription."""
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")

    _validate_redirect_url(body.success_url, "success_url")
    _validate_redirect_url(body.cancel_url, "cancel_url")

    # Select price based on billing cycle
    if body.price_id == "annual" and settings.stripe_annual_price_id:
        price_id = settings.stripe_annual_price_id
    else:
        price_id = settings.stripe_price_id

    try:
        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=body.success_url,
            cancel_url=body.cancel_url,
            customer_email=user.email,
            metadata={"user_id": str(user.id)},
        )
        return {"checkout_url": session.url, "session_id": session.id}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events."""
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=503, detail="Webhook not configured")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data_object = event["data"]["object"]

    if event_type == "checkout.session.completed":
        # Use server-set metadata.user_id as primary lookup (tamper-proof)
        user_id = (data_object.get("metadata") or {}).get("user_id")
        user = None
        if user_id:
            result = await db.execute(
                select(User).where(User.id == int(user_id))
            )
            user = result.scalar_one_or_none()
        if not user:
            # Fallback to email for sessions created before metadata was added
            customer_email = data_object.get("customer_email") or (
                data_object.get("customer_details", {}).get("email")
            )
            if customer_email:
                result = await db.execute(
                    select(User).where(User.email == customer_email)
                )
                user = result.scalar_one_or_none()
        if user:
                user.stripe_customer_id = data_object.get("customer")
                user.subscription_tier = "premium"
                user.subscription_active = True
                await db.commit()
                try:
                    from app.services.email import send_subscription_confirmation

                    send_subscription_confirmation(user.email, user.name)
                except Exception:
                    pass

    elif event_type == "customer.subscription.deleted":
        customer_id = data_object.get("customer")
        if customer_id:
            result = await db.execute(
                select(User).where(User.stripe_customer_id == customer_id)
            )
            user = result.scalar_one_or_none()
            if user:
                user.subscription_tier = "free"
                user.subscription_active = False
                await db.commit()

    elif event_type == "invoice.payment_failed":
        customer_id = data_object.get("customer")
        if customer_id:
            result = await db.execute(
                select(User).where(User.stripe_customer_id == customer_id)
            )
            user = result.scalar_one_or_none()
            if user:
                user.subscription_active = False
                await db.commit()

    return {"status": "ok"}


@router.get("/config")
async def get_stripe_config():
    """Return publishable key for frontend."""
    return {"publishable_key": settings.stripe_publishable_key}


@router.get("/subscription-status")
async def get_subscription_status(
    user: User | None = Depends(get_current_user),
):
    """Check subscription status for the current user."""
    if not user:
        return SubscriptionStatus(tier="free", active=True, stripe_customer_id=None)
    return SubscriptionStatus(
        tier=user.subscription_tier,
        active=user.subscription_active,
    )
