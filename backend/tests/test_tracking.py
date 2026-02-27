"""Tests for the click tracking API endpoints."""

import pytest


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset the tracking rate limiter between tests."""
    from app.core.rate_limit import tracking_limiter
    tracking_limiter._requests.clear()
    yield
    tracking_limiter._requests.clear()


@pytest.mark.asyncio
async def test_track_click_success(client, mock_db):
    """POST /api/v1/tracking/click records a click event."""
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock()
    resp = await client.post(
        "/api/v1/tracking/click",
        json={
            "book_id": 1,
            "source_name": "Amazon",
            "link_id": 5,
            "referrer": "https://livingbookshub.com/books/1",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_track_click_minimal(client, mock_db):
    """POST /api/v1/tracking/click works with minimal data."""
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock()
    resp = await client.post(
        "/api/v1/tracking/click",
        json={"book_id": 1, "source_name": "ThriftBooks"},
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_track_click_missing_required(client):
    """POST /api/v1/tracking/click rejects missing required fields."""
    resp = await client.post(
        "/api/v1/tracking/click",
        json={"book_id": 1},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_track_click_db_error(client, mock_db):
    """POST /api/v1/tracking/click returns success even on DB error (fire-and-forget)."""
    mock_db.commit = pytest.importorskip("unittest.mock").AsyncMock(
        side_effect=Exception("DB down")
    )
    mock_db.rollback = pytest.importorskip("unittest.mock").AsyncMock()
    resp = await client.post(
        "/api/v1/tracking/click",
        json={"book_id": 1, "source_name": "Amazon"},
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True
