from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .deps import get_current_account
from . import crud, schemas, security, models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Account Service")

# --- CORS Middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/accounts", response_model=schemas.AccountResponse, status_code=201)
def create_new_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    existing_account = crud.get_account_by_email(db, email=account.email)
    if existing_account:
        raise HTTPException(status_code=400, detail="Email already registered.")
    return crud.create_account(db=db, account=account)


# --- Login and Token Generation
@app.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    account = crud.authenticate_user(
        db, email=credentials.email, password=credentials.password
    )
    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = security.create_access_token(data={"sub": str(account.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# --- Protected Route Example
@app.get("/accounts/me", response_model=schemas.AccountResponse)
def read_current_account(
    current_account: models.Account = Depends(get_current_account),
):
    return current_account


@app.get("/accounts/{account_id}", response_model=schemas.AccountResponse)
def read_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


@app.patch("/accounts/{account_id}/balance", response_model=schemas.AccountResponse)
def update_account_balance(
    account_id: int,
    balance_update: schemas.BalanceUpdate,
    db: Session = Depends(get_db),
):
    if balance_update.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(
            status_code=400, detail="Invalid type. Must be 'deposit' or 'withdrawal'."
        )

    if balance_update.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    db_account = crud.update_account_balance(
        db, account_id=account_id, balance_update=balance_update
    )
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account
