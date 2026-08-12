import os
from unittest.mock import patch, MagicMock

# Set dummy env vars for testing before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ACCOUNT_SERVICE_URL"] = "http://localhost:8001/accounts"
os.environ["TRANSACTION_SERVICE_URL"] = "http://localhost:8002/transactions/account"

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


@patch("app.main.httpx.Client")
def test_generate_report_success(mock_httpx_client_class):
    mock_client_instance = MagicMock()
    mock_httpx_client_class.return_value.__enter__.return_value = mock_client_instance

    def side_effect(url, *args, **kwargs):
        mock_response = MagicMock()
        if "8001" in url:
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "id": 1,
                "name": "Report User",
                "email": "reportuser@example.com",
                "balance": 500.0,
            }
        elif "8002" in url:
            mock_response.status_code = 200
            mock_response.json.return_value = [
                {"id": 1, "account_id": 1, "amount": 600.0, "transaction_type": "deposit", "timestamp": "2026-08-12T15:00:00Z"},
                {"id": 2, "account_id": 1, "amount": 100.0, "transaction_type": "withdrawal", "timestamp": "2026-08-12T15:05:00Z"},
            ]
        return mock_response

    mock_client_instance.get.side_effect = side_effect

    response = client.get("/reports/account/1")
    assert response.status_code == 200
    data = response.json()
    assert data["account_id"] == 1
    assert data["account_name"] == "Report User"
    assert data["account_email"] == "reportuser@example.com"
    assert data["current_balance"] == 500.0
    assert data["total_deposits"] == 600.0
    assert data["total_withdrawals"] == 100.0
