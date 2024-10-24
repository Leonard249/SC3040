import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from src.auth.models import User

load_dotenv()

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
group_collection = db["groups"]

pending_user_collection = db["pending user"]
