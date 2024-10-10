import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from src.auth.models import User

load_dotenv()

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

print(mongo_connection_url)
mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
users_collection = db["users"]


async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})


async def create_user(email: str, hashed_password: str):
    user = User(email=email, password=hashed_password, username=email)
    await users_collection.insert_one(user.model_dump())
    return user
