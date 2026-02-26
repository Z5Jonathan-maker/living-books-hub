import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CuratedList(Base):
    __tablename__ = "curated_lists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_featured: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    items: Mapped[list["ListItem"]] = relationship(
        back_populates="curated_list", cascade="all, delete", order_by="ListItem.rank"
    )


class ListItem(Base):
    __tablename__ = "list_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    list_id: Mapped[int] = mapped_column(
        ForeignKey("curated_lists.id", ondelete="CASCADE"), nullable=False
    )
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    rank: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    curated_list: Mapped["CuratedList"] = relationship(back_populates="items")
    book: Mapped["Book"] = relationship(back_populates="list_items")


from app.models.book import Book  # noqa: E402, F401
