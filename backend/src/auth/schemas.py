from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    phone_number: str
    username: str
    pic_url: str
    password: str

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    email: EmailStr
    token: str
    new_password: str
