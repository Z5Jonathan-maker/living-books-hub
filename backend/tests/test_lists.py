"""Tests for the curated lists API endpoints."""

import pytest

from tests.conftest import MockResult, make_mock_book, make_mock_list, make_mock_list_item


@pytest.mark.asyncio
async def test_get_lists_empty(client, mock_db):
    """GET /api/v1/lists returns empty list when none exist."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/lists")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_get_lists_with_results(client, mock_db):
    """GET /api/v1/lists returns lists with book counts."""
    lst = make_mock_list()
    call_count = 0

    async def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return MockResult(items=[lst])
        return MockResult(scalar_value=5)

    mock_db.execute = side_effect
    resp = await client.get("/api/v1/lists")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Best Nature Books"
    assert data[0]["slug"] == "best-nature-books"
    assert data[0]["is_featured"] is True


@pytest.mark.asyncio
async def test_get_lists_filter_featured(client, mock_db):
    """GET /api/v1/lists?featured=true filters featured lists."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/lists?featured=true")
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_lists_filter_category(client, mock_db):
    """GET /api/v1/lists?category=Nature filters by category."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/lists?category=Nature")
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_list_categories(client, mock_db):
    """GET /api/v1/lists/categories returns distinct categories."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[("Nature",), ("History",)])
    )
    resp = await client.get("/api/v1/lists/categories")
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_list_detail(client, mock_db):
    """GET /api/v1/lists/{slug} returns list with items."""
    book = make_mock_book()
    item = make_mock_list_item(book=book, rank=1)
    lst = make_mock_list(items=[item])

    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[lst])
    )
    resp = await client.get("/api/v1/lists/best-nature-books")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Best Nature Books"
    assert data["slug"] == "best-nature-books"
    assert len(data["items"]) == 1
    assert data["items"][0]["book"]["title"] == "Charlotte's Web"
    assert data["items"][0]["rank"] == 1


@pytest.mark.asyncio
async def test_get_list_detail_not_found(client, mock_db):
    """GET /api/v1/lists/{slug} returns 404 for missing list."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/lists/nonexistent-list")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "List not found"
