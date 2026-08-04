from pydantic import BaseModel, EmailStr


class AccountBase(BaseModel):
    name: str
    email: str


class AccountCreate(AccountBase):
    password: str
    balance: float = 0.0


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    account_id: int | None = None


class BalanceUpdate(BaseModel):
    amount: float
    transaction_type: str


class AccountResponse(AccountBase):
    id: int
    balance: float

    class Config:
        from_attributes = True


# Pydantic ensures that if we forget to pass a name, or sends text instead of a numeric balance, the API rejects it instantly before hitting the database.
