from sqlalchemy import Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.sql import func

from app.core.database import Base


class NewsletterSend(Base):
    __tablename__ = "newsletter_sends"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    subject = Column(String, nullable=False)
    sent_at = Column(DateTime, server_default=func.now(), nullable=False)
    recipient_count = Column(Integer, nullable=False, default=0)
