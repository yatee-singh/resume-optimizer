from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import (
    create_access_token,
    get_current_user,
)
from app.core.security import (
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.user import User
from app.schema.auth import (
    AuthUser,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/register",
    response_model=AuthUser,
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(
        get_db
    ),
):
    existing = db.scalar(
        select(User).where(
            User.email
            == payload.email
        )
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = User(
        email=payload.email,
        name=payload.name,
        password_hash=hash_password(
            payload.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(
        get_db
    ),
):
    user = db.scalar(
        select(User).where(
            User.email
            == payload.email
        )
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        user.id
    )

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user,
    )


@router.get(
    "/me",
    response_model=AuthUser,
)
def me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user