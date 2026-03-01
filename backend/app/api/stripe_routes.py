from urllib.parse import urlparse

import stripe
from fastapi import APIRouter, HTTPException, Request

from app.core.config import settings
from app.models.schemas import CheckoutSessionCreate, SubscriptionStatus

router = APIRouter(prefix="/api/v1/stripe", tags=["stripe"])


def _validate_redirect_url(url: str, field: str) -> None:
    """Ensure redirect URLs belong to known frontend domains."""
    parsed = urlparse(url)
    frontend_host = urlparse(settings.frontend_url).hostname
    allowed = {frontend_host, "localhost", "127.0.0.1"}
    if parsed.hostname not in allowed:
        raise HTTPException(
            status_code=400, detail=f"Invalid {field} domain"
        )


@router.post("/create-checkout-session")
async def create_checkout_session(body: CheckoutSessionCreate):
    """Create a Stripe Checkout session for subscription."""
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")

    _validate_redirect_url(body.success_url, "success_url")
    _validate_redirect_url(body.cancel_url, "cancel_url")

    stripe.api_key = settings.stripe_secret_key

    try:
        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": settings.stripe_price_id, "quantity": 1}],
            success_url=body.success_url,
            cancel_url=body.cancel_url,
        )
        return {"checkout_url": session.url, "session_id": session.id}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
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

    # Handle subscription events
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # In production: store customer_id + subscription status in DB
        print(f"Checkout completed: {session.get('customer')}")

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        print(f"Subscription cancelled: {subscription.get('customer')}")

    return {"status": "ok"}


@router.get("/config")
async def get_stripe_config():
    """Return publishable key for frontend."""
    return {"publishable_key": settings.stripe_publishable_key}


@router.get("/subscription-status")
async def get_subscription_status():
    """
    Check subscription status.
    For MVP without auth, returns free tier.
    With auth: check user's Stripe customer ID against subscriptions.
    """
    # MVP: always return free tier (auth-gated in v2)
    return SubscriptionStatus(tier="free", active=True, stripe_customer_id=None)
