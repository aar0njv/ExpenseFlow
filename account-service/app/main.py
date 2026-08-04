from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import crud, schemas, security

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Account Service")
security_bearer = HTTPBearer()

def get_current_account(
        credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
        db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = security.decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    account_id = payload.get("sub")
    if account_id is None:
        raise HTTPException(status_code=401, detail="Invalid token claims")
        
    account = crud.get_account(db, account_id=int(account_id))
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return account



@app.get("/health")
def health_check():
    return {"status": "healthy"}



@app.post("/accounts", response_model=schemas.AccountResponse, status_code=201)
def create_new_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    
    existing_account = crud.get_account_by_email(db, email = account.email)
    if(existing_account):
        raise HTTPException(status_code=400, detail="Email already registered.")
    return crud.create_account(db = db, account = account)


# --- Login and Token Generation

@app.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    account = crud.authenticate_user(db, email=credentials.email, password=credentials.password)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = security.create_access_token(data={"sub": str(account.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# --- Protected Route Example
@app.get("/accounts/me", response_model=schemas.AccountResponse)
def read_current_account(current_account: models.Account = Depends(get_current_account)):
    return current_account


@app.get("/accounts/{account_id}", response_model=schemas.AccountResponse)
def read_account(account_id: int, db: Session = Depends(get_db)):
    db_account = crud.get_account(db, account_id=account_id)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


@app.patch("/accounts/{account_id}/balance", response_model=schemas.AccountResponse)
def update_account_balance(account_id: int, balance_update: schemas.BalanceUpdate, db: Session = Depends(get_db)):
    if balance_update.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'deposit' or 'withdrawal'.")

    if balance_update.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    db_account = crud.update_account_balance(db, account_id=account_id, balance_update=balance_update)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account
