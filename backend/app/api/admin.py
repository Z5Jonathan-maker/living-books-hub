import csv
import hmac
import io

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.book import Book, BookLink, Source
from app.models.list import CuratedList, ListItem
from app.models.schemas import (
    BookCreate,
    BookLinkCreate,
    CuratedListCreate,
    CuratedListOut,
    ListItemCreate,
    SourceCreate,
    SourceOut,
)

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


def verify_admin(x_api_key: str = Header(...)):
    if not settings.admin_api_key or not hmac.compare_digest(x_api_key, settings.admin_api_key):
        raise HTTPException(status_code=403, detail="Invalid admin API key")
    return True


@router.post("/books", response_model=dict)
async def create_book(
    book: BookCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Create a new book entry."""
    db_book = Book(**book.model_dump())
    db.add(db_book)
    await db.flush()
    return {"id": db_book.id, "title": db_book.title}


@router.post("/books/import-csv")
async def import_books_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Import books from a CSV file. Expected columns match BookCreate fields."""
    content = await file.read()
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))

    created = 0
    errors = []
    for i, row in enumerate(reader, start=2):
        try:
            subjects = [s.strip() for s in row.get("subjects", "").split("|") if s.strip()]
            awards = [a.strip() for a in row.get("awards", "").split("|") if a.strip()] or None

            book = Book(
                title=row["title"],
                author=row["author"],
                description=row["description"],
                long_description=row.get("long_description") or None,
                reading_level=row.get("reading_level") or None,
                age_range=row["age_range"],
                subjects=subjects,
                time_period=row.get("time_period") or None,
                region=row.get("region") or None,
                isbn=row.get("isbn") or None,
                cover_image_url=row.get("cover_image_url") or None,
                language=row.get("language", "English"),
                series=row.get("series") or None,
                awards=awards,
                popularity_score=float(row.get("popularity_score", 0)),
                page_count=int(row["page_count"]) if row.get("page_count") else None,
                publication_year=(
                    int(row["publication_year"]) if row.get("publication_year") else None
                ),
                publisher=row.get("publisher") or None,
            )
            db.add(book)
            created += 1
        except Exception as e:
            errors.append({"row": i, "error": str(e)})

    await db.flush()
    return {"created": created, "errors": errors}


@router.post("/sources", response_model=SourceOut)
async def create_source(
    source: SourceCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Create a new book source/vendor."""
    db_source = Source(**source.model_dump())
    db.add(db_source)
    await db.flush()
    return SourceOut.model_validate(db_source)


@router.post("/book-links", response_model=dict)
async def create_book_link(
    link: BookLinkCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Create a link between a book and a source."""
    db_link = BookLink(**link.model_dump())
    db.add(db_link)
    await db.flush()
    return {"id": db_link.id}


@router.post("/lists", response_model=CuratedListOut)
async def create_list(
    lst: CuratedListCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Create a new curated list."""
    db_list = CuratedList(**lst.model_dump())
    db.add(db_list)
    await db.flush()
    return CuratedListOut.model_validate(db_list)


@router.post("/lists/{list_id}/items", response_model=dict)
async def add_list_item(
    list_id: int,
    item: ListItemCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin),
):
    """Add a book to a curated list."""
    db_item = ListItem(list_id=list_id, **item.model_dump())
    db.add(db_item)
    await db.flush()
    return {"id": db_item.id}
