from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class ClickEvent(Base):
    __tablename__ = "click_events"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False, index=True)
    link_id = Column(Integer, nullable=True)
    source_name = Column(String, nullable=False)
    referrer = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
