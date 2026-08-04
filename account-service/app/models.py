from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from .database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# database table as a Python class
# Account maps to accounts table: id, name, email and balance
