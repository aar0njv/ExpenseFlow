import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} environment variable is required")
    return value


DATABASE_URL = _required_env("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# engine: SQLAlchemy connection to Postgres
# SessionLocal: hands out DB Sessions
# get_db(): yields a session for a request, db.close() afterwards
