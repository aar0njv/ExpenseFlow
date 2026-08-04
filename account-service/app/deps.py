from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from . import crud, models, security
from .database import get_db

security_scheme = HTTPBearer()


def get_current_account(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> models.Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = security.decode_access_token(token)
    if payload is None:
        raise credentials_exception

    account_id = payload.get("sub")
    if account_id is None:
        raise credentials_exception

    try:
        account_id_int = int(account_id)
    except (TypeError, ValueError):
        raise credentials_exception from None

    account = crud.get_account(db, account_id=account_id_int)
    if account is None:
        raise credentials_exception

    return account


get_current_user = get_current_account
