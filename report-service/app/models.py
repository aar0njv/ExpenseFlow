from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime, timezone
from .database import Base


class ReportHistory(Base):
    __tablename__ = "report_history"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, index=True, nullable=False)
    total_withdrawals = Column(Float, default=0.0)
    total_deposits = Column(Float, default=0.0)
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
