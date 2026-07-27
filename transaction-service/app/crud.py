from sqlalchemy.orm import Session
from . import models, schemas

def get_transactions_by_account(db: Session, account_id: int):
    return db.query(models.Transaction).filter(models.Transaction.account_id == account_id).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(
        account_id=transaction.account_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction