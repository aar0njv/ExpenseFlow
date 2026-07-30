from pydantic import BaseModel

class AccountBase(BaseModel):
    name: str
    email: str

class AccountCreate(AccountBase):
    balance: float = 0.0

class BalanceUpdate(BaseModel):
    amount: float
    transaction_type: str

class AccountResponse(AccountBase):
    id: int
    balance: float

    class Config:
        from_attributes = True


# Pydantic ensures that if we forget to pass a name, or sends text instead of a numeric balance, the API rejects it instantly before hitting the database.
