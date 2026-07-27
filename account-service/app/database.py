import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://account_user:account_password@localhost:5432/account_db")

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

