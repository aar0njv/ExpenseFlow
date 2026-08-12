import os
from unittest.mock import patch

# Set dummy env vars for testing before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ACCOUNT_SERVICE_URL"] = "http://localhost:8001"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


@patch("app.main.update_account_balance")
def test_create_transaction_success(mock_update_balance):
    mock_update_balance.return_value = None

    transaction_data = {
        "account_id": 1,
        "amount": 150.0,
        "transaction_type": "deposit",
        "description": "Salary deposit",
    }
    response = client.post("/transactions", json=transaction_data)
    assert response.status_code == 201
    data = response.json()
    assert data["account_id"] == 1
    assert data["amount"] == 150.0
    assert data["transaction_type"] == "deposit"
    mock_update_balance.assert_called_once()


def test_create_transaction_invalid_type():
    invalid_data = {
        "account_id": 1,
        "amount": 50.0,
        "transaction_type": "transfer",  # invalid
        "description": "Invalid type",
    }
    response = client.post("/transactions", json=invalid_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid type. Must be 'deposit' or 'withdrawal'."


def test_create_transaction_invalid_amount():
    invalid_data = {
        "account_id": 1,
        "amount": -10.0,  # invalid
        "transaction_type": "deposit",
        "description": "Negative amount",
    }
    response = client.post("/transactions", json=invalid_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Amount must be greater than zero."


@patch("app.main.update_account_balance")
def test_get_transactions_by_account(mock_update_balance):
    mock_update_balance.return_value = None

    # Create 2 transactions for account 1
    client.post(
        "/transactions",
        json={"account_id": 1, "amount": 100.0, "transaction_type": "deposit"},
    )
    client.post(
        "/transactions",
        json={"account_id": 1, "amount": 40.0, "transaction_type": "withdrawal"},
    )

    response = client.get("/transactions/account/1")
    assert response.status_code == 200
    txs = response.json()
    assert len(txs) == 2
