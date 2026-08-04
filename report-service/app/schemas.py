from pydantic import BaseModel
from typing import List
from datetime import datetime


class TransactionSummary(BaseModel):
    id: int
    amount: float
    transaction_type: str
    timestamp: datetime


class FinancialReportResponse(BaseModel):
    account_id: int
    account_name: str
    account_email: str
    current_balance: float
    total_deposits: float
    total_withdrawals: float
    transaction_history: List[TransactionSummary]
    generated_at: datetime

    class Config:
        from_attributes = True
