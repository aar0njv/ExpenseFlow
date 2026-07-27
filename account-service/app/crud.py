from sqlalchemy.orm import Session
from . import models, schemas

def get_account(db: Session, account_id: int):
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def get_account_by_email(db: Session, email: str):
    return db.query(models.Account).filter(models.Account.email == email).first()

def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Account(
        name = account.name,
        email = account.email,
        balance = account.balance
    )

    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account