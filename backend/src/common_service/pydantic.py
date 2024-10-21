# Define the Pydantic models to match the structure of your JSON payload
from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    pic_url: str
    phone: str
