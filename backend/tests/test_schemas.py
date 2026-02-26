"""Tests for Pydantic schema validation."""

from app.models.schemas import (
    BookCreate,
    BookSearchParams,
    CuratedListCreate,
    LibrarianRequest,
    CheckoutSessionCreate,
)


def test_book_create_minimal():
    book = BookCreate(
        title="Test Book",
        author="Test Author",
        description="A test description",
        age_range="6-10",
    )
    assert book.title == "Test Book"
    assert book.subjects == []
    assert book.language == "English"
    assert book.popularity_score == 0.0


def test_book_create_full():
    book = BookCreate(
        title="Full Book",
        author="Full Author",
        description="Full description",
        long_description="Longer description here",
        reading_level="intermediate",
        age_range="8-12",
        subjects=["history", "adventure"],
        time_period="19th century",
        region="North America",
        isbn="9780000000001",
        language="English",
        series="Test Series",
        awards=["Newbery Medal"],
        popularity_score=85.0,
        page_count=256,
        publication_year=1950,
        publisher="Test Publisher",
    )
    assert len(book.subjects) == 2
    assert book.awards == ["Newbery Medal"]


def test_book_search_defaults():
    params = BookSearchParams()
    assert params.q is None
    assert params.sort == "popularity"
    assert params.page == 1
    assert params.per_page == 24


def test_curated_list_create():
    lst = CuratedListCreate(
        name="Test List",
        slug="test-list",
        description="A test list",
        category="History",
        is_featured=True,
    )
    assert lst.slug == "test-list"
    assert lst.is_featured is True


def test_librarian_request():
    req = LibrarianRequest(message="books about nature for age 7")
    assert req.message == "books about nature for age 7"
    assert req.context is None


def test_checkout_session():
    session = CheckoutSessionCreate(
        success_url="https://example.com/success",
        cancel_url="https://example.com/cancel",
    )
    assert "success" in session.success_url
