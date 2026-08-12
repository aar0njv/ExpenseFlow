import os

# Set dummy env vars for testing before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "testsecretkey1234567890"
os.environ["JWT_ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database for fast unit testing
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


def test_create_account_and_login():
    # 1. Register a new user
    account_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "securepassword123",
        "balance": 100.0,
    }
    response = client.post("/accounts", json=account_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "testuser@example.com"
    assert data["balance"] == 100.0
    account_id = data["id"]

    # 2. Prevent duplicate email registration
    dup_response = client.post("/accounts", json=account_data)
    assert dup_response.status_code == 400
    assert dup_response.json()["detail"] == "Email already registered."

    # 3. Successful Login
    login_data = {
        "email": "testuser@example.com",
        "password": "securepassword123",
    }
    login_response = client.post("/login", json=login_data)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    # 4. Failed Login with invalid password
    invalid_login = {
        "email": "testuser@example.com",
        "password": "wrongpassword",
    }
    fail_response = client.post("/login", json=invalid_login)
    assert fail_response.status_code == 401


def test_update_account_balance():
    # Create user
    account_data = {
        "name": "Balance User",
        "email": "balance@example.com",
        "password": "password123",
        "balance": 50.0,
    }
    reg = client.post("/accounts", json=account_data)
    acc_id = reg.json()["id"]

    # Deposit
    deposit_resp = client.patch(
        f"/accounts/{acc_id}/balance",
        json={"amount": 25.0, "transaction_type": "deposit"},
    )
    assert deposit_resp.status_code == 200
    assert deposit_resp.json()["balance"] == 75.0

    # Withdrawal
    withdraw_resp = client.patch(
        f"/accounts/{acc_id}/balance",
        json={"amount": 15.0, "transaction_type": "withdrawal"},
    )
    assert withdraw_resp.status_code == 200
    assert withdraw_resp.json()["balance"] == 60.0
