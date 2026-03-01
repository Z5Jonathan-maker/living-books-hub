from sqlalchemy import Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.sql import func

from app.core.database import Base


class EmailDripEvent(Base):
    __tablename__ = "email_drip_events"

    id = Column(Integer, primary_key=True, index=True)
    subscriber_id = Column(Integer, ForeignKey("email_subscribers.id"), nullable=False, index=True)
    campaign = Column(String, nullable=False, default="welcome")
    step = Column(Integer, nullable=False)
    sent_at = Column(DateTime, server_default=func.now(), nullable=False)
