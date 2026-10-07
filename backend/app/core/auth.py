from datetime import UTC, datetime, timedelta
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

SECRET_KEY = "change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def create_access_token(
    user_id: UUID,
):
    expire = (
        datetime.now(UTC)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_current_user(
    token: str = Depends(
        oauth2_scheme
    ),
    db: Session = Depends(
        get_db
    ),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get(
            "sub"
        )

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.get(
        User,
        user_id,
    )

    if user is None:
        raise credentials_exception

    return user