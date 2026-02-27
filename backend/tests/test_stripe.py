"""Tests for the Stripe API endpoints."""

import pytest


@pytest.mark.asyncio
async def test_stripe_config(client):
    """GET /api/v1/stripe/config returns publishable key."""
    resp = await client.get("/api/v1/stripe/config")
    assert resp.status_code == 200
    data = resp.json()
    assert "publishable_key" in data


@pytest.mark.asyncio
async def test_subscription_status(client):
    """GET /api/v1/stripe/subscription-status returns free tier for MVP."""
    resp = await client.get("/api/v1/stripe/subscription-status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["tier"] == "free"
    assert data["active"] is True
    assert data["stripe_customer_id"] is None


@pytest.mark.asyncio
async def test_create_checkout_no_stripe_config(client):
    """POST /api/v1/stripe/create-checkout-session returns 503 when Stripe not configured."""
    resp = await client.post(
        "/api/v1/stripe/create-checkout-session",
        json={
            "success_url": "https://example.com/success",
            "cancel_url": "https://example.com/cancel",
        },
    )
    assert resp.status_code == 503
    assert "not configured" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_create_checkout_missing_urls(client):
    """POST /api/v1/stripe/create-checkout-session rejects missing URLs."""
    resp = await client.post(
        "/api/v1/stripe/create-checkout-session",
        json={},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_webhook_no_config(client):
    """POST /api/v1/stripe/webhook returns 503 when webhook not configured."""
    resp = await client.post(
        "/api/v1/stripe/webhook",
        content=b'{"type": "test"}',
        headers={"stripe-signature": "test_sig"},
    )
    assert resp.status_code == 503
