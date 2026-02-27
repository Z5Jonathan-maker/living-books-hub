"""Tests for the librarian (AI recommendation) endpoint."""

import pytest

from tests.conftest import MockResult, make_mock_book


@pytest.mark.asyncio
async def test_librarian_deterministic_with_results(client, mock_db):
    """POST /api/v1/librarian returns book suggestions (deterministic fallback)."""
    book = make_mock_book()
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[book])
    )
    resp = await client.post(
        "/api/v1/librarian",
        json={"message": "nature books for age 7"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "reply" in data
    assert "suggested_books" in data
    assert isinstance(data["suggested_books"], list)


@pytest.mark.asyncio
async def test_librarian_deterministic_no_results(client, mock_db):
    """POST /api/v1/librarian falls back to popular books when no matches."""
    popular_book = make_mock_book(title="Popular Book", popularity_score=99)
    call_count = 0

    async def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return MockResult(items=[])  # No keyword match
        return MockResult(items=[popular_book])  # Fallback to popular

    mock_db.execute = side_effect
    resp = await client.post(
        "/api/v1/librarian",
        json={"message": "xyznonexistent"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "couldn't find" in data["reply"].lower() or "beloved" in data["reply"].lower()


@pytest.mark.asyncio
async def test_librarian_missing_message(client):
    """POST /api/v1/librarian rejects request without message."""
    resp = await client.post("/api/v1/librarian", json={})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_librarian_with_context(client, mock_db):
    """POST /api/v1/librarian accepts optional context field."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[make_mock_book()])
    )
    resp = await client.post(
        "/api/v1/librarian",
        json={
            "message": "history books",
            "context": {"age": 10, "interests": ["history"]},
        },
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_librarian_short_message(client, mock_db):
    """POST /api/v1/librarian handles very short messages."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[make_mock_book()])
    )
    resp = await client.post(
        "/api/v1/librarian",
        json={"message": "hi"},
    )
    assert resp.status_code == 200
