from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .database import engine, Base, get_db
from . import crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Transaction Service")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/transactions", response_model=schemas.TransactionResponse, status_code=201)
def create_new_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    
    if transaction.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'deposit' or 'withdrawal'.")
    
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")
    
    return crud.create_transaction(db=db, transaction=transaction)


@app.get("/transactions/account/{account_id}", response_model=List[schemas.TransactionResponse])
def read_account_transactions(account_id: int, db: Session = Depends(get_db)):
    
    return crud.get_transactions_by_account(db, account_id=account_id)