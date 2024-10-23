from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    phone_number: str
    username: str
    pic_url: str
    password: str
