import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from src.auth.models import User
import asyncpg

load_dotenv()

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
users_collection = db["users"]
blacklisted_tokens = set()

async def get_user_by_email_or_username(email_or_username: str):
    return await users_collection.find_one({"$or": [{"email": email_or_username}, {"username": email_or_username}]})

async def create_user(email: str, phone_number: str, username: str, pic_url: str, hashed_password: str):
    try:
        user = User(email=email, phone_number=phone_number, username=username, pic_url=pic_url, password=hashed_password)
        user_cursor = await users_collection.insert_one(user.model_dump())
        return user_cursor.inserted_id
    except Exception as e:
        print(f"Error creating user: {e}")
        raise

async def update_user_password(email: str, hashed_password: str):
    await users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

async def blacklist_token(token: str):
    blacklisted_tokens.add(token)

async def is_token_blacklisted(token: str) -> bool:
    return token in blacklisted_tokens
