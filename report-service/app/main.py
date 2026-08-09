from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from datetime import datetime, timezone
import os

from .database import engine, Base, get_db
from . import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Report Service")

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
TRANSACTION_SERVICE_URL = _required_env("TRANSACTION_SERVICE_URL")


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get(
    "/reports/account/{account_id}", response_model=schemas.FinancialReportResponse
)
def generate_report(account_id: int, db: Session = Depends(get_db)):

    try:
        with httpx.Client() as client:
            account_res = client.get(f"{ACCOUNT_SERVICE_URL}/{account_id}")
            if account_res.status_code == 404:
                raise HTTPException(
                    status_code=404, detail="Account not found in system"
                )
            account_data = account_res.json()

            tx_res = client.get(f"{TRANSACTION_SERVICE_URL}/{account_id}")
            tx_data = tx_res.json() if tx_res.status_code == 200 else []

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503, detail=f"Internal service communication failed: {str(e)}"
        )

    total_deposits = sum(
        t["amount"] for t in tx_data if t["transaction_type"] == "deposit"
    )
    total_withdrawals = sum(
        t["amount"] for t in tx_data if t["transaction_type"] == "withdrawal"
    )

    db_report = models.ReportHistory(
        account_id=account_id,
        total_deposits=total_deposits,
        total_withdrawals=total_withdrawals,
    )
    db.add(db_report)
    db.commit()

    return {
        "account_id": account_id,
        "account_name": account_data["name"],
        "account_email": account_data["email"],
        "current_balance": account_data["balance"],
        "total_deposits": total_deposits,
        "total_withdrawals": total_withdrawals,
        "transaction_history": tx_data,
        "generated_at": datetime.now(timezone.utc),
    }
