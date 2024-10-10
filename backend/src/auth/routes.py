import os

from fastapi import APIRouter, Depends, HTTPException
from src.auth.schemas import UserCreate, UserLogin
from src.auth.models import User
from src.auth.utils import get_password_hash, verify_password, create_access_token
from src.auth.database import get_user_by_email, create_user

ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/auth"

router = APIRouter(prefix=ROUTE_PREFIX, tags=["auth-service"])


@router.post("/register")
async def register(user: UserCreate):
    db_user = await get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_id = await create_user(user.email, hashed_password)
    return {"message": "User registered successfully", "user_id": str(user_id)}


@router.post("/login")
async def login(user: UserLogin):
    db_user = await get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token({"sub": db_user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(db_user["_id"])}


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
