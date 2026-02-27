"""Tests for the books API endpoints."""

import pytest

from tests.conftest import MockResult, make_mock_book, make_mock_link, make_mock_source


@pytest.mark.asyncio
async def test_search_books_empty(client, mock_db):
    """GET /api/v1/books returns empty results when no books exist."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    resp = await client.get("/api/v1/books")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "per_page" in data
    assert "pages" in data


@pytest.mark.asyncio
async def test_search_books_with_results(client, mock_db):
    """GET /api/v1/books returns paginated book results."""
    book = make_mock_book()
    call_count = 0

    async def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            # First call: main query (before count)
            return MockResult(items=[book])
        elif call_count == 2:
            # Second call: count query
            return MockResult(scalar_value=1)
        else:
            # Third call: paginated results
            return MockResult(items=[book])

    mock_db.execute = side_effect
    resp = await client.get("/api/v1/books")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_search_books_with_query_param(client, mock_db):
    """GET /api/v1/books?q=nature passes search param."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    resp = await client.get("/api/v1/books?q=nature")
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_search_books_with_filters(client, mock_db):
    """GET /api/v1/books with filter params returns 200."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    resp = await client.get(
        "/api/v1/books?age_range=6-10&subject=nature&reading_level=intermediate"
        "&time_period=20th+century&region=North+America&language=English"
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_search_books_sort_options(client, mock_db):
    """GET /api/v1/books supports various sort options."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    for sort in ["popularity", "title", "author", "newest"]:
        resp = await client.get(f"/api/v1/books?sort={sort}")
        assert resp.status_code == 200, f"sort={sort} failed"


@pytest.mark.asyncio
async def test_search_books_pagination_params(client, mock_db):
    """GET /api/v1/books validates pagination params."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(scalar_value=0)
    )
    # Valid pagination
    resp = await client.get("/api/v1/books?page=2&per_page=10")
    assert resp.status_code == 200

    # Invalid page (< 1)
    resp = await client.get("/api/v1/books?page=0")
    assert resp.status_code == 422

    # Invalid per_page (> 100)
    resp = await client.get("/api/v1/books?per_page=200")
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_get_book_detail(client, mock_db):
    """GET /api/v1/books/{id} returns a book with links."""
    source = make_mock_source()
    link = make_mock_link(source=source)
    book = make_mock_book(links=[link])
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[book])
    )
    resp = await client.get("/api/v1/books/1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Charlotte's Web"
    assert data["author"] == "E.B. White"
    assert data["id"] == 1
    assert len(data["links"]) == 1
    assert data["links"][0]["source_name"] == "Amazon"
    assert data["links"][0]["link_type"] == "buy"


@pytest.mark.asyncio
async def test_get_book_not_found(client, mock_db):
    """GET /api/v1/books/{id} returns 404 for missing book."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/books/999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_get_related_books(client, mock_db):
    """GET /api/v1/books/{id}/related returns related books."""
    book1 = make_mock_book(id=1, subjects=["nature"])
    book2 = make_mock_book(id=2, title="My Side of the Mountain", subjects=["nature"])
    call_count = 0

    async def side_effect(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return MockResult(items=[book1])
        return MockResult(items=[book2])

    mock_db.execute = side_effect
    resp = await client.get("/api/v1/books/1/related")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_get_related_books_not_found(client, mock_db):
    """GET /api/v1/books/{id}/related returns 404 for missing book."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/books/999/related")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_filters(client, mock_db):
    """GET /api/v1/books/filters returns filter options."""
    mock_db.execute = pytest.importorskip("unittest.mock").AsyncMock(
        return_value=MockResult(items=[])
    )
    resp = await client.get("/api/v1/books/filters")
    assert resp.status_code == 200
    data = resp.json()
    assert "age_ranges" in data
    assert "reading_levels" in data
    assert "subjects" in data
    assert "time_periods" in data
    assert "regions" in data
    assert "languages" in data
