from typing import Optional

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    phone_number: Optional[str] = ""
    username: Optional[str] = ""
    pic_url: Optional[str] = ""
    password: str
    pending_user_id: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str
    pending_user_id: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    email: EmailStr
    token: str
    new_password: str
