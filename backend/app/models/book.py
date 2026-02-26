import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    author: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    long_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    reading_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    age_range: Mapped[str] = mapped_column(String(20), nullable=False)
    subjects: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    time_period: Mapped[str | None] = mapped_column(String(100), nullable=True)
    region: Mapped[str | None] = mapped_column(String(100), nullable=True)
    isbn: Mapped[str | None] = mapped_column(String(20), nullable=True, unique=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    language: Mapped[str] = mapped_column(String(50), nullable=False, default="English")
    series: Mapped[str | None] = mapped_column(String(300), nullable=True)
    awards: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    popularity_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    page_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    publication_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    publisher: Mapped[str | None] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    links: Mapped[list["BookLink"]] = relationship(back_populates="book", cascade="all, delete")
    list_items: Mapped[list["ListItem"]] = relationship(back_populates="book")


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    base_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    affiliate_tag: Mapped[str | None] = mapped_column(String(200), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    links: Mapped[list["BookLink"]] = relationship(back_populates="source")


class BookLink(Base):
    __tablename__ = "book_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    source_id: Mapped[int] = mapped_column(
        ForeignKey("sources.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(2000), nullable=False)
    link_type: Mapped[str] = mapped_column(String(20), nullable=False, default="buy")
    affiliate_tag: Mapped[str | None] = mapped_column(String(200), nullable=True)
    price_hint: Mapped[str | None] = mapped_column(String(50), nullable=True)

    book: Mapped["Book"] = relationship(back_populates="links")
    source: Mapped["Source"] = relationship(back_populates="links")


# Import for relationship resolution
from app.models.list import ListItem  # noqa: E402
