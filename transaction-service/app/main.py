from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from urllib import request, error
import json
import os
from .database import engine, Base, get_db
from . import crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Transaction Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} environment variable is required")
    return value


ACCOUNT_SERVICE_URL = _required_env("ACCOUNT_SERVICE_URL")


def update_account_balance(transaction: schemas.TransactionCreate):
    payload = json.dumps(
        {
            "amount": transaction.amount,
            "transaction_type": transaction.transaction_type,
        }
    ).encode("utf-8")
    req = request.Request(
        f"{ACCOUNT_SERVICE_URL}/accounts/{transaction.account_id}/balance",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="PATCH",
    )

    try:
        request.urlopen(req, timeout=5)
    except error.HTTPError as exc:
        if exc.code == 404:
            raise HTTPException(status_code=404, detail="Account not found")
        raise HTTPException(
            status_code=exc.code, detail="Failed to update account balance"
        )
    except error.URLError:
        raise HTTPException(status_code=503, detail="Account service unavailable")


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/transactions", response_model=schemas.TransactionResponse, status_code=201)
def create_new_transaction(
    transaction: schemas.TransactionCreate, db: Session = Depends(get_db)
):

    if transaction.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(
            status_code=400, detail="Invalid type. Must be 'deposit' or 'withdrawal'."
        )

    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    db_transaction = crud.create_transaction(db=db, transaction=transaction)
    update_account_balance(transaction)
    return db_transaction


@app.get(
    "/transactions/account/{account_id}",
    response_model=List[schemas.TransactionResponse],
)
def read_account_transactions(account_id: int, db: Session = Depends(get_db)):

    return crud.get_transactions_by_account(db, account_id=account_id)
