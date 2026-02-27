import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    subscription_tier: Mapped[str] = mapped_column(String(20), nullable=False, default="free")
    subscription_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    magic_link_token: Mapped[str | None] = mapped_column(String(500), nullable=True)
    magic_link_expires_at: Mapped[datetime.datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    children: Mapped[list["Child"]] = relationship(back_populates="user", cascade="all, delete")
    reading_plans: Mapped[list["ReadingPlan"]] = relationship(
        back_populates="user", cascade="all, delete"
    )
    reviews: Mapped[list["BookReview"]] = relationship(back_populates="user", cascade="all, delete")


from app.models.child import Child  # noqa: E402
from app.models.reading_plan import ReadingPlan  # noqa: E402
from app.models.review import BookReview  # noqa: E402
