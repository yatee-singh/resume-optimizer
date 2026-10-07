from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)#used to query/add/delete in db
db_session=SessionLocal()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
Base = declarative_base() #because models inherit from this class, python knows they are db classes