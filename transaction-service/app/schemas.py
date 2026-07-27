from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    account_id: int
    amount: float
    transaction_type: str  # 'deposit' or 'withdrawal'

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True