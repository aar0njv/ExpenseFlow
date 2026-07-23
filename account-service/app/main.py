from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    return { "message": "Database connection live and working" }

