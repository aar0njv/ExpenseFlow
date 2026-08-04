from sqlalchemy.orm import Session
from . import models, schemas, security


def get_account(db: Session, account_id: int):
    return db.query(models.Account).filter(models.Account.id == account_id).first()


def get_account_by_email(db: Session, email: str):
    return db.query(models.Account).filter(models.Account.email == email).first()


def create_account(db: Session, account: schemas.AccountCreate):
    hashed_pwd = security.get_password_hash(account.password)

    db_account = models.Account(
        name=account.name,
        email=account.email,
        hashed_password=hashed_pwd,
        balance=account.balance,
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def authenticate_user(db: Session, email: str, password: str):
    user = get_account_by_email(db, email=email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


def update_account_balance(
    db: Session, account_id: int, balance_update: schemas.BalanceUpdate
):
    db_account = get_account(db, account_id=account_id)
    if db_account is None:
        return None

    if balance_update.transaction_type == "deposit":
        db_account.balance += balance_update.amount
    else:
        db_account.balance -= balance_update.amount

    db.commit()
    db.refresh(db_account)
    return db_account
