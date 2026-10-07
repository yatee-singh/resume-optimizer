from uuid import UUID

from pydantic import BaseModel, EmailStr


class RegisterRequest(
    BaseModel
):
    email: EmailStr
    name: str
    password: str


class LoginRequest(
    BaseModel
):
    email: EmailStr
    password: str


class AuthUser(
    BaseModel
):
    id: UUID
    email: str
    name: str

    model_config = {
        "from_attributes": True
    }


class LoginResponse(
    BaseModel
):
    access_token: str
    token_type: str
    user: AuthUser