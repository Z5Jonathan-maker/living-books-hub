"""Shared test fixtures for the Living Books Hub API."""

from unittest.mock import AsyncMock, MagicMock, patch
import datetime

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import get_db


def make_mock_book(**overrides):
    """Create a mock Book ORM object for testing."""
    defaults = {
        "id": 1,
        "title": "Charlotte's Web",
        "author": "E.B. White",
        "description": "A story about friendship between a pig and a spider.",
        "long_description": "A longer description of Charlotte's Web.",
        "reading_level": "intermediate",
        "age_range": "6-10",
        "subjects": ["literature", "nature"],
        "time_period": "20th century",
        "region": "North America",
        "isbn": "9780061124952",
        "cover_image_url": None,
        "language": "English",
        "series": None,
        "awards": ["Newbery Honor"],
        "popularity_score": 95.0,
        "page_count": 184,
        "publication_year": 1952,
        "publisher": "Harper & Brothers",
        "created_at": datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc),
        "updated_at": datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc),
        "links": [],
        "list_items": [],
    }
    defaults.update(overrides)
    book = MagicMock()
    for k, v in defaults.items():
        setattr(book, k, v)
    return book


def make_mock_source(**overrides):
    """Create a mock Source ORM object."""
    defaults = {
        "id": 1,
        "name": "Amazon",
        "base_url": "https://amazon.com",
        "affiliate_tag": "livingbooks-20",
        "logo_url": None,
    }
    defaults.update(overrides)
    source = MagicMock()
    for k, v in defaults.items():
        setattr(source, k, v)
    return source


def make_mock_link(source=None, **overrides):
    """Create a mock BookLink ORM object."""
    if source is None:
        source = make_mock_source()
    defaults = {
        "id": 1,
        "book_id": 1,
        "source_id": 1,
        "url": "https://amazon.com/charlottes-web",
        "link_type": "buy",
        "affiliate_tag": "tag-20",
        "price_hint": "$7.99",
        "source": source,
    }
    defaults.update(overrides)
    link = MagicMock()
    for k, v in defaults.items():
        setattr(link, k, v)
    return link


def make_mock_list(**overrides):
    """Create a mock CuratedList ORM object."""
    defaults = {
        "id": 1,
        "name": "Best Nature Books",
        "slug": "best-nature-books",
        "description": "Our favorite nature living books.",
        "cover_image_url": None,
        "category": "Nature",
        "is_featured": True,
        "created_at": datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc),
        "items": [],
    }
    defaults.update(overrides)
    lst = MagicMock()
    for k, v in defaults.items():
        setattr(lst, k, v)
    return lst


def make_mock_list_item(book=None, **overrides):
    """Create a mock ListItem ORM object."""
    if book is None:
        book = make_mock_book()
    defaults = {
        "id": 1,
        "list_id": 1,
        "book_id": book.id,
        "rank": 1,
        "note": "A classic pick.",
        "book": book,
    }
    defaults.update(overrides)
    item = MagicMock()
    for k, v in defaults.items():
        setattr(item, k, v)
    return item


def make_mock_subscriber(**overrides):
    """Create a mock EmailSubscriber ORM object."""
    defaults = {
        "id": 1,
        "email": "test@example.com",
        "name": "Test User",
        "signup_source": "homepage",
        "utm_source": None,
        "utm_medium": None,
        "utm_campaign": None,
        "created_at": datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc),
    }
    defaults.update(overrides)
    sub = MagicMock()
    for k, v in defaults.items():
        setattr(sub, k, v)
    return sub


class MockResult:
    """Mock SQLAlchemy result object."""

    def __init__(self, items=None, scalar_value=None):
        self._items = items or []
        self._scalar_value = scalar_value

    def scalars(self):
        return self

    def all(self):
        return self._items

    def scalar(self):
        return self._scalar_value

    def scalar_one_or_none(self):
        return self._items[0] if self._items else None


@pytest.fixture
def mock_db():
    """Create a mock async database session."""
    session = AsyncMock()
    session.execute = AsyncMock(return_value=MockResult())
    session.commit = AsyncMock()
    session.rollback = AsyncMock()

    # Track added objects and assign mock IDs on flush
    _added = []

    def _add(obj):
        _added.append(obj)

    async def _flush():
        for obj in _added:
            if hasattr(obj, "id") and obj.id is None:
                obj.id = 1
            if hasattr(obj, "created_at") and obj.created_at is None:
                obj.created_at = datetime.datetime(2025, 1, 1, tzinfo=datetime.timezone.utc)
        _added.clear()

    session.add = MagicMock(side_effect=_add)
    session.flush = AsyncMock(side_effect=_flush)
    return session


@pytest.fixture
async def client(mock_db):
    """Async test client with mocked database."""
    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def admin_headers():
    """Headers for admin-authenticated requests."""
    return {"X-API-Key": "change-me-in-production"}
