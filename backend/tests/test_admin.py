"""Tests for the admin API endpoints."""

import io

import pytest

from tests.conftest import MockResult


@pytest.mark.asyncio
async def test_create_book_requires_auth(client):
    """POST /api/v1/admin/books returns 422 without auth header."""
    resp = await client.post(
        "/api/v1/admin/books",
        json={
            "title": "Test Book",
            "author": "Test Author",
            "description": "A test book",
            "age_range": "6-10",
        },
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_book_wrong_key(client):
    """POST /api/v1/admin/books returns 403 with wrong API key."""
    resp = await client.post(
        "/api/v1/admin/books",
        headers={"X-API-Key": "wrong-key"},
        json={
            "title": "Test Book",
            "author": "Test Author",
            "description": "A test book",
            "age_range": "6-10",
        },
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Invalid admin API key"


@pytest.mark.asyncio
async def test_create_book_success(client, mock_db, admin_headers):
    """POST /api/v1/admin/books creates a book with valid auth."""
    resp = await client.post(
        "/api/v1/admin/books",
        headers=admin_headers,
        json={
            "title": "The Secret Garden",
            "author": "Frances Hodgson Burnett",
            "description": "A story about a hidden garden.",
            "age_range": "8-12",
            "subjects": ["literature", "nature"],
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert data["title"] == "The Secret Garden"


@pytest.mark.asyncio
async def test_create_book_missing_required_fields(client, admin_headers):
    """POST /api/v1/admin/books returns 422 with missing fields."""
    resp = await client.post(
        "/api/v1/admin/books",
        headers=admin_headers,
        json={"title": "Incomplete Book"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_source(client, mock_db, admin_headers):
    """POST /api/v1/admin/sources creates a source."""
    resp = await client.post(
        "/api/v1/admin/sources",
        headers=admin_headers,
        json={
            "name": "BookShop.org",
            "base_url": "https://bookshop.org",
            "affiliate_tag": "livingbooks-20",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "BookShop.org"


@pytest.mark.asyncio
async def test_create_source_no_auth(client):
    """POST /api/v1/admin/sources returns 422 without auth."""
    resp = await client.post(
        "/api/v1/admin/sources",
        json={"name": "Test", "base_url": "https://test.com"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_book_link(client, mock_db, admin_headers):
    """POST /api/v1/admin/book-links creates a link."""
    resp = await client.post(
        "/api/v1/admin/book-links",
        headers=admin_headers,
        json={
            "book_id": 1,
            "source_id": 1,
            "url": "https://amazon.com/book/123",
            "link_type": "buy",
            "price_hint": "$12.99",
        },
    )
    assert resp.status_code == 200
    assert "id" in resp.json()


@pytest.mark.asyncio
async def test_create_list(client, mock_db, admin_headers):
    """POST /api/v1/admin/lists creates a curated list."""
    resp = await client.post(
        "/api/v1/admin/lists",
        headers=admin_headers,
        json={
            "name": "History Favorites",
            "slug": "history-favorites",
            "description": "Our favorite history living books.",
            "category": "History",
            "is_featured": True,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "History Favorites"
    assert data["slug"] == "history-favorites"


@pytest.mark.asyncio
async def test_add_list_item(client, mock_db, admin_headers):
    """POST /api/v1/admin/lists/{id}/items adds a book to a list."""
    resp = await client.post(
        "/api/v1/admin/lists/1/items",
        headers=admin_headers,
        json={"book_id": 1, "rank": 1, "note": "Must read!"},
    )
    assert resp.status_code == 200
    assert "id" in resp.json()


@pytest.mark.asyncio
async def test_csv_import_no_auth(client):
    """POST /api/v1/admin/books/import-csv returns 422 without auth."""
    resp = await client.post("/api/v1/admin/books/import-csv")
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_csv_import_success(client, mock_db, admin_headers):
    """POST /api/v1/admin/books/import-csv imports books from CSV."""
    mock_db.flush = pytest.importorskip("unittest.mock").AsyncMock()
    csv_content = (
        "title,author,description,age_range,subjects,language,popularity_score\n"
        "Test Book,Test Author,A test desc,6-10,nature|science,English,50\n"
        "Book Two,Author Two,Another desc,8-12,history,English,30\n"
    )
    resp = await client.post(
        "/api/v1/admin/books/import-csv",
        headers=admin_headers,
        files={"file": ("books.csv", io.BytesIO(csv_content.encode()), "text/csv")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["created"] == 2
    assert data["errors"] == []
