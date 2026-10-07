from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
# from app.routers.user import router as user_router
from .database import SessionLocal, Base, engine
# from .models import User
from app.routers.optimizer import router as optimizer_router
# from .schemas import UserCreate
from app.routers.resume import router as resume_router
from app.routers.auth import router as auth_router
Base.metadata.create_all(bind=engine)

import logging



app = FastAPI()
logging.basicConfig(
    level=logging.INFO,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(user_router)
app.include_router(resume_router)
app.include_router(
    auth_router
)
app.include_router(
    optimizer_router,
)
@app.get("/")
def health():
    return {"status": "ok"}

