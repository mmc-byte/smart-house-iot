from app.core.database import SessionLocal
from typing import Generator

def get_db() -> Generator:
    # Pide una conexión a la DB según lo definido en database.py
    db = SessionLocal() 
    try:
        yield db
    finally:
        db.close()
