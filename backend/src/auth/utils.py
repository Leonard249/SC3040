from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
users_collection = db["users"]

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def send_reset_email(user_id: str, token: str):
    user = await users_collection.find_one({"_id": user_id})
    if not user:
        raise ValueError("User not found in the database")
    
    email = user["email"]
    api_url = os.environ.get("EMAIL_SERVER") + "send-reset-email"
    payload = {
        "email": email,
        "token": token
    }
    response = requests.post(api_url, json=payload)
    
    if response.status_code != 200:
        raise RuntimeError(f"Failed to send email: {response.text}")
