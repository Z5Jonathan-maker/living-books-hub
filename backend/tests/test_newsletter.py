"""Tests for the newsletter API endpoints."""

import pytest

from tests.conftest import MockResult, make_mock_subscriber


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset the newsletter rate limiter between tests."""
    from app.core.rate_limit import newsletter_limiter
    newsletter_limiter._requests.clear()
    yield
    newsletter_limiter._requests.clear()


@pytest.mark.asyncio
async def test_subscribe_success(client, mock_db):
    """POST /api/v1/newsletter/subscribe creates a subscription."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock()
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock()
    resp = await client.post(
        "/api/v1/newsletter/subscribe",
        json={"email": "reader@example.com", "name": "A Reader"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "subscribed" in data["message"].lower() or "welcome" in data["message"].lower()


@pytest.mark.asyncio
async def test_subscribe_with_utm(client, mock_db):
    """POST /api/v1/newsletter/subscribe accepts UTM params."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock()
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock()
    resp = await client.post(
        "/api/v1/newsletter/subscribe",
        json={
            "email": "utm@example.com",
            "signup_source": "homepage_hero",
            "utm_source": "google",
            "utm_medium": "cpc",
            "utm_campaign": "spring2025",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_subscribe_invalid_email(client, mock_db):
    """POST /api/v1/newsletter/subscribe rejects invalid email."""
    resp = await client.post(
        "/api/v1/newsletter/subscribe",
        json={"email": "not-an-email"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_subscribe_missing_email(client, mock_db):
    """POST /api/v1/newsletter/subscribe requires email."""
    resp = await client.post(
        "/api/v1/newsletter/subscribe",
        json={"name": "No Email"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_subscribe_rate_limiting(client, mock_db):
    """POST /api/v1/newsletter/subscribe enforces rate limit (5/60s)."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock()
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock()

    # Send 5 requests (should all succeed)
    for i in range(5):
        resp = await client.post(
            "/api/v1/newsletter/subscribe",
            json={"email": f"user{i}@example.com"},
        )
        assert resp.status_code == 200, f"Request {i+1} should succeed"

    # 6th request should be rate limited
    resp = await client.post(
        "/api/v1/newsletter/subscribe",
        json={"email": "toomany@example.com"},
    )
    assert resp.status_code == 429
    assert "too many" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_export_subscribers_success(client, mock_db):
    """GET /api/v1/newsletter/export returns subscribers with admin key."""
    sub = make_mock_subscriber()
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[sub])
    )
    resp = await client.get(
        "/api/v1/newsletter/export",
        headers={"X-Admin-Key": "change-me-in-production"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_export_subscribers_wrong_key(client, mock_db):
    """GET /api/v1/newsletter/export returns 403 with wrong key."""
    resp = await client.get(
        "/api/v1/newsletter/export",
        headers={"X-Admin-Key": "wrong-key"},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_export_subscribers_no_key(client, mock_db):
    """GET /api/v1/newsletter/export returns 422 without key."""
    resp = await client.get("/api/v1/newsletter/export")
    assert resp.status_code == 422
