import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ReadingPlan(Base):
    __tablename__ = "reading_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    child_id: Mapped[int | None] = mapped_column(
        ForeignKey("children.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="reading_plans")
    child: Mapped["Child | None"] = relationship(back_populates="reading_plans")
    items: Mapped[list["ReadingPlanItem"]] = relationship(
        back_populates="plan",
        cascade="all, delete",
        order_by="ReadingPlanItem.week_number, ReadingPlanItem.order_in_week",
    )


class ReadingPlanItem(Base):
    __tablename__ = "reading_plan_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("reading_plans.id", ondelete="CASCADE"), nullable=False, index=True
    )
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE"), nullable=False
    )
    week_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    order_in_week: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="to-read")
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    plan: Mapped["ReadingPlan"] = relationship(back_populates="items")
    book: Mapped["Book"] = relationship()


from app.models.book import Book  # noqa: E402
from app.models.child import Child  # noqa: E402
from app.models.user import User  # noqa: E402
