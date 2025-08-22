from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from contextlib import contextmanager
import os

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sqlite_path = os.path.join(base_dir, 'dev.db')
DB_URL = os.getenv("DB_URL", f"sqlite:///{sqlite_path}")

connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, pool_pre_ping=True, future=True, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

class Base(DeclarativeBase):
    pass

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close() 