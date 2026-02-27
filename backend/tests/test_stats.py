"""Tests for the catalog stats endpoint."""

import pytest

from tests.conftest import MockResult


@pytest.mark.asyncio
async def test_get_stats(client, mock_db):
    """GET /api/v1/stats returns catalog statistics."""
    call_count = 0

    async def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return MockResult(scalar_value=50)  # total_books
        elif call_count == 2:
            return MockResult(scalar_value=19)  # total_lists
        elif call_count == 3:
            return MockResult(scalar_value=120)  # total_subscribers
        elif call_count == 4:
            return MockResult(items=[("nature",), ("history",)])  # subjects
        elif call_count == 5:
            return MockResult(items=[("4-8",), ("6-10",)])  # age_ranges
        elif call_count == 6:
            return MockResult(items=[("beginner",), ("intermediate",)])  # reading_levels
        return MockResult()

    mock_db.execute = side_effect
    resp = await client.get("/api/v1/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_books"] == 50
    assert data["total_lists"] == 19
    assert data["total_subscribers"] == 120
    assert "subjects" in data
    assert "age_ranges" in data
    assert "reading_levels" in data


@pytest.mark.asyncio
async def test_get_stats_empty_db(client, mock_db):
    """GET /api/v1/stats returns zeros for empty database."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    resp = await client.get("/api/v1/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_books"] == 0
